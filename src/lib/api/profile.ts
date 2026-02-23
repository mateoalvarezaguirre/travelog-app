import type { UserProfile } from "@/types"
import { apiClient } from "./client"

export async function getUserProfile(token: string, username?: string): Promise<UserProfile> {
  const endpoint = username ? `/users/${username}` : "/profile"
  return apiClient<UserProfile>(endpoint, { token })
}

export async function updateProfile(
  token: string,
  data: {
    name?: string
    bio?: string
    location?: string
    avatar?: string
    coverPhoto?: string
  }
): Promise<UserProfile> {
  return apiClient<UserProfile>("/profile", {
    method: "PUT",
    body: data,
    token,
  })
}

export async function getUserStats(token: string, username?: string) {
  const endpoint = username ? `/users/${username}/stats` : "/profile/stats"
  return apiClient<{
    totalDistance: string
    countriesVisited: number
    citiesExplored: number
    journalsWritten: number
    regions: { name: string; percentage: number }[]
  }>(endpoint, { token })
}
