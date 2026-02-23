import type { MapPlace, MarkerType, LatLng } from "@/types"
import { apiClient } from "./client"

export async function getPlaces(token: string): Promise<MapPlace[]> {
  return apiClient<MapPlace[]>("/places", { token })
}

export async function addPlace(
  token: string,
  data: {
    name: string
    country: string
    date?: string
    coordinates: LatLng
    markerType: MarkerType
    image?: string
  }
): Promise<MapPlace> {
  return apiClient<MapPlace>("/places", {
    method: "POST",
    body: data,
    token,
  })
}

export async function removePlace(token: string, id: number | string): Promise<void> {
  return apiClient<void>(`/places/${id}`, {
    method: "DELETE",
    token,
  })
}
