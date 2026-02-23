import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Toast from 'react-native-toast-message'
import { forgotPassword } from '@/lib/api/auth'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { colors, fontFamily, fontSize, spacing } from '@/theme'
import { ApiClientError } from '@/lib/api/client'

const forgotSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
    } catch (err) {
      const message = err instanceof ApiClientError
        ? err.message
        : 'Error al enviar el email'
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
        </View>

        <Card style={styles.card}>
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.cardTitle}>Email enviado</Text>
              <Text style={styles.cardDescription}>
                Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
              </Text>
              <Button onPress={() => router.push('/(auth)/login')} variant="outline">
                Volver al inicio de sesión
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitle}>Recuperar contraseña</Text>
              <Text style={styles.cardDescription}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
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

                <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
                  Enviar enlace
                </Button>
              </View>
            </>
          )}
        </Card>

        <View style={styles.footer}>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>← Volver al inicio de sesión</Text>
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
  successContainer: {
    alignItems: 'center',
    gap: spacing[3],
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.green[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  checkMark: {
    fontSize: 28,
    color: colors.green[600],
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing[6],
  },
  footerLink: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
})
