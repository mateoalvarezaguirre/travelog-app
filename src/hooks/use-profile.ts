import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"
import { getUserProfile, updateProfile, getUserStats } from "@/lib/api/profile"
import type { UserProfile } from "@/types"

export function useProfile(username?: string) {
  const { accessToken } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await getUserProfile(accessToken, username)
      setProfile(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el perfil")
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, username])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, isLoading, error, refetch: fetchProfile }
}

export function useUpdateProfile() {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (data: {
    name?: string
    bio?: string
    location?: string
    avatar?: string
    coverPhoto?: string
  }): Promise<UserProfile | null> => {
    if (!accessToken) return null
    setIsLoading(true)
    setError(null)
    try {
      const result = await updateProfile(accessToken, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el perfil")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  return { update, isLoading, error }
}

export function useUserStats(username?: string) {
  const { accessToken } = useAuth()
  const [stats, setStats] = useState<{
    totalDistance: string
    countriesVisited: number
    citiesExplored: number
    journalsWritten: number
    regions: { name: string; percentage: number }[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    const fetch = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getUserStats(accessToken, username)
        if (!cancelled) setStats(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar estadísticas")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [accessToken, username])

  return { stats, isLoading, error }
}
