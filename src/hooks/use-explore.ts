import { useState, useEffect, useCallback } from "react"
import { getPublicJournals } from "@/lib/api/journals"
import type { Journal, PaginatedResponse } from "@/types"

interface UseExploreParams {
  page?: number
  search?: string
  tag?: string
  destination?: string
  tab?: string
}

export function useExplore(params?: UseExploreParams) {
  const [data, setData] = useState<PaginatedResponse<Journal> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJournals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getPublicJournals(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar bitácoras")
    } finally {
      setIsLoading(false)
    }
  }, [params?.page, params?.search, params?.tag, params?.destination, params?.tab])

  useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  return { data, journals: data?.data ?? [], meta: data?.meta ?? null, isLoading, error, refetch: fetchJournals }
}
