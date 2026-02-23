import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "./use-debounce"

export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  debounceMs = 300
) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, debounceMs)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    searchFn(debouncedQuery)
      .then(data => {
        if (!cancelled) setResults(data)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error en la búsqueda")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [debouncedQuery, searchFn])

  const clear = useCallback(() => {
    setQuery("")
    setResults([])
  }, [])

  return { query, setQuery, results, isLoading, error, clear }
}
