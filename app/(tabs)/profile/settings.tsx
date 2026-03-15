import React from 'react'
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useAuth } from '@/hooks/use-auth'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

export default function SettingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/login')
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing[2] }]}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Account section */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.card}>
          {/* Email (read-only) */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Feather name="mail" size={18} color={colors.amber[600]} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Correo electrónico</Text>
              <Text style={styles.rowValue}>{user?.email ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Username (read-only) */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Feather name="at-sign" size={18} color={colors.amber[600]} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Nombre de usuario</Text>
              <Text style={styles.rowValue}>@{user?.username ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* Profile section */}
        <Text style={styles.sectionTitle}>Perfil</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => router.push('/(tabs)/profile/edit')}
          >
            <View style={styles.rowIcon}>
              <Feather name="edit-2" size={18} color={colors.amber[600]} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Editar perfil</Text>
              <Text style={styles.rowHint}>Nombre, bio, ubicación, fotos</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Session section */}
        <Text style={styles.sectionTitle}>Sesión</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={handleSignOut}>
            <View style={[styles.rowIcon, styles.rowIconDestructive]}>
              <Feather name="log-out" size={18} color={colors.destructive} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, styles.rowLabelDestructive]}>
                Cerrar sesión
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{ height: insets.bottom + spacing[6] }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
  },
  content: {
    padding: spacing[5],
    gap: spacing[2],
  },
  sectionTitle: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing[4],
    marginBottom: spacing[1],
    paddingHorizontal: spacing[1],
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.amber[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDestructive: {
    backgroundColor: '#fef2f2',
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  rowLabelDestructive: {
    color: colors.destructive,
  },
  rowValue: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  rowHint: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing[4] + 34 + spacing[3],
  },
})
