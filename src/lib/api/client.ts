import Constants from 'expo-constants'
import type { ApiError } from "@/types"

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:8000/api"

export class ApiClientError extends Error {
  statusCode: number
  errors?: Record<string, string[]>

  constructor(error: ApiError) {
    super(error.message)
    this.name = "ApiClientError"
    this.statusCode = error.statusCode
    this.errors = error.errors
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  token?: string
}

export async function apiClient<T>(
  endpoint: string,
  { body, token, headers: customHeaders, ...options }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders as Record<string, string>,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    let errorData: Partial<ApiError>
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }

    throw new ApiClientError({
      message: errorData.message || "Error inesperado",
      errors: errorData.errors,
      statusCode: response.status,
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
