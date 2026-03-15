import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useProfile, useUpdateProfile } from '@/hooks/use-profile'
import { useImageUpload } from '@/hooks/use-image-upload'
import { Input } from '@/components/ui/Input'
import { LocationInput } from '@/components/ui/LocationInput'
import { TextArea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

export default function EditProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { profile, isLoading: profileLoading } = useProfile()
  const { update, isLoading: isSaving } = useUpdateProfile()
  const { pickAndUpload, isUploading } = useImageUpload()

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [coverUri, setCoverUri] = useState<string | null>(null)

  // Pre-fill fields once profile loads
  useEffect(() => {
    if (!profile) return
    setName(profile.name ?? '')
    setBio(profile.bio ?? '')
    setLocation(profile.location ?? '')
    setAvatarUri(profile.avatar ?? null)
    setCoverUri(profile.coverPhoto ?? null)
  }, [profile])

  const handlePickAvatar = async () => {
    const result = await pickAndUpload()
    if (result) {
      setAvatarUri(result.url)
    } else if (result === null) {
      Toast.show({ type: 'error', text1: 'Error al subir imagen' })
    }
  }

  const handlePickCover = async () => {
    const result = await pickAndUpload()
    if (result) {
      setCoverUri(result.url)
    } else if (result === null) {
      Toast.show({ type: 'error', text1: 'Error al subir imagen' })
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'El nombre es requerido' })
      return
    }
    const result = await update({
      name: name.trim(),
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
      avatar: avatarUri ?? undefined,
      coverPhoto: coverUri ?? undefined,
    })
    if (result) {
      Toast.show({ type: 'success', text1: 'Perfil actualizado' })
      router.back()
    } else {
      Toast.show({ type: 'error', text1: 'Error al actualizar el perfil' })
    }
  }

  if (profileLoading && !profile) {
    return <LoadingSpinner fullScreen message="Cargando perfil..." />
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cover photo */}
        <View>
          <Text style={styles.label}>Foto de portada</Text>
          <Pressable style={styles.coverPicker} onPress={handlePickCover} disabled={isUploading}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverPreview} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Feather name="image" size={28} color={colors.mutedForeground} />
                <Text style={styles.pickerHint}>Toca para añadir portada</Text>
              </View>
            )}
            {isUploading ? (
              <View style={styles.uploadingOverlay}>
                <LoadingSpinner size="small" />
              </View>
            ) : (
              <View style={styles.coverEditBadge}>
                <Feather name="camera" size={14} color="#ffffff" />
              </View>
            )}
          </Pressable>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Text style={styles.label}>Foto de perfil</Text>
          <Pressable style={styles.avatarPicker} onPress={handlePickAvatar} disabled={isUploading}>
            <Avatar uri={avatarUri ?? undefined} name={name || profile?.name} size={80} />
            <View style={styles.avatarEditBadge}>
              <Feather name="camera" size={14} color="#ffffff" />
            </View>
          </Pressable>
        </View>

        {/* Name */}
        <Input
          label="Nombre"
          placeholder="Tu nombre completo"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
        />

        {/* Bio */}
        <TextArea
          label="Biografía"
          placeholder="Cuéntanos sobre ti..."
          value={bio}
          onChangeText={setBio}
          minHeight={100}
        />

        {/* Location */}
        <LocationInput
          label="Ubicación"
          placeholder="Ciudad, País"
          value={location}
          onChangeText={setLocation}
          onSelectPlace={(place) => setLocation(place.description)}
        />

        {/* Save */}
        <Button
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving || isUploading}
          style={styles.saveButton}
        >
          Guardar cambios
        </Button>

        <View style={{ height: insets.bottom + spacing[4] }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
  },
  form: {
    padding: spacing[5],
    gap: spacing[5],
  },
  label: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginBottom: spacing[2],
  },

  // Cover
  coverPicker: {
    height: 140,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  pickerHint: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  coverEditBadge: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar
  avatarSection: {
    alignItems: 'flex-start',
  },
  avatarPicker: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.amber[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },

  saveButton: { marginTop: spacing[2] },
})
