import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Image,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { journalSchema, type JournalFormData } from '@/lib/validations/journal'
import { useJournal, useCreateJournal, useUpdateJournal } from '@/hooks/use-journals'
import { updateJournal } from '@/lib/api/journals'
import { useImageUpload } from '@/hooks/use-image-upload'
import { useAuth } from '@/hooks/use-auth'
import { registerMedia } from '@/lib/api/media'
import { Input } from '@/components/ui/Input'
import { LocationInput } from '@/components/ui/LocationInput'
import { TextArea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

interface UploadedImage {
  id?: number   // undefined until registered with the backend (create mode)
  url: string
  publicId: string
}

export default function CreateJournalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const isEditMode = !!id

  // Data hooks
  const { journal, isLoading: journalLoading } = useJournal(id ?? 0)
  const { create, isLoading: isCreating } = useCreateJournal()
  const { update, isLoading: isUpdating } = useUpdateJournal(id ?? 0)
  const { pickAndUpload, isUploading } = useImageUpload()
  const { accessToken } = useAuth()

  // Local state
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      tags: [],
      status: 'draft',
      isPublic: false,
    },
  })

  const tags = watch('tags') ?? []
  const status = watch('status')
  const isPublic = watch('isPublic')

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!isEditMode || !journal) return
    const journalDate = journal.date ? new Date(journal.date) : new Date()
    setSelectedDate(journalDate)
    reset({
      title: journal.title,
      content: journal.content,
      date: journal.date,
      location: journal.location,
      tags: journal.tags ?? [],
      status: journal.status,
      isPublic: journal.isPublic,
    })
    if (journal.images?.length) {
      setUploadedImages(
        journal.images.map(img => ({ id: img.id, url: img.url, publicId: '' }))
      )
    }
  }, [journal, isEditMode])

  const handleDateChange = (_event: unknown, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (date) {
      setSelectedDate(date)
      setValue('date', date.toISOString().split('T')[0])
    }
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setValue('tags', [...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setValue('tags', tags.filter(t => t !== tag))
  }

  const handleAddImage = async () => {
    if (uploadedImages.length >= 5 || isUploading || !accessToken) return
    const cloudinary = await pickAndUpload()
    if (!cloudinary) return

    if (isEditMode && id) {
      // Edit mode: register with the backend immediately (trip_id is known)
      try {
        const media = await registerMedia(accessToken, id, cloudinary.url)
        setUploadedImages(prev => [...prev, { id: media.id, url: media.url, publicId: cloudinary.publicId }])
      } catch {
        Toast.show({ type: 'error', text1: 'Error al registrar imagen' })
      }
    } else {
      // Create mode: store Cloudinary result locally; backend registration happens in onSubmit
      setUploadedImages(prev => [...prev, { url: cloudinary.url, publicId: cloudinary.publicId }])
    }
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: JournalFormData) => {
    if (!accessToken) return

    if (isEditMode) {
      // Edit mode: all images already have backend IDs (pre-filled or registered in handleAddImage)
      const result = await update({ ...data, imageIds: uploadedImages.map(img => img.id as number) })
      if (result) {
        Toast.show({ type: 'success', text1: 'Bitácora actualizada' })
        router.replace(`/(tabs)/journals/${result.id}`)
      } else {
        Toast.show({ type: 'error', text1: 'Error al actualizar' })
      }
      return
    }

    // Create mode: step 1 — create journal without images
    const created = await create({ ...data, imageIds: [] })
    if (!created) {
      Toast.show({ type: 'error', text1: 'Error al crear la bitácora' })
      return
    }

    // Step 2 — register pending Cloudinary images with the new journal's ID
    const imageIds: number[] = []
    for (const img of uploadedImages) {
      try {
        const media = await registerMedia(accessToken, created.id, img.url)
        imageIds.push(media.id)
      } catch {
        // Skip failed registrations silently
      }
    }

    // Step 3 — attach images to the journal if any were registered
    if (imageIds.length > 0) {
      await updateJournal(accessToken, created.id, { imageIds })
    }

    Toast.show({ type: 'success', text1: 'Bitácora creada' })
    router.replace(`/(tabs)/journals/${created.id}`)
  }

  if (isEditMode && journalLoading) {
    return <LoadingSpinner fullScreen message="Cargando bitácora..." />
  }

  const isSubmitting = isCreating || isUpdating

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Editar bitácora' : 'Nueva bitácora'}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Título"
              placeholder="El título de tu bitácora"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
            />
          )}
        />

        {/* Content */}
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              label="Contenido"
              placeholder="Escribe sobre tu viaje..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.content?.message}
              minHeight={160}
            />
          )}
        />

        {/* Date */}
        <View>
          <Text style={styles.label}>Fecha</Text>
          <Pressable style={styles.dateTrigger} onPress={() => setShowDatePicker(true)}>
            <Feather name="calendar" size={16} color={colors.mutedForeground} />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </Pressable>
          {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              locale="es-ES"
            />
          )}
          {Platform.OS === 'ios' && showDatePicker && (
            <Button variant="ghost" size="sm" onPress={() => setShowDatePicker(false)}>
              Confirmar fecha
            </Button>
          )}
        </View>

        {/* Location */}
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <LocationInput
              label="Ubicación"
              placeholder="Ciudad, País"
              value={value}
              onChangeText={onChange}
              onSelectPlace={(place) => {
                onChange(place.description)
                if (place.coordinates) setValue('coordinates', place.coordinates)
              }}
              error={errors.location?.message}
            />
          )}
        />

        {/* Tags */}
        <View>
          <Text style={styles.label}>Etiquetas</Text>
          <View style={styles.tagInputRow}>
            <Input
              placeholder="Añadir etiqueta..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              containerStyle={styles.tagInputContainer}
            />
            <Pressable style={styles.tagAddButton} onPress={handleAddTag}>
              <Feather name="plus" size={18} color="#ffffff" />
            </Pressable>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map(tag => (
                <Pressable key={tag} onPress={() => handleRemoveTag(tag)}>
                  <Badge variant="secondary">
                    {tag} ×
                  </Badge>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Status toggle */}
        <View>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.statusRow}>
            <Pressable
              style={[styles.statusOption, status === 'draft' && styles.statusOptionActive]}
              onPress={() => setValue('status', 'draft')}
            >
              <Feather name="file" size={16} color={status === 'draft' ? '#ffffff' : colors.mutedForeground} />
              <Text style={[styles.statusText, status === 'draft' && styles.statusTextActive]}>
                Borrador
              </Text>
            </Pressable>
            <Pressable
              style={[styles.statusOption, status === 'published' && styles.statusOptionPublish]}
              onPress={() => setValue('status', 'published')}
            >
              <Feather name="globe" size={16} color={status === 'published' ? '#ffffff' : colors.mutedForeground} />
              <Text style={[styles.statusText, status === 'published' && styles.statusTextActive]}>
                Publicar
              </Text>
            </Pressable>
          </View>
        </View>

        {/* isPublic toggle */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Visible públicamente</Text>
            <Text style={styles.switchDescription}>
              Otros usuarios podrán ver esta bitácora en Explorar
            </Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={v => setValue('isPublic', v)}
            trackColor={{ false: colors.border, true: colors.amber[400] }}
            thumbColor={isPublic ? colors.amber[600] : '#f4f3f4'}
          />
        </View>

        {/* Image upload */}
        <View>
          <Text style={styles.label}>Fotos ({uploadedImages.length}/5)</Text>
          <View style={styles.imageGrid}>
            {uploadedImages.map((img, index) => (
              <View key={`${img.publicId}.${index}`} style={styles.imageThumb}>
                <Image source={{ uri: img.url }} style={styles.thumbImage} />
                <Pressable style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                  <Feather name="x" size={12} color="#ffffff" />
                </Pressable>
              </View>
            ))}
            {uploadedImages.length < 5 && (
              <Pressable
                style={[styles.imageThumb, styles.addImageButton]}
                onPress={handleAddImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Feather name="camera" size={22} color={colors.mutedForeground} />
                    <Text style={styles.addImageText}>Añadir</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {/* Submit */}
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting || isUploading}
          style={styles.submitButton}
        >
          {isEditMode ? 'Guardar cambios' : status === 'published' ? 'Publicar' : 'Guardar borrador'}
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
    marginBottom: spacing[1],
  },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.destructive,
    marginTop: spacing[1],
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
  dateText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  tagInputContainer: { flex: 1 },
  tagAddButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.amber[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
  },
  statusOptionActive: {
    backgroundColor: colors.gray[600],
    borderColor: colors.gray[600],
  },
  statusOptionPublish: {
    backgroundColor: colors.amber[600],
    borderColor: colors.amber[600],
  },
  statusText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  statusTextActive: { color: '#ffffff' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  switchLabel: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  switchDescription: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: 2,
    maxWidth: 240,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  imageThumb: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: { width: '100%', height: '100%' },
  removeImageButton: {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  addImageText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  submitButton: { marginTop: spacing[2] },
})
