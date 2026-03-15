import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, fontFamily, fontSize } from '@/theme'
import type { MarkerType } from '@/types'

const MARKER_COLORS: Record<MarkerType, string> = {
  visited: colors.amber[600],
  planned: colors.blue[500],
  wishlist: colors.rose[500],
}

interface MapMarkerProps {
  type: MarkerType
  journalCount?: number
}

export function MapMarker({ type, journalCount }: MapMarkerProps) {
  const color = MARKER_COLORS[type]
  const showBadge = !!journalCount && journalCount > 0

  return (
    <View style={styles.container}>
      <View style={[styles.outer, { borderColor: color }]}>
        <View style={[styles.inner, { backgroundColor: color }]} />
      </View>
      {showBadge && (
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{journalCount}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs - 2,
    color: '#ffffff',
    lineHeight: 12,
  },
})
