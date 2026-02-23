import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { colors, fontFamily } from '@/theme'

interface AvatarProps {
  uri?: string | null
  name?: string
  size?: number
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    )
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.muted,
  },
  fallback: {
    backgroundColor: colors.amber[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fontFamily.sans.semibold,
    color: colors.amber[700],
  },
})
