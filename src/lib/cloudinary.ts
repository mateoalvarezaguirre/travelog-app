import Constants from 'expo-constants'

const CLOUD_NAME = Constants.expoConfig?.extra?.cloudinaryCloudName || process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
const UPLOAD_PRESET = Constants.expoConfig?.extra?.cloudinaryUploadPreset || process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""

export async function uploadToCloudinary(uri: string): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()

  const filename = uri.split('/').pop() || 'photo.jpg'
  const match = /\.(\w+)$/.exec(filename)
  const type = match ? `image/${match[1]}` : 'image/jpeg'

  formData.append("file", {
    uri,
    name: filename,
    type,
  } as unknown as Blob)
  formData.append("upload_preset", UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }
  )

  if (!response.ok) {
    throw new Error("Error al subir la imagen")
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}
