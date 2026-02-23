import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"
import { getPlaces, addPlace, removePlace } from "@/lib/api/places"
import type { MapPlace, MarkerType, LatLng } from "@/types"

export function usePlaces() {
  const { accessToken } = useAuth()
  const [places, setPlaces] = useState<MapPlace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaces = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await getPlaces(accessToken)
      setPlaces(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar lugares")
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const add = useCallback(async (data: {
    name: string
    country: string
    date?: string
    coordinates: LatLng
    markerType: MarkerType
    image?: string
  }): Promise<MapPlace | null> => {
    if (!accessToken) return null
    try {
      const newPlace = await addPlace(accessToken, data)
      setPlaces(prev => [...prev, newPlace])
      return newPlace
    } catch {
      return null
    }
  }, [accessToken])

  const remove = useCallback(async (id: number | string): Promise<boolean> => {
    if (!accessToken) return false
    try {
      await removePlace(accessToken, id)
      setPlaces(prev => prev.filter(p => p.id !== id))
      return true
    } catch {
      return false
    }
  }, [accessToken])

  const visited = places.filter(p => p.markerType === "visited")
  const planned = places.filter(p => p.markerType === "planned")
  const wishlist = places.filter(p => p.markerType === "wishlist")

  return { places, visited, planned, wishlist, isLoading, error, add, remove, refetch: fetchPlaces }
}
