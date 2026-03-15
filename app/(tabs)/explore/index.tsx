import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getPublicJournals } from '@/lib/api/journals'
import { useDebounce } from '@/hooks/use-debounce'
import { useAuth } from '@/hooks/use-auth'
import { JournalCard } from '@/components/JournalCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'
import type { Journal, PaginationMeta } from '@/types'

type FilterKey = 'recientes' | 'populares' | 'seguidos'

const FILTERS: { key: FilterKey; label: string; tab: string }[] = [
  { key: 'recientes', label: 'Recientes', tab: 'recent' },
  { key: 'populares', label: 'Populares', tab: 'popular' },
  { key: 'seguidos', label: 'Mis seguidos', tab: 'following' },
]

export default function ExploreScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { accessToken } = useAuth()

  const [filter, setFilter] = useState<FilterKey>('recientes')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [journals, setJournals] = useState<Journal[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJournals = useCallback(
    async (pageNum: number, replace: boolean) => {
      if (pageNum === 1 && replace) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)
      try {
        const result = await getPublicJournals({
          page: pageNum,
          search: debouncedSearch || undefined,
          tab: FILTERS.find(f => f.key === filter)?.tab,
        })
        setJournals(prev => (replace ? result.data : [...prev, ...result.data]))
        setMeta(result.meta)
        setPage(pageNum)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar bitácoras')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [debouncedSearch, filter]
  )

  // Reset and reload when search or filter changes
  useEffect(() => {
    fetchJournals(1, true)
  }, [debouncedSearch, filter])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchJournals(1, true)
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (isLoadingMore || !meta || page >= meta.lastPage) return
    fetchJournals(page + 1, false)
  }

  const handleFilterChange = (key: FilterKey) => {
    if (key === 'seguidos' && !accessToken) return
    setFilter(key)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar destinos, autores..."
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {FILTERS.map(f => {
          const isDisabled = f.key === 'seguidos' && !accessToken
          const isActive = filter === f.key
          return (
            <Pressable
              key={f.key}
              onPress={() => handleFilterChange(f.key)}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
                isDisabled && styles.filterChipDisabled,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                  isDisabled && styles.filterChipTextDisabled,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={item => String(item)}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          data={journals}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <JournalCard
              journal={item}
              onPress={() => router.push(`/(tabs)/journals/${item.id}`)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            journals.length === 0 && styles.emptyContainer,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.amber[600]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListEmptyComponent={
            <EmptyState
              title={error ? 'Error al cargar' : 'Sin resultados'}
              description={
                error
                  ? error
                  : searchQuery
                  ? 'No se encontraron bitácoras para tu búsqueda'
                  : filter === 'seguidos'
                  ? 'Las personas que sigues aún no han publicado'
                  : 'Aún no hay bitácoras públicas'
              }
              actionLabel={error ? 'Reintentar' : undefined}
              onAction={error ? () => fetchJournals(1, true) : undefined}
            />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={colors.amber[600]} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['2xl'],
    color: colors.foreground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing[5],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[3],
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  filterBar: {
    maxHeight: 44,
    marginBottom: spacing[2],
  },
  filterBarContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  filterChipActive: {
    backgroundColor: colors.amber[600],
  },
  filterChipDisabled: {
    opacity: 0.4,
  },
  filterChipText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextDisabled: {
    color: colors.mutedForeground,
  },
  listContent: {
    padding: spacing[5],
    gap: spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingMore: {
    paddingVertical: spacing[6],
    alignItems: 'center',
  },
})
