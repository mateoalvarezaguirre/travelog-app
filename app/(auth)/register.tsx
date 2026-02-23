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
import { colors, fontFamily, fontSize, spacing } from '@/theme'
import { ApiClientError } from '@/lib/api/client'

const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  password_confirmation: z.string().min(1, 'Confirma tu contraseña'),
}).refine(data => data.password === data.password_confirmation, {
  message: 'Las contraseñas no coinciden',
  path: ['password_confirmation'],
})

type RegisterForm = z.infer<typeof registerSchema>

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']

export default function RegisterScreen() {
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  })

  const password = watch('password')
  const strength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await registerUser(data)
      Toast.show({ type: 'success', text1: 'Cuenta creada', text2: 'Bienvenido a Travelog' })
      router.replace('/(tabs)/journals')
    } catch (err) {
      const message = err instanceof ApiClientError
        ? err.message
        : 'Error al crear la cuenta'
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
          <Text style={styles.subtitle}>Crea tu cuenta</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Registrarse</Text>
          <Text style={styles.cardDescription}>
            Completa tus datos para comenzar a documentar tus viajes
          </Text>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  autoCapitalize="words"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />

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
                <View>
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
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBars}>
                        {[0, 1, 2, 3, 4].map(i => (
                          <View
                            key={i}
                            style={[
                              styles.strengthBar,
                              { backgroundColor: i < strength ? strengthColors[strength - 1] : colors.gray[200] },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.strengthLabel, { color: strengthColors[strength - 1] || colors.gray[400] }]}>
                        {strength > 0 ? strengthLabels[strength - 1] : ''}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password_confirmation"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password_confirmation?.message}
                />
              )}
            />

            <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
              Crear Cuenta
            </Button>
          </View>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Iniciar Sesión</Text>
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
    marginBottom: spacing[6],
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
  strengthContainer: {
    marginTop: spacing[2],
    gap: spacing[1],
  },
  strengthBars: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
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
