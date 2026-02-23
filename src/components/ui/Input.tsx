import React, { useState } from 'react'
import { View, TextInput, Text, Pressable, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native'
import { colors, borderRadius, fontSize, fontFamily, spacing } from '@/theme'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
      ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon && { paddingLeft: 0 }, style]}
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
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    minHeight: 44,
  },
  focused: {
    borderColor: colors.ring,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.destructive,
  },
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
  input: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
    paddingVertical: spacing[2.5],
  },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.destructive,
    marginTop: spacing[1],
  },
})
