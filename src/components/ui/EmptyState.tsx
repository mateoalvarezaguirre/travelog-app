import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fontFamily, fontSize, spacing } from '@/theme'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button onPress={onAction} size="sm" style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  icon: {
    marginBottom: spacing[4],
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: spacing[4],
  },
})
