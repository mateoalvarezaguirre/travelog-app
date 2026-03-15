import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useJournals } from '@/hooks/use-journals'
import { useDebounce } from '@/hooks/use-debounce'
import { JournalCard } from '@/components/JournalCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

type TabFilter = 'todas' | 'publicadas' | 'borradores'

const TAB_FILTERS: { key: TabFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'publicadas', label: 'Publicadas' },
  { key: 'borradores', label: 'Borradores' },
]

const STATUS_MAP: Record<TabFilter, string | undefined> = {
  todas: undefined,
  publicadas: 'published',
  borradores: 'draft',
}

export default function JournalsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<TabFilter>('todas')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { journals, isLoading, error, refetch } = useJournals({
    search: debouncedSearch || undefined,
    status: STATUS_MAP[activeTab],
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
        <Text style={styles.headerTitle}>Mis Bitácoras</Text>
        <Pressable onPress={() => router.push('/(tabs)/profile')} hitSlop={8}>
          <Feather name="settings" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar bitácoras..."
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

      {/* Tab filter bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
        contentContainerStyle={styles.tabBarContent}
      >
        {TAB_FILTERS.map(tab => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
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
          ListEmptyComponent={
            <EmptyState
              title={error ? 'Error al cargar' : 'Sin bitácoras'}
              description={
                error
                  ? error
                  : searchQuery
                  ? 'No se encontraron resultados'
                  : 'Crea tu primera bitácora de viaje'
              }
              actionLabel={
                error ? 'Reintentar' : !searchQuery ? 'Crear bitácora' : undefined
              }
              onAction={
                error
                  ? refetch
                  : !searchQuery
                  ? () => router.push('/(tabs)/journals/create')
                  : undefined
              }
            />
          }
        />
      )}

      {/* FAB */}
      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing[4] }]}
        onPress={() => router.push('/(tabs)/journals/create')}
      >
        <Feather name="plus" size={24} color="#ffffff" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tabBar: {
    maxHeight: 44,
    marginBottom: spacing[2],
  },
  tabBarContent: {
    paddingHorizontal: spacing[5],
    gap: spacing[2],
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  tabActive: {
    backgroundColor: colors.amber[600],
  },
  tabText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: spacing[5],
    gap: spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing[5],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.amber[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
