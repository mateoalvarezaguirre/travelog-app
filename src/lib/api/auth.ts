import { apiClient } from "./client"

interface LoginResponse {
  user: {
    id: number
    name: string
    email: string
    username: string
    avatar: string | null
  }
  token: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export async function loginWithCredentials(email: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  })
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/google", {
    method: "POST",
    body: { id_token: idToken },
  })
}

export async function registerUser(data: RegisterPayload): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/register", {
    method: "POST",
    body: data,
  })
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  })
}

export async function getMe(token: string) {
  return apiClient<LoginResponse["user"]>("/auth/me", { token })
}
