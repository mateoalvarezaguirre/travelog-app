// ── Core domain types ──

export interface LatLng {
  lat: number
  lng: number
}

export type MarkerType = "visited" | "planned" | "wishlist"

// ── Users ──

export interface UserSummary {
  id: number
  name: string
  username: string
  avatar: string | null
}

export interface User {
  id: number
  name: string
  email: string
  username: string
  bio: string | null
  avatar: string | null
  coverPhoto: string | null
  location: string | null
}

export interface UserProfile extends User {
  journalCount: number
  followersCount: number
  followingCount: number
  countriesVisited: number
  isFollowing?: boolean
}

// ── Journals ──

export interface JournalImage {
  id: number
  url: string
  caption: string | null
  order: number
}

export interface Journal {
  id: number
  title: string
  content: string
  excerpt: string
  date: string
  location: string
  coordinates: LatLng | null
  images: JournalImage[]
  tags: string[]
  status: "draft" | "published"
  isPublic: boolean
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  author: UserSummary
  createdAt: string
  updatedAt: string
}

export interface CreateJournalPayload {
  title: string
  content: string
  date: string
  location: string
  coordinates?: LatLng
  tags?: string[]
  status: "draft" | "published"
  isPublic: boolean
  imageIds?: number[]
}

export interface UpdateJournalPayload extends Partial<CreateJournalPayload> {}

// ── Comments ──

export interface Comment {
  id: number
  text: string
  user: UserSummary
  createdAt: string
  likesCount: number
}

// ── Places / Map ──

export interface MapPlace {
  id: number
  name: string
  country: string
  date: string | null
  coordinates: LatLng
  markerType: MarkerType
  journalCount?: number
  image: string | null
}

// ── API response wrappers ──

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}
