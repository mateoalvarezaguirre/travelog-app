import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"
import { getJournals, getJournal, createJournal, updateJournal, deleteJournal } from "@/lib/api/journals"
import type { Journal, CreateJournalPayload, UpdateJournalPayload, PaginatedResponse } from "@/types"

interface UseJournalsParams {
  page?: number
  search?: string
  tag?: string
  status?: string
  tab?: string
}

export function useJournals(params?: UseJournalsParams) {
  const { accessToken } = useAuth()
  const [data, setData] = useState<PaginatedResponse<Journal> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJournals = useCallback(async () => {
    if (!accessToken) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await getJournals(accessToken, params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las bitácoras")
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, params?.page, params?.search, params?.tag, params?.status, params?.tab])

  useEffect(() => {
    fetchJournals()
  }, [fetchJournals])

  return { data, journals: data?.data ?? [], meta: data?.meta ?? null, isLoading, error, refetch: fetchJournals }
}

export function useJournal(id: string | number) {
  const { accessToken } = useAuth()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    const fetch = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getJournal(accessToken, id)
        if (!cancelled) setJournal(result)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar la bitácora")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [accessToken, id])

  return { journal, isLoading, error }
}

export function useCreateJournal() {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(async (data: CreateJournalPayload): Promise<Journal | null> => {
    if (!accessToken) return null
    setIsLoading(true)
    setError(null)
    try {
      const result = await createJournal(accessToken, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la bitácora")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  return { create, isLoading, error }
}

export function useUpdateJournal(id: string | number) {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(async (data: UpdateJournalPayload): Promise<Journal | null> => {
    if (!accessToken) return null
    setIsLoading(true)
    setError(null)
    try {
      const result = await updateJournal(accessToken, id, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la bitácora")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, id])

  return { update, isLoading, error }
}

export function useDeleteJournal() {
  const { accessToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = useCallback(async (id: string | number): Promise<boolean> => {
    if (!accessToken) return false
    setIsLoading(true)
    setError(null)
    try {
      await deleteJournal(accessToken, id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la bitácora")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  return { remove, isLoading, error }
}
