import React from 'react'
import { ScrollView, Pressable, Text, StyleSheet, type ViewStyle } from 'react-native'
import { colors, borderRadius, fontSize, fontFamily, spacing } from '@/theme'

interface Tab {
  key: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
  style?: ViewStyle
}

export function Tabs({ tabs, activeTab, onTabChange, style }: TabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {tabs.map(tab => {
        const isActive = tab.key === activeTab
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  activeTabText: {
    color: '#ffffff',
  },
})
