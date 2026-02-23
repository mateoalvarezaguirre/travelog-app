import type { Journal, CreateJournalPayload, UpdateJournalPayload, PaginatedResponse } from "@/types"
import { apiClient } from "./client"

interface GetJournalsParams {
  page?: number
  search?: string
  tag?: string
  status?: string
  tab?: string
}

export async function getJournals(token: string, params?: GetJournalsParams): Promise<PaginatedResponse<Journal>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.search) searchParams.set("search", params.search)
  if (params?.tag) searchParams.set("tag", params.tag)
  if (params?.status) searchParams.set("status", params.status)
  if (params?.tab) searchParams.set("tab", params.tab)

  const query = searchParams.toString()
  return apiClient<PaginatedResponse<Journal>>(`/journals${query ? `?${query}` : ""}`, { token })
}

export async function getJournal(token: string, id: number | string): Promise<Journal> {
  return apiClient<Journal>(`/journals/${id}`, { token })
}

export async function createJournal(token: string, data: CreateJournalPayload): Promise<Journal> {
  return apiClient<Journal>("/journals", {
    method: "POST",
    body: data,
    token,
  })
}

export async function updateJournal(token: string, id: number | string, data: UpdateJournalPayload): Promise<Journal> {
  return apiClient<Journal>(`/journals/${id}`, {
    method: "PUT",
    body: data,
    token,
  })
}

export async function deleteJournal(token: string, id: number | string): Promise<void> {
  return apiClient<void>(`/journals/${id}`, {
    method: "DELETE",
    token,
  })
}

export async function getPublicJournals(params?: {
  page?: number
  search?: string
  tag?: string
  destination?: string
  tab?: string
}): Promise<PaginatedResponse<Journal>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.search) searchParams.set("search", params.search)
  if (params?.tag) searchParams.set("tag", params.tag)
  if (params?.destination) searchParams.set("destination", params.destination)
  if (params?.tab) searchParams.set("tab", params.tab)

  const query = searchParams.toString()
  return apiClient<PaginatedResponse<Journal>>(`/journals/public${query ? `?${query}` : ""}`)
}
