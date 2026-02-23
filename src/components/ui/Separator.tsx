import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import { colors } from '@/theme'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  style?: ViewStyle
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  vertical: {
    width: 1,
    backgroundColor: colors.border,
    height: '100%',
  },
})
