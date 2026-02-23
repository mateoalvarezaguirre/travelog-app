import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/use-auth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Index() {
  const { accessToken, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (accessToken) {
      router.replace('/(tabs)/journals')
    } else {
      router.replace('/(auth)/login')
    }
  }, [accessToken, isLoading])

  return <LoadingSpinner fullScreen message="Cargando..." />
}
