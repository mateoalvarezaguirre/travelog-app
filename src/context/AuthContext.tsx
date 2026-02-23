import React, { createContext, useState, useEffect, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'
import { getMe } from '@/lib/api/auth'
import { loginWithCredentials, loginWithGoogle, registerUser } from '@/lib/api/auth'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: (idToken: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  isLoading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  register: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken')
      if (token) {
        const userData = await getMe(token)
        setUser(userData as unknown as User)
        setAccessToken(token)
      }
    } catch {
      await SecureStore.deleteItemAsync('accessToken')
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await loginWithCredentials(email, password)
    await SecureStore.setItemAsync('accessToken', result.token)
    setAccessToken(result.token)
    setUser(result.user as unknown as User)
  }, [])

  const signInWithGoogleHandler = useCallback(async (idToken: string) => {
    const result = await loginWithGoogle(idToken)
    await SecureStore.setItemAsync('accessToken', result.token)
    setAccessToken(result.token)
    setUser(result.user as unknown as User)
  }, [])

  const register = useCallback(async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    const result = await registerUser(data)
    await SecureStore.setItemAsync('accessToken', result.token)
    setAccessToken(result.token)
    setUser(result.user as unknown as User)
  }, [])

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync('accessToken')
    setAccessToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        signIn,
        signInWithGoogle: signInWithGoogleHandler,
        register,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
