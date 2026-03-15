import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '@/hooks/use-auth'
import { useProfile, useUserStats } from '@/hooks/use-profile'
import { useJournals } from '@/hooks/use-journals'
import { Avatar } from '@/components/ui/Avatar'
import { JournalCard } from '@/components/JournalCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'
import type { Journal } from '@/types'

type TabKey = 'journals' | 'saved' | 'stats'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'journals', label: 'Bitácoras' },
  { key: 'saved', label: 'Guardados' },
  { key: 'stats', label: 'Estadísticas' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState<TabKey>('journals')
  const [refreshing, setRefreshing] = useState(false)

  const { profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile()
  const { journals, isLoading: journalsLoading, refetch: refetchJournals } = useJournals()
  const { stats, isLoading: statsLoading } = useUserStats()

  useFocusEffect(
    useCallback(() => {
      refetchProfile()
    }, [refetchProfile])
  )

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([refetchProfile(), refetchJournals()])
    setRefreshing(false)
  }, [refetchProfile, refetchJournals])

  // Fallback to auth user data while profile loads
  const displayName = profile?.name ?? user?.name ?? ''
  const displayUsername = profile?.username ?? user?.username ?? ''
  const displayBio = profile?.bio ?? user?.bio ?? null
  const displayAvatar = profile?.avatar ?? user?.avatar ?? null
  const displayCover = profile?.coverPhoto ?? user?.coverPhoto ?? null
  const displayLocation = profile?.location ?? user?.location ?? null
  const journalCount = profile?.journalCount ?? 0
  const followersCount = profile?.followersCount ?? 0
  const followingCount = profile?.followingCount ?? 0

  // ── List data driven by active tab ────────────────────────────────────────

  const getListData = (): any[] => {
    if (activeTab === 'journals') {
      return journalsLoading ? [1, 2, 3] : journals
    }
    return ['__tab_content__']
  }

  // ── Sub-renders ────────────────────────────────────────────────────────────

  const renderStatsContent = () => {
    if (statsLoading) {
      return <LoadingSpinner message="Cargando estadísticas..." />
    }
    if (!stats) {
      return (
        <EmptyState
          title="Sin estadísticas"
          description="Completa tu perfil y empieza a registrar viajes para ver tus estadísticas"
        />
      )
    }
    const cards = [
      { icon: 'navigation' as const, value: stats.totalDistance, label: 'Km recorridos' },
      { icon: 'globe' as const, value: String(stats.countriesVisited), label: 'Países' },
      { icon: 'map-pin' as const, value: String(stats.citiesExplored), label: 'Ciudades' },
      { icon: 'book-open' as const, value: String(stats.journalsWritten), label: 'Bitácoras' },
    ]
    return (
      <View style={styles.statsGrid}>
        {cards.map(card => (
          <View key={card.label} style={styles.statCard}>
            <Feather name={card.icon} size={24} color={colors.amber[600]} />
            <Text style={styles.statCardValue}>{card.value}</Text>
            <Text style={styles.statCardLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    )
  }

  const renderHeader = useCallback(() => (
    <View>
      {/* Cover photo */}
      <View style={styles.coverContainer}>
        {displayCover ? (
          <Image source={{ uri: displayCover }} style={styles.coverPhoto} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
        <Pressable
          style={[styles.settingsButton, { top: insets.top + spacing[2] }]}
          onPress={() => router.push('/(tabs)/profile/settings')}
          hitSlop={8}
        >
          <Feather name="settings" size={20} color="#ffffff" />
        </Pressable>
      </View>

      {/* Avatar row */}
      <View style={styles.avatarRow}>
        <Avatar uri={displayAvatar ?? undefined} name={displayName} size={80} style={styles.avatar} />
        <Pressable
          style={styles.editButton}
          onPress={() => router.push('/(tabs)/profile/edit')}
        >
          <Feather name="edit-2" size={13} color={colors.amber[700]} />
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </Pressable>
      </View>

      {/* User info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.username}>@{displayUsername}</Text>
        {displayBio ? <Text style={styles.bio}>{displayBio}</Text> : null}
        {displayLocation ? (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={styles.locationText}>{displayLocation}</Text>
          </View>
        ) : null}
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{journalCount}</Text>
          <Text style={styles.statLabel}>Bitácoras</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followersCount}</Text>
          <Text style={styles.statLabel}>Seguidores</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{followingCount}</Text>
          <Text style={styles.statLabel}>Siguiendo</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  ), [displayName, displayUsername, displayBio, displayAvatar, displayCover,
    displayLocation, journalCount, followersCount, followingCount, activeTab, insets.top])

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (activeTab === 'journals') {
      if (journalsLoading) return <SkeletonCard />
      return (
        <JournalCard
          journal={item as Journal}
          onPress={() => router.push(`/(tabs)/journals/${item.id}`)}
        />
      )
    }
    if (activeTab === 'saved') {
      return (
        <View style={styles.tabContent}>
          <EmptyState
            title="Guardados"
            description="Las bitácoras que guardes aparecerán aquí"
          />
        </View>
      )
    }
    return <View style={styles.tabContent}>{renderStatsContent()}</View>
  }, [activeTab, journalsLoading])

  if (profileLoading && !profile && !user) {
    return <LoadingSpinner fullScreen message="Cargando perfil..." />
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getListData()}
        keyExtractor={(item, index) => `${activeTab}-${item?.id ?? index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.amber[600]}
          />
        }
        ListEmptyComponent={
          activeTab === 'journals' && !journalsLoading ? (
            <View style={styles.tabContent}>
              <EmptyState
                title="Sin bitácoras"
                description="Aún no has escrito ninguna bitácora"
                actionLabel="Crear bitácora"
                onAction={() => router.push('/(tabs)/journals/create')}
              />
            </View>
          ) : null
        }
        ListFooterComponent={<View style={{ height: insets.bottom + spacing[6] }} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: spacing[4] },

  // Cover
  coverContainer: {
    position: 'relative',
    height: 150,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.amber[200],
  },
  settingsButton: {
    position: 'absolute',
    right: spacing[4],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar row
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    marginTop: -40,
    marginBottom: spacing[2],
  },
  avatar: {
    borderWidth: 3,
    borderColor: colors.background,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.amber[300],
    backgroundColor: colors.amber[50],
  },
  editButtonText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.amber[700],
  },

  // User info
  userInfo: {
    paddingHorizontal: spacing[5],
    gap: spacing[1],
    marginBottom: spacing[4],
  },
  name: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['2xl'],
    color: colors.foreground,
  },
  username: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  bio: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.foreground,
    lineHeight: 20,
    marginTop: spacing[1],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  locationText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[2],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[0.5],
  },
  statValue: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.foreground,
  },
  statLabel: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.amber[600],
  },
  tabText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  tabTextActive: {
    color: colors.amber[600],
  },

  // Tab content area
  tabContent: {
    padding: spacing[5],
    minHeight: 200,
    justifyContent: 'center',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    padding: spacing[5],
  },
  statCard: {
    width: '46%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardValue: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['2xl'],
    color: colors.foreground,
  },
  statCardLabel: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
})
