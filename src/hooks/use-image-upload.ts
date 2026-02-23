import { useState, useCallback } from "react"
import * as ImagePicker from 'expo-image-picker'
import { uploadToCloudinary } from "@/lib/cloudinary"

interface UploadedImage {
  url: string
  publicId: string
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pickAndUpload = useCallback(async (): Promise<UploadedImage | null> => {
    setError(null)

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      setError("Se necesitan permisos para acceder a la galería.")
      return null
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    })

    if (result.canceled || !result.assets[0]) {
      return null
    }

    const asset = result.assets[0]
    setIsUploading(true)
    try {
      const uploaded = await uploadToCloudinary(asset.uri)
      return uploaded
    } catch {
      setError("Error al subir la imagen. Intenta de nuevo.")
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const uploadFromUri = useCallback(async (uri: string): Promise<UploadedImage | null> => {
    setError(null)
    setIsUploading(true)
    try {
      const uploaded = await uploadToCloudinary(uri)
      return uploaded
    } catch {
      setError("Error al subir la imagen. Intenta de nuevo.")
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  return { pickAndUpload, uploadFromUri, isUploading, error }
}
