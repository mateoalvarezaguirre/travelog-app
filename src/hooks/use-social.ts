import { useState, useEffect, useCallback } from "react"
import { useAuth } from "./use-auth"
import { likeJournal, unlikeJournal, getComments, addComment, followUser, unfollowUser } from "@/lib/api/social"
import type { Comment } from "@/types"

export function useLike(journalId: string | number, initialLiked = false, initialCount = 0) {
  const { accessToken } = useAuth()
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLiked(initialLiked)
    setLikesCount(initialCount)
  }, [initialLiked, initialCount])

  const toggleLike = useCallback(async () => {
    if (!accessToken || isLoading) return

    const wasLiked = isLiked
    const prevCount = likesCount
    setIsLiked(!wasLiked)
    setLikesCount(wasLiked ? prevCount - 1 : prevCount + 1)

    setIsLoading(true)
    try {
      const result = wasLiked
        ? await unlikeJournal(accessToken, journalId)
        : await likeJournal(accessToken, journalId)
      setLikesCount(result.likesCount)
    } catch {
      setIsLiked(wasLiked)
      setLikesCount(prevCount)
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, journalId, isLiked, likesCount, isLoading])

  return { isLiked, likesCount, toggleLike, isLoading }
}

export function useComments(journalId: string | number) {
  const { accessToken } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getComments(journalId)
      setComments(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar comentarios")
    } finally {
      setIsLoading(false)
    }
  }, [journalId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const submitComment = useCallback(async (text: string): Promise<boolean> => {
    if (!accessToken || !text.trim()) return false
    setIsSubmitting(true)
    try {
      const newComment = await addComment(accessToken, journalId, text)
      setComments(prev => [...prev, newComment])
      return true
    } catch {
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [accessToken, journalId])

  return { comments, isLoading, error, submitComment, isSubmitting, refetch: fetchComments }
}

export function useFollow(userId: string | number, initialFollowing = false) {
  const { accessToken } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsFollowing(initialFollowing)
  }, [initialFollowing])

  const toggleFollow = useCallback(async () => {
    if (!accessToken || isLoading) return

    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)

    setIsLoading(true)
    try {
      if (wasFollowing) {
        await unfollowUser(accessToken, userId)
      } else {
        await followUser(accessToken, userId)
      }
    } catch {
      setIsFollowing(wasFollowing)
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, userId, isFollowing, isLoading])

  return { isFollowing, toggleFollow, isLoading }
}
