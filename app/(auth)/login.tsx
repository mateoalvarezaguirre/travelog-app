import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Toast from 'react-native-toast-message'
import { useAuth } from '@/hooks/use-auth'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/Separator'
import { colors, fontFamily, fontSize, spacing } from '@/theme'
import { ApiClientError } from '@/lib/api/client'

const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
      router.replace('/(tabs)/journals')
    } catch (err) {
      const message = err instanceof ApiClientError
        ? err.message
        : 'Error al iniciar sesión'
      Toast.show({ type: 'error', text1: 'Error', text2: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>Travelog</Text>
          <Text style={styles.subtitle}>Tu diario de viajes personal</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardDescription}>
            Ingresa tus credenciales para acceder a tu cuenta
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
              Iniciar Sesión
            </Button>
          </View>

          <View style={styles.divider}>
            <Separator style={styles.dividerLine} />
            <Text style={styles.dividerText}>O continua con</Text>
            <Separator style={styles.dividerLine} />
          </View>

          <Button
            variant="outline"
            onPress={() => Toast.show({ type: 'info', text1: 'Google Sign-In', text2: 'Próximamente disponible' })}
          >
            Continuar con Google
          </Button>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Registrarse</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[5],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  brand: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['4xl'],
    color: colors.amber[800],
  },
  subtitle: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.amber[700],
    marginTop: spacing[1],
  },
  card: {
    borderColor: colors.amber[100],
  },
  cardTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['2xl'],
    color: colors.foreground,
    marginBottom: spacing[1],
  },
  cardDescription: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing[6],
  },
  form: {
    gap: spacing[4],
  },
  link: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.primary,
    textAlign: 'right',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[6],
    gap: spacing[3],
  },
  dividerLine: {
    flex: 1,
  },
  dividerText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  footerText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  footerLink: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
})
