export const amber = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
} as const

export const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const

export const red = {
  50: '#fef2f2',
  100: '#fee2e2',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
} as const

export const green = {
  50: '#f0fdf4',
  100: '#dcfce7',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
} as const

export const blue = {
  50: '#eff6ff',
  100: '#dbeafe',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
} as const

export const rose = {
  50: '#fff1f2',
  100: '#ffe4e6',
  500: '#f43f5e',
  600: '#e11d48',
} as const

// Semantic tokens (light mode)
export const colors = {
  background: '#ffffff',
  foreground: '#1c1917',
  card: '#ffffff',
  cardForeground: '#1c1917',
  primary: amber[600],         // #d97706
  primaryForeground: '#451a03',
  secondary: '#f5f5f4',
  secondaryForeground: '#1c1b1a',
  muted: '#f5f5f4',
  mutedForeground: '#737373',
  accent: '#f5f5f4',
  accentForeground: '#1c1b1a',
  destructive: '#ef4444',
  destructiveForeground: '#fafaf9',
  border: '#e7e5e4',
  input: '#e7e5e4',
  ring: amber[600],
  amber,
  gray,
  red,
  green,
  blue,
  rose,
} as const
