import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors, borderRadius, fontSize, fontFamily, spacing } from '@/theme'
import type { LatLng } from '@/types'

const MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export interface PlaceSelection {
  description: string
  coordinates?: LatLng
  country?: string
}

interface Suggestion {
  placeId: string
  description: string
}

interface LocationInputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  onSelectPlace?: (place: PlaceSelection) => void
  error?: string
  containerStyle?: ViewStyle
}

export function LocationInput({
  label,
  placeholder = 'Ciudad, País',
  value,
  onChangeText,
  onSelectPlace,
  error,
  containerStyle,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressSuggestions = useRef(false)

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }
    if (!MAPS_API_KEY) {
      console.warn('[LocationInput] EXPO_PUBLIC_GOOGLE_MAPS_API_KEY no está configurado — reiniciá Metro con --clear')
      return
    }
    setIsSearching(true)
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
        `?input=${encodeURIComponent(input)}&key=${MAPS_API_KEY}&language=es`
      const res = await fetch(url)
      const json = await res.json()
      
      if (json.status === 'OK') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSuggestions(json.predictions.map((p: any) => ({
          placeId: p.place_id,
          description: p.description,
        })))
      } else {
        setSuggestions([])
      }
    } catch (e) {
      console.error('[LocationInput] error de red:', e)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleChangeText = (text: string) => {
    onChangeText(text)
    if (suppressSuggestions.current) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 400)
  }

  const handleSelect = async (suggestion: Suggestion) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    suppressSuggestions.current = true
    onChangeText(suggestion.description)
    setSuggestions([])

    if (!onSelectPlace) {
      suppressSuggestions.current = false
      return
    }

    const place: PlaceSelection = { description: suggestion.description }

    if (MAPS_API_KEY) {
      try {
        const url =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${suggestion.placeId}&fields=geometry,address_components&key=${MAPS_API_KEY}`
        const res = await fetch(url)
        const json = await res.json()
        const result = json.result

        if (result?.geometry?.location) {
          const loc = result.geometry.location
          place.coordinates = { lat: loc.lat, lng: loc.lng }
        }

        if (result?.address_components) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const countryComp = result.address_components.find((c: any) =>
            c.types.includes('country')
          )
          if (countryComp) place.country = countryComp.long_name
        }
      } catch {
        // proceed without coordinates/country
      }
    }

    onSelectPlace(place)
    suppressSuggestions.current = false
  }

  const handleBlur = () => {
    // Delay so a tap on a suggestion registers before clearing the list
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false)
      setSuggestions([])
    }, 200)
  }

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current)
    setIsFocused(true)
  }

  // Show suggestions regardless of focus state — avoids race condition where
  // isFocused becomes false before the async API response sets suggestions
  const showSuggestions = suggestions.length > 0

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.focused, !!error && styles.errorBorder]}>
        <View style={styles.iconLeft}>
          <Feather name="map-pin" size={16} color={colors.mutedForeground} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
        />
        {isSearching && (
          <ActivityIndicator size="small" color={colors.mutedForeground} style={styles.iconRight} />
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}

      {showSuggestions && (
        <View style={styles.dropdown}>
          {suggestions.map((item, index) => (
            <Pressable
              key={item.placeId}
              style={[styles.suggestionRow, index > 0 && styles.suggestionBorder]}
              onPress={() => handleSelect(item)}
            >
              <Feather name="map-pin" size={13} color={colors.amber[600]} style={styles.suggestionIcon} />
              <Text style={styles.suggestionText} numberOfLines={2}>
                {item.description}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
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
  errorBorder: {
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
  dropdown: {
    marginTop: spacing[1],
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  suggestionBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestionIcon: {
    marginRight: spacing[2],
  },
  suggestionText: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
})
