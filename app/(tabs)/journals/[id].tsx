import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Share,
  FlatList,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useJournal, useDeleteJournal } from '@/hooks/use-journals'
import { useComments } from '@/hooks/use-social'
import { useLike } from '@/hooks/use-social'
import { useFollow } from '@/hooks/use-social'
import { useAuth } from '@/hooks/use-auth'
import { deleteComment } from '@/lib/api/social'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CommentItem } from '@/components/CommentItem'
import { colors, fontFamily, fontSize, spacing, borderRadius } from '@/theme'

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user, accessToken } = useAuth()

  const { journal, isLoading, error } = useJournal(id)
  const { remove } = useDeleteJournal()
  const { isLiked, likesCount, toggleLike } = useLike(
    id,
    journal?.isLiked ?? false,
    journal?.likesCount ?? 0
  )
  const { comments, isLoading: commentsLoading, submitComment, isSubmitting, refetch: refetchComments } =
    useComments(id)
  const { isFollowing, toggleFollow } =
    useFollow(journal?.author.id ?? 0, false)

  const [commentText, setCommentText] = useState('')
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

  const isOwnJournal = !!user && !!journal && user.id === journal.author.id

  const handleDelete = () => {
    Alert.alert(
      'Eliminar bitácora',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await remove(id)
            if (success) {
              Toast.show({ type: 'success', text1: 'Bitácora eliminada' })
              router.back()
            } else {
              Toast.show({ type: 'error', text1: 'Error al eliminar' })
            }
          },
        },
      ]
    )
  }

  const handleShare = async () => {
    if (!journal) return
    await Share.share({ message: `${journal.title} — Travelog` })
  }

  const handleSendComment = async () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    const success = await submitComment(trimmed)
    if (success) {
      setCommentText('')
    } else {
      Toast.show({ type: 'error', text1: 'Error al enviar comentario' })
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!accessToken) return
    Alert.alert('Eliminar comentario', '¿Eliminar este comentario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComment(accessToken, commentId)
            refetchComments()
          } catch {
            Toast.show({ type: 'error', text1: 'Error al eliminar comentario' })
          }
        },
      },
    ])
  }

  if (isLoading) return <LoadingSpinner fullScreen message="Cargando bitácora..." />

  if (error || !journal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error ?? 'Bitácora no encontrada'}</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    )
  }

  const mainImage = journal.images?.[0]?.url

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Hero image */}
        <View style={styles.heroContainer}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}
          {/* Back button overlay */}
          <View style={[styles.heroOverlay, { paddingTop: insets.top + spacing[2] }]}>
            <Pressable style={styles.heroButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color="#ffffff" />
            </Pressable>
            {isOwnJournal && (
              <View style={styles.heroActions}>
                <Pressable
                  style={styles.heroButton}
                  onPress={() => router.push(`/(tabs)/journals/create?id=${journal.id}`)}
                >
                  <Feather name="edit-2" size={18} color="#ffffff" />
                </Pressable>
                <Pressable style={styles.heroButton} onPress={handleDelete}>
                  <Feather name="trash-2" size={18} color="#ffffff" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Status + date */}
          <View style={styles.metaRow}>
            <Badge variant={journal.status === 'published' ? 'default' : 'secondary'}>
              {journal.status === 'published' ? 'Publicado' : 'Borrador'}
            </Badge>
            <Text style={styles.date}>{formatDate(journal.date)}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{journal.title}</Text>

          {/* Location */}
          {journal.location && (
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={colors.amber[600]} />
              <Text style={styles.location}>{journal.location}</Text>
            </View>
          )}

          {/* Author row */}
          {!isOwnJournal && (
            <View style={styles.authorRow}>
              <Avatar uri={journal.author.avatar ?? undefined} name={journal.author.name} size={36} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{journal.author.name}</Text>
                <Text style={styles.authorUsername}>@{journal.author.username}</Text>
              </View>
              <Pressable
                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                onPress={toggleFollow}
              >
                <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Action row */}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={toggleLike}>
              <Feather
                name="heart"
                size={20}
                color={isLiked ? colors.destructive : colors.mutedForeground}
              />
              <Text style={styles.actionCount}>{likesCount}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleShare}>
              <Feather name="share-2" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Content */}
          <Text style={styles.body}>{journal.content}</Text>

          {/* Image gallery */}
          {journal.images && journal.images.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={styles.sectionTitle}>Fotos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
                {journal.images.map(img => (
                  <Pressable key={img.id} onPress={() => setSelectedImageUri(img.url)}>
                    <Image source={{ uri: img.url }} style={styles.thumbnail} />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <View style={styles.tagsRow}>
                {journal.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </View>
            </View>
          )}

          {/* Comments */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
            </Text>

            {commentsLoading ? (
              <LoadingSpinner message="Cargando comentarios..." />
            ) : (
              comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isOwn={user?.id === comment.user.id}
                  onDelete={handleDeleteComment}
                />
              ))
            )}

            {/* Add comment */}
            {user && (
              <View style={styles.commentInput}>
                <Avatar uri={user.avatar ?? undefined} name={user.name} size={32} />
                <TextInput
                  style={styles.commentTextInput}
                  placeholder="Añade un comentario..."
                  placeholderTextColor={colors.mutedForeground}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <Pressable
                  style={[
                    styles.sendButton,
                    (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim() || isSubmitting}
                >
                  <Feather name="send" size={18} color="#ffffff" />
                </Pressable>
              </View>
            )}
          </View>

          <View style={{ height: insets.bottom + spacing[6] }} />
        </View>
      </ScrollView>

      {/* Fullscreen image modal */}
      <Modal
        visible={!!selectedImageUri}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageUri(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedImageUri(null)}>
          <Image
            source={{ uri: selectedImageUri ?? '' }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          <Pressable style={[styles.modalClose, { top: insets.top + spacing[2] }]}>
            <Feather name="x" size={24} color="#ffffff" />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroContainer: { position: 'relative' },
  heroImage: { width: '100%', height: 260 },
  heroPlaceholder: { width: '100%', height: 200, backgroundColor: colors.gray[200] },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  heroButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActions: { flexDirection: 'row', gap: spacing[2] },
  content: { padding: spacing[5] },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[2],
  },
  date: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize['3xl'],
    color: colors.foreground,
    lineHeight: 40,
    marginBottom: spacing[2],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginBottom: spacing[4],
  },
  location: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.amber[700],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[4],
  },
  authorInfo: { flex: 1 },
  authorName: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  authorUsername: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  followButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.amber[600],
  },
  followButtonActive: {
    backgroundColor: colors.amber[600],
  },
  followButtonText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.amber[600],
  },
  followButtonTextActive: { color: '#ffffff' },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[4],
    marginBottom: spacing[5],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  actionCount: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  body: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.foreground,
    lineHeight: 28,
    marginBottom: spacing[5],
  },
  gallerySection: { marginBottom: spacing[5] },
  gallery: { marginTop: spacing[2] },
  thumbnail: {
    width: 120,
    height: 90,
    borderRadius: borderRadius.md,
    marginRight: spacing[2],
  },
  tagsSection: { marginBottom: spacing[5] },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  sectionTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
    marginBottom: spacing[3],
  },
  commentsSection: { marginTop: spacing[2] },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  commentTextInput: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.foreground,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.amber[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: { width: '100%', height: '80%' },
  modalClose: {
    position: 'absolute',
    right: spacing[4],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
  },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.base,
    color: colors.destructive,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  backBtn: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
  },
  backBtnText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
})
