import React from 'react'
import { Pressable, Text, ActivityIndicator, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { colors, borderRadius, fontSize, fontFamily } from '@/theme'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps {
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: colors.primary },
    text: { color: '#ffffff' },
  },
  destructive: {
    container: { backgroundColor: colors.destructive },
    text: { color: colors.destructiveForeground },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
    text: { color: colors.foreground },
  },
  secondary: {
    container: { backgroundColor: colors.secondary },
    text: { color: colors.secondaryForeground },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.foreground },
  },
  link: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary, textDecorationLine: 'underline' },
  },
}

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { height: 44, paddingHorizontal: 20 },
    text: { fontSize: fontSize.base },
  },
  sm: {
    container: { height: 36, paddingHorizontal: 14 },
    text: { fontSize: fontSize.sm },
  },
  lg: {
    container: { height: 52, paddingHorizontal: 28 },
    text: { fontSize: fontSize.lg },
  },
  icon: {
    container: { height: 44, width: 44, paddingHorizontal: 0 },
    text: { fontSize: fontSize.base },
  },
}

export function Button({
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        v.container,
        s.container,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color as string} size="small" />
      ) : typeof children === 'string' ? (
        <Text style={[styles.text, v.text, s.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  text: {
    fontFamily: fontFamily.sans.semibold,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
})
