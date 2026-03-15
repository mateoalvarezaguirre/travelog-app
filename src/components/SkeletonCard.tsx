import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { colors, borderRadius, spacing } from '@/theme'

export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [opacity])

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={styles.subtitleLine} />
        <View style={styles.footer}>
          <View style={styles.footerPiece} />
          <View style={[styles.footerPiece, { width: 60 }]} />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray[200],
  },
  content: {
    padding: spacing[3],
    gap: spacing[2],
  },
  titleLine: {
    height: 18,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
    width: '75%',
  },
  subtitleLine: {
    height: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
    width: '55%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[1],
  },
  footerPiece: {
    height: 12,
    width: 90,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray[200],
  },
})
