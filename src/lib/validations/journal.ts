import { z } from "zod"

export const journalSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(150, "El título no puede superar los 150 caracteres"),
  date: z
    .string()
    .min(1, "La fecha es obligatoria"),
  location: z
    .string()
    .min(1, "La ubicación es obligatoria"),
  content: z
    .string()
    .min(1, "El contenido es obligatorio")
    .min(10, "El contenido debe tener al menos 10 caracteres"),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  isPublic: z.boolean(),
  imageIds: z.array(z.number()).optional(),
})

export type JournalFormData = z.infer<typeof journalSchema>
