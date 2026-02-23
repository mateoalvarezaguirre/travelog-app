import React from 'react'
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { colors, borderRadius, fontSize, fontFamily, spacing } from '@/theme'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface BadgeProps {
  children: string
  variant?: BadgeVariant
  style?: ViewStyle
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: colors.primary },
    text: { color: '#ffffff' },
  },
  secondary: {
    container: { backgroundColor: colors.secondary },
    text: { color: colors.secondaryForeground },
  },
  destructive: {
    container: { backgroundColor: colors.destructive },
    text: { color: colors.destructiveForeground },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
    text: { color: colors.foreground },
  },
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  const v = variantStyles[variant]

  return (
    <View style={[styles.container, v.container, style]}>
      <Text style={[styles.text, v.text]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
  },
})
