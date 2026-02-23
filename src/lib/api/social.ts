import type { Comment } from "@/types"
import { apiClient } from "./client"

export async function likeJournal(token: string, journalId: number | string): Promise<{ likesCount: number }> {
  return apiClient<{ likesCount: number }>(`/journals/${journalId}/like`, {
    method: "POST",
    token,
  })
}

export async function unlikeJournal(token: string, journalId: number | string): Promise<{ likesCount: number }> {
  return apiClient<{ likesCount: number }>(`/journals/${journalId}/unlike`, {
    method: "POST",
    token,
  })
}

export async function getComments(journalId: number | string): Promise<Comment[]> {
  return apiClient<Comment[]>(`/journals/${journalId}/comments`)
}

export async function addComment(token: string, journalId: number | string, text: string): Promise<Comment> {
  return apiClient<Comment>(`/journals/${journalId}/comments`, {
    method: "POST",
    body: { text },
    token,
  })
}

export async function followUser(token: string, userId: number | string): Promise<void> {
  return apiClient<void>(`/users/${userId}/follow`, {
    method: "POST",
    token,
  })
}

export async function unfollowUser(token: string, userId: number | string): Promise<void> {
  return apiClient<void>(`/users/${userId}/unfollow`, {
    method: "POST",
    token,
  })
}
