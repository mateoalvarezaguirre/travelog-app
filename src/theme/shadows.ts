import { Platform } from 'react-native'

function shadow(elevation: number, shadowRadius: number, shadowOpacity: number) {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity,
      shadowRadius,
    },
    android: {
      elevation,
    },
    default: {},
  })
}

export const shadows = {
  sm: shadow(1, 2, 0.05),
  md: shadow(3, 6, 0.1),
  lg: shadow(6, 10, 0.15),
} as const
