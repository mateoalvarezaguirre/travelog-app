import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { colors, fontFamily, fontSize, spacing } from '@/theme'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'large'
  fullScreen?: boolean
}

export function LoadingSpinner({ message, size = 'large', fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing[3],
  },
})
