import { apiClient } from "./client"

export async function registerMedia(
  token: string,
  tripId: number | string,
  url: string,
  caption?: string
): Promise<{ id: number; url: string }> {
  return apiClient<{ id: number; url: string }>("/media", {
    method: "POST",
    body: { tripId, url, caption },
    token,
  })
}
