import React, { useRef, useState, useMemo, useCallback } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  View,
  Text,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Location from 'expo-location'
import Toast from 'react-native-toast-message'
import { usePlaces } from '@/hooks/use-places'
import { MapMarker } from '@/components/MapMarker'
import { Input } from '@/components/ui/Input'
import { LocationInput } from '@/components/ui/LocationInput'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'
import type { MapPlace, MarkerType, LatLng } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_REGION = {
  latitude: 20,
  longitude: 10,
  latitudeDelta: 100,
  longitudeDelta: 100,
}

const MARKER_COLORS: Record<MarkerType, string> = {
  visited: colors.amber[600],
  planned: colors.blue[500],
  wishlist: colors.rose[500],
}

const MARKER_LABELS: Record<MarkerType, string> = {
  visited: 'Visitado',
  planned: 'Planeado',
  wishlist: 'Deseos',
}

type FilterKey = 'all' | MarkerType

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'visited', label: 'Visitados' },
  { key: 'planned', label: 'Planeados' },
  { key: 'wishlist', label: 'Lista de deseos' },
]

// ─── Main screen ──────────────────────────────────────────────────────────────

interface AddFormState {
  name: string
  country: string
  markerType: MarkerType
  date: string
}

const EMPTY_FORM: AddFormState = {
  name: '',
  country: '',
  markerType: 'visited',
  date: '',
}

export default function MapScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const mapRef = useRef<MapView>(null)
  const placeDetailRef = useRef<BottomSheet>(null)

  const { places, visited, planned, wishlist, isLoading, add } = usePlaces()

  const [filter, setFilter] = useState<FilterKey>('all')
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)

  // Add place form
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [pickingCoords, setPickingCoords] = useState(false)
  const [newPlaceCoords, setNewPlaceCoords] = useState<LatLng | null>(null)
  const [addForm, setAddForm] = useState<AddFormState>(EMPTY_FORM)
  const [isAdding, setIsAdding] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const snapPoints = useMemo(() => ['40%'], [])

  const filteredPlaces = useMemo<MapPlace[]>(() => {
    switch (filter) {
      case 'visited': return visited
      case 'planned': return planned
      case 'wishlist': return wishlist
      default: return places
    }
  }, [filter, places, visited, planned, wishlist])

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Keep a ref so marker onPress callbacks don't need to change when pickingCoords changes
  const pickingCoordsRef = useRef(false)
  pickingCoordsRef.current = pickingCoords

  const handleMarkerPress = useCallback((place: MapPlace) => {
    if (pickingCoordsRef.current) return
    setSelectedPlace(place)
    placeDetailRef.current?.expand()
    mapRef.current?.animateToRegion(
      {
        latitude: place.coordinates.lat,
        longitude: place.coordinates.lng,
        latitudeDelta: 5,
        longitudeDelta: 5,
      },
      400
    )
  }, [])

  const handleMapPress = useCallback((event: any) => {
    if (!pickingCoords) {
      placeDetailRef.current?.close()
      return
    }
    const { coordinate } = event.nativeEvent
    setNewPlaceCoords({ lat: coordinate.latitude, lng: coordinate.longitude })
    setPickingCoords(false)
    setIsAddFormVisible(true)
  }, [pickingCoords])

  const handleCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Toast.show({ type: 'info', text1: 'Permiso denegado', text2: 'Activa el acceso a tu ubicación en ajustes' })
      return
    }
    const loc = await Location.getCurrentPositionAsync({})
    mapRef.current?.animateToRegion(
      {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      600
    )
  }

  const handleOpenAddForm = () => {
    placeDetailRef.current?.close()
    setSelectedPlace(null)
    setAddForm(EMPTY_FORM)
    setNewPlaceCoords(null)
    setIsAddFormVisible(true)
  }

  const handlePickFromMap = () => {
    setIsAddFormVisible(false)
    setPickingCoords(true)
  }

  const handleCancelPicking = () => {
    setPickingCoords(false)
    setIsAddFormVisible(true)
  }

  const handleAddPlace = async () => {
    if (!newPlaceCoords) {
      Toast.show({ type: 'error', text1: 'Selecciona una ubicación en el mapa' })
      return
    }
    if (!addForm.name.trim() || !addForm.country.trim()) {
      Toast.show({ type: 'error', text1: 'Completa nombre y país' })
      return
    }
    setIsAdding(true)
    const result = await add({
      name: addForm.name.trim(),
      country: addForm.country.trim(),
      markerType: addForm.markerType,
      coordinates: newPlaceCoords,
      date: addForm.date || undefined,
    })
    setIsAdding(false)
    if (result) {
      Toast.show({ type: 'success', text1: 'Lugar agregado' })
      setIsAddFormVisible(false)
      setAddForm(EMPTY_FORM)
      setNewPlaceCoords(null)
      mapRef.current?.animateToRegion(
        {
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          latitudeDelta: 5,
          longitudeDelta: 5,
        },
        600
      )
    } else {
      Toast.show({ type: 'error', text1: 'Error al agregar lugar' })
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredPlaces.map(place => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.coordinates.lat,
              longitude: place.coordinates.lng,
            }}
            onPress={() => handleMarkerPress(place)}
            tracksViewChanges={false}
          >
            <MapMarker type={place.markerType} journalCount={place.journalCount} />
          </Marker>
        ))}

        {/* Preview marker while picking / after picking */}
        {newPlaceCoords && (
          <Marker
            coordinate={{ latitude: newPlaceCoords.lat, longitude: newPlaceCoords.lng }}
            pinColor={colors.amber[600]}
          />
        )}
      </MapView>

      {/* Picking-mode overlay */}
      {pickingCoords && (
        <View style={[styles.pickingOverlay, { paddingTop: insets.top + spacing[2] }]}>
          <View style={styles.pickingBanner}>
            <Feather name="crosshair" size={18} color="#ffffff" />
            <Text style={styles.pickingText}>Toca el mapa para seleccionar la ubicación</Text>
          </View>
          <Pressable style={styles.pickingCancel} onPress={handleCancelPicking}>
            <Text style={styles.pickingCancelText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {/* Filter chips — top overlay */}
      {!pickingCoords && (
        <View style={[styles.filterOverlay, { top: insets.top + spacing[3] }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {FILTER_OPTIONS.map(f => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              >
                {f.key !== 'all' && (
                  <View style={[styles.filterDot, { backgroundColor: MARKER_COLORS[f.key as MarkerType] }]} />
                )}
                <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Right-side: location button */}
      {!pickingCoords && (
        <View style={[styles.sideButtons, { bottom: insets.bottom + 96 }]}>
          <Pressable style={styles.mapIconButton} onPress={handleCurrentLocation}>
            <Feather name="navigation" size={18} color={colors.foreground} />
          </Pressable>
        </View>
      )}

      {/* FAB — bottom right */}
      {!pickingCoords && (
        <Pressable
          style={[styles.fab, { bottom: insets.bottom + spacing[4] }]}
          onPress={handleOpenAddForm}
        >
          <Feather name="plus" size={22} color="#ffffff" />
          <Text style={styles.fabLabel}>Agregar lugar</Text>
        </Pressable>
      )}

      {/* Legend — bottom left */}
      {!pickingCoords && (
        <View style={[styles.legend, { bottom: insets.bottom + spacing[4] }]}>
          {(Object.keys(MARKER_LABELS) as MarkerType[]).map(type => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: MARKER_COLORS[type] }]} />
              <Text style={styles.legendText}>{MARKER_LABELS[type]}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner message="Cargando lugares..." />
        </View>
      )}

      {/* Place detail bottom sheet */}
      <BottomSheet
        ref={placeDetailRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
        onClose={() => setSelectedPlace(null)}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedPlace && (
            <>
              <View style={styles.placeHeader}>
                <View style={styles.placeTitleRow}>
                  <Text style={styles.placeName}>{selectedPlace.name}</Text>
                  <Badge variant={
                    selectedPlace.markerType === 'visited' ? 'default'
                      : selectedPlace.markerType === 'planned' ? 'secondary'
                      : 'outline'
                  }>
                    {MARKER_LABELS[selectedPlace.markerType]}
                  </Badge>
                </View>
                <View style={styles.placeMetaRow}>
                  <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                  <Text style={styles.placeCountry}>{selectedPlace.country}</Text>
                </View>
                {selectedPlace.date && (
                  <View style={styles.placeMetaRow}>
                    <Feather name="calendar" size={14} color={colors.mutedForeground} />
                    <Text style={styles.placeMeta}>
                      {new Date(selectedPlace.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                )}
                {!!selectedPlace.journalCount && (
                  <View style={styles.placeMetaRow}>
                    <Feather name="book-open" size={14} color={colors.mutedForeground} />
                    <Text style={styles.placeMeta}>{selectedPlace.journalCount} bitácoras</Text>
                  </View>
                )}
              </View>
              <Button
                variant="default"
                onPress={() => {
                  placeDetailRef.current?.close()
                  router.push('/(tabs)/journals')
                }}
              >
                Ver bitácoras
              </Button>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Add place modal */}
      <Modal
        visible={isAddFormVisible}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsAddFormVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar lugar</Text>
            <Pressable onPress={() => setIsAddFormVisible(false)} hitSlop={8}>
              <Feather name="x" size={22} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalForm}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <LocationInput
              label="Nombre del lugar"
              placeholder="Ciudad, parque, monumento..."
              value={addForm.name}
              onChangeText={v => setAddForm(f => ({ ...f, name: v }))}
              onSelectPlace={(place) => {
                const name = place.description.split(',')[0].trim()
                setAddForm(f => ({
                  ...f,
                  name,
                  country: place.country ?? f.country,
                }))
                if (place.coordinates) setNewPlaceCoords(place.coordinates)
              }}
            />

            {/* Country */}
            <Input
              label="País"
              placeholder="Argentina, Francia..."
              value={addForm.country}
              onChangeText={v => setAddForm(f => ({ ...f, country: v }))}
            />

            {/* Date (optional) */}
            <View>
              <Text style={styles.formLabel}>Fecha de visita (opcional)</Text>
              <Pressable
                style={styles.dateTrigger}
                onPress={() => setShowDatePicker(true)}
              >
                <Feather name="calendar" size={16} color={colors.mutedForeground} />
                <Text style={[styles.dateTriggerText, !addForm.date && styles.datePlaceholder]}>
                  {addForm.date
                    ? new Date(addForm.date + 'T12:00:00').toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : 'Seleccionar fecha'}
                </Text>
                {addForm.date ? (
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      setAddForm(f => ({ ...f, date: '' }))
                      setSelectedDate(new Date())
                    }}
                  >
                    <Feather name="x" size={15} color={colors.mutedForeground} />
                  </Pressable>
                ) : null}
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  maximumDate={new Date()}
                  locale="es-ES"
                  onChange={(_event, date) => {
                    if (Platform.OS === 'android') setShowDatePicker(false)
                    if (date) {
                      setSelectedDate(date)
                      setAddForm(f => ({ ...f, date: date.toISOString().split('T')[0] }))
                    }
                  }}
                />
              )}
              {Platform.OS === 'ios' && showDatePicker && (
                <Button variant="ghost" size="sm" onPress={() => setShowDatePicker(false)}>
                  Confirmar fecha
                </Button>
              )}
            </View>

            {/* Marker type */}
            <View>
              <Text style={styles.formLabel}>Tipo</Text>
              <View style={styles.typeRow}>
                {(Object.keys(MARKER_COLORS) as MarkerType[]).map(type => (
                  <Pressable
                    key={type}
                    onPress={() => setAddForm(f => ({ ...f, markerType: type }))}
                    style={[
                      styles.typeOption,
                      { borderColor: MARKER_COLORS[type] },
                      addForm.markerType === type && {
                        backgroundColor: MARKER_COLORS[type],
                      },
                    ]}
                  >
                    <View style={[
                      styles.typeDot,
                      { backgroundColor: addForm.markerType === type ? '#ffffff' : MARKER_COLORS[type] },
                    ]} />
                    <Text style={[
                      styles.typeText,
                      addForm.markerType === type && styles.typeTextActive,
                    ]}>
                      {MARKER_LABELS[type]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Location picker */}
            <View>
              <Text style={styles.formLabel}>Ubicación</Text>
              <Pressable style={styles.locationPickerButton} onPress={handlePickFromMap}>
                <Feather
                  name={newPlaceCoords ? 'check-circle' : 'map-pin'}
                  size={18}
                  color={newPlaceCoords ? colors.green[600] : colors.amber[600]}
                />
                <Text style={[styles.locationPickerText, newPlaceCoords && styles.locationPickerTextSet]}>
                  {newPlaceCoords
                    ? `${newPlaceCoords.lat.toFixed(4)}, ${newPlaceCoords.lng.toFixed(4)}`
                    : 'Tocar para seleccionar en el mapa'}
                </Text>
              </Pressable>
            </View>

            <Button
              onPress={handleAddPlace}
              loading={isAdding}
              disabled={isAdding || !newPlaceCoords || !addForm.name.trim() || !addForm.country.trim()}
              style={styles.submitButton}
            >
              Agregar lugar
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Picking overlay
  pickingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[3],
    pointerEvents: 'box-none',
  },
  pickingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.xl,
  },
  pickingText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: '#ffffff',
  },
  pickingCancel: {
    backgroundColor: '#ffffff',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  pickingCancelText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },

  // Filter overlay
  filterOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  filterContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: colors.amber[600],
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterChipText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.foreground,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },

  // Side buttons
  sideButtons: {
    position: 'absolute',
    right: spacing[4],
    gap: spacing[2],
  },
  mapIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.amber[600],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabLabel: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: '#ffffff',
  },

  // Legend
  legend: {
    position: 'absolute',
    left: spacing[4],
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    gap: spacing[1],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.foreground,
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom sheet
  sheetBackground: { backgroundColor: '#ffffff' },
  sheetIndicator: { backgroundColor: colors.gray[300] },
  sheetContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[5],
    gap: spacing[3],
  },
  placeHeader: { gap: spacing[2] },
  placeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  placeName: {
    flex: 1,
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.foreground,
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  placeCountry: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  placeMeta: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },

  // Add place modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.foreground,
  },
  modalForm: {
    padding: spacing[5],
    gap: spacing[5],
  },
  formLabel: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  dateTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    height: 44,
  },
  dateTriggerText: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  datePlaceholder: {
    color: colors.mutedForeground,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.foreground,
  },
  typeTextActive: {
    color: '#ffffff',
  },
  locationPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.amber[300],
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    backgroundColor: colors.amber[50],
  },
  locationPickerText: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.amber[700],
  },
  locationPickerTextSet: {
    color: colors.green[600],
    fontFamily: fontFamily.sans.semibold,
  },
  submitButton: { marginTop: spacing[2] },
})
