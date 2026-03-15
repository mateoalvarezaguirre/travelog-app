import React from 'react'
import { View, Text, Image, Pressable, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useImageUpload } from '@/hooks/use-image-upload'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

export interface UploadedImage {
  url: string
  publicId: string
}

interface ImageUploadProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const { pickAndUpload, isUploading } = useImageUpload()

  const handleAdd = async () => {
    if (images.length >= maxImages || isUploading) return
    const result = await pickAndUpload()
    if (result) {
      onChange([...images, result])
    }
  }

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <View>
      <Text style={styles.label}>Fotos ({images.length}/{maxImages})</Text>
      <View style={styles.grid}>
        {images.map((img, index) => (
          <View key={img.publicId} style={styles.thumb}>
            <Image source={{ uri: img.url }} style={styles.thumbImage} />
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemove(index)}
              hitSlop={4}
            >
              <Feather name="x" size={12} color="#ffffff" />
            </Pressable>
          </View>
        ))}
        {images.length < maxImages && (
          <Pressable
            style={[styles.thumb, styles.addButton]}
            onPress={handleAdd}
            disabled={isUploading}
          >
            {isUploading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Feather name="camera" size={22} color={colors.mutedForeground} />
                <Text style={styles.addText}>Añadir</Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginBottom: spacing[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
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
  addButton: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  addText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
})
