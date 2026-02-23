import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { colors, borderRadius, spacing, shadows } from '@/theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.sm,
  },
})
