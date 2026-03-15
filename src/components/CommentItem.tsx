import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Avatar } from '@/components/ui/Avatar'
import { colors, fontFamily, fontSize, spacing } from '@/theme'
import type { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
  isOwn: boolean
  onDelete?: (id: number) => void
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function CommentItem({ comment, isOwn, onDelete }: CommentItemProps) {
  return (
    <View style={styles.container}>
      <Avatar uri={comment.user.avatar ?? undefined} name={comment.user.name} size={36} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.username}>{comment.user.name}</Text>
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
      {isOwn && onDelete && (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(comment.id)}
          hitSlop={8}
        >
          <Feather name="trash-2" size={14} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  body: {
    flex: 1,
    gap: spacing[1],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  username: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  date: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  text: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.foreground,
    lineHeight: 20,
  },
  deleteButton: {
    paddingTop: spacing[1],
  },
})
