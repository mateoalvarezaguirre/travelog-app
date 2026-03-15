import React, { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import { Merriweather_400Regular, Merriweather_700Bold } from '@expo-google-fonts/merriweather'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/use-auth'

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  scopes: ['email', 'profile'],
})

SplashScreen.preventAutoHideAsync()

// Watches auth state and redirects to login if token is cleared while in tabs
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (isLoading) return
    const inTabs = segments[0] === '(tabs)'
    if (!accessToken && inTabs) {
      router.replace('/(auth)/login')
    }
  }, [accessToken, isLoading, segments])

  return <>{children}</>
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Merriweather_400Regular,
    Merriweather_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthGuard>
          <StatusBar style="dark" />
          <Slot />
          <Toast />
        </AuthGuard>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
