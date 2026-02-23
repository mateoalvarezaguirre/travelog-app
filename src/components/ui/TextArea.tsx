import React, { useState } from 'react'
import { View, TextInput, Text, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native'
import { colors, borderRadius, fontSize, fontFamily, spacing } from '@/theme'

interface TextAreaProps extends TextInputProps {
  label?: string
  error?: string
  minHeight?: number
  containerStyle?: ViewStyle
}

export function TextArea({
  label,
  error,
  minHeight = 120,
  containerStyle,
  style,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { minHeight },
          isFocused && styles.focused,
          error && styles.error,
          style,
        ]}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.mutedForeground}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginBottom: spacing[1.5],
  },
  input: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2.5],
    paddingBottom: spacing[2.5],
  },
  focused: {
    borderColor: colors.ring,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.destructive,
  },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.destructive,
    marginTop: spacing[1],
  },
})
