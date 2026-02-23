import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { colors, fontFamily, fontSize, spacing, borderRadius, shadows } from '@/theme'
import { Badge } from './ui/Badge'
import type { Journal } from '@/types'

interface JournalCardProps {
  journal: Journal
  onPress?: () => void
  compact?: boolean
}

export function JournalCard({ journal, onPress, compact = false }: JournalCardProps) {
  const mainImage = journal.images?.[0]?.url

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {mainImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: mainImage }} style={[styles.image, compact && styles.imageCompact]} />
          {journal.location && (
            <View style={styles.locationBadge}>
              <Text style={styles.locationText}>{journal.location}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
          {journal.title}
        </Text>
        {!compact && journal.excerpt && (
          <Text style={styles.excerpt} numberOfLines={2}>
            {journal.excerpt}
          </Text>
        )}
        <View style={styles.footer}>
          <View style={styles.stats}>
            <Text style={styles.statText}>{journal.likesCount} me gusta</Text>
            <Text style={styles.statDot}>&middot;</Text>
            <Text style={styles.statText}>{journal.commentsCount} comentarios</Text>
          </View>
          {journal.tags && journal.tags.length > 0 && !compact && (
            <View style={styles.tags}>
              {journal.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  imageCompact: {
    aspectRatio: 16 / 10,
  },
  locationBadge: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  locationText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: '#ffffff',
  },
  content: {
    padding: spacing[3],
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  titleCompact: {
    fontSize: fontSize.base,
  },
  excerpt: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing[2],
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  statDot: {
    marginHorizontal: spacing[1],
    color: colors.mutedForeground,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing[1],
  },
})
