# Travelog Mobile App — Implementation Plan

> **Last updated:** 2026-02-23
> **Stack:** Expo 54, React Native 0.81, React 19, TypeScript, Expo Router 6
> **Goal:** Full feature parity with the web app (Next.js 16)

---

## Progress Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project setup, routing, theme, UI library | ✅ Complete |
| 2 | Auth context + auth screens | ✅ Complete |
| 3 | Data layer (types, API, hooks, validations) | ✅ Complete |
| 4 | Tab navigation + Journals screens | 🔄 In progress |
| 5 | Explore screen | ❌ Pending |
| 6 | Map screen | ❌ Pending |
| 7 | Profile screen | ❌ Pending |
| 8 | Missing components + polish | ❌ Pending |
| 9 | Google OAuth | ❌ Pending |

---

## Phase 1 — Foundation ✅

### Done
- [x] Expo Router (file-based routing), `app.json` configured with scheme `travelog`
- [x] `@/*` alias → `src/*` in tsconfig + babel
- [x] Google Fonts: Inter + Merriweather via `@expo-google-fonts`
- [x] `app/_layout.tsx` — root layout: fonts, AuthProvider, ToastMessage, StatusBar
- [x] `app/index.tsx` — auth router: redirects to `(auth)/login` or `(tabs)/journals`
- [x] Theme system in `src/theme/`: colors (amber palette + semantic tokens), typography, spacing, shadows
- [x] UI library in `src/components/ui/`:
  - Button (6 variants: default, destructive, outline, secondary, ghost, link)
  - Input (icon support, focus ring, error state)
  - TextArea (multiline)
  - Card (white bg, border, shadow)
  - Avatar (image + initials fallback)
  - Badge (4 variants: default, secondary, destructive, outline)
  - Tabs (horizontal ScrollView with pressable triggers)
  - Separator (1px horizontal/vertical)
  - LoadingSpinner (amber ActivityIndicator)
  - EmptyState (icon + title + description + optional action)

---

## Phase 2 — Authentication ✅

### Done
- [x] `src/context/AuthContext.tsx` — stores `User` + `accessToken`; persists token in SecureStore; on launch: reads token → calls `getMe()` → populates user or clears
- [x] `src/hooks/use-auth.ts` — consumes AuthContext
- [x] `app/(auth)/_layout.tsx` — Stack layout, amber-50 background
- [x] `app/(auth)/login.tsx` — email/password + Zod + react-hook-form + Google button (placeholder)
- [x] `app/(auth)/register.tsx` — name/email/password/confirm + 5-tier password strength
- [x] `app/(auth)/forgot-password.tsx` — email input + success state

---

## Phase 3 — Data Layer ✅

### Done
- [x] `src/types/index.ts` — all domain types: User, UserProfile, Journal, JournalImage, Comment, MapPlace, CreateJournalPayload, UpdateJournalPayload, PaginatedResponse
- [x] `src/lib/api/client.ts` — base fetch with Bearer auth, `ApiClientError` class, uses `EXPO_PUBLIC_API_BASE_URL`
- [x] `src/lib/api/auth.ts` — loginWithCredentials, loginWithGoogle, registerUser, getMe
- [x] `src/lib/api/journals.ts` — getJournals, getJournal, createJournal, updateJournal, deleteJournal, getPublicJournals
- [x] `src/lib/api/social.ts` — likeJournal, unlikeJournal, addComment, deleteComment, followUser, unfollowUser
- [x] `src/lib/api/profile.ts` — getProfile, updateProfile, getUserStats
- [x] `src/lib/api/places.ts` — getPlaces, createPlace, updatePlace, deletePlace
- [x] `src/lib/cloudinary.ts` — image upload with RN FormData (file URI instead of File object)
- [x] `src/lib/validations/journal.ts` — Zod schema for journal creation form
- [x] `src/hooks/use-journals.ts` — useJournals, useJournal, useCreateJournal, useUpdateJournal, useDeleteJournal
- [x] `src/hooks/use-social.ts` — useLike, useComment, useFollow
- [x] `src/hooks/use-profile.ts` — useProfile, useUpdateProfile
- [x] `src/hooks/use-explore.ts` — useExplore (public feed with pagination)
- [x] `src/hooks/use-places.ts` — usePlaces, useCreatePlace
- [x] `src/hooks/use-image-upload.ts` — expo-image-picker + Cloudinary upload
- [x] `src/hooks/use-debounce.ts`
- [x] `src/hooks/use-search.ts` — search with debounce
- [x] `src/components/JournalCard.tsx` — 16:9 image, location badge overlay, title (Merriweather), excerpt, likes/comments footer, tags

---

## Phase 4 — Tab Navigation + Journals Screens 🔄

### 4.1 Tab Layout
- [ ] `app/(tabs)/_layout.tsx` — bottom tab navigator:
  - Tab 1: **Bitácoras** — BookOpen icon, routes to `journals/`
  - Tab 2: **Explorar** — Compass icon, routes to `explore/`
  - Tab 3: **Mapa** — Map icon, routes to `map/`
  - Tab 4: **Perfil** — User icon, routes to `profile/`
  - Style: amber-600 active tint, gray-400 inactive, white tab bar with top border, Merriweather label font

### 4.2 Journals Stack Layout
- [ ] `app/(tabs)/journals/_layout.tsx` — Stack navigator for the journals group (list → detail → create)

### 4.3 Journals List — `app/(tabs)/journals/index.tsx`
- [ ] Header: "Mis Bitácoras" (Merriweather) + settings icon
- [ ] Search bar (debounced via `use-search`)
- [ ] Horizontal tab bar: "Todas" | "Publicadas" | "Borradores"
- [ ] `FlatList` of `JournalCard` (filtered by selected tab)
- [ ] Pull-to-refresh (RefreshControl)
- [ ] Empty state when no journals (EmptyState component)
- [ ] Loading skeleton: 3 placeholder cards while fetching
- [ ] FAB "+" button (amber-600, fixed bottom-right) → navigate to `journals/create`

### 4.4 Journal Detail — `app/(tabs)/journals/[id].tsx`
- [ ] Hero image (full width, ~250px) with back button overlay
- [ ] Title (Merriweather, large), date, location badge, status badge (Publicado/Borrador)
- [ ] Author row: Avatar + name + follow button (hidden for own journals)
- [ ] Action row: like (optimistic update) + share + edit/delete (own journals only via menu)
- [ ] Content text (Inter, line height 1.8, serif fallback)
- [ ] Image gallery: horizontal ScrollView with thumbnails + fullscreen modal on tap
- [ ] Tags row (Badge components)
- [ ] Mini-map section: small MapView with single marker (if journal has coordinates)
- [ ] Comments section:
  - Comment count header
  - FlatList of CommentItem (Avatar + username + date + text + like + delete)
  - Add comment input + send button at bottom (auth only)
- [ ] Delete confirmation via `Alert.alert`

### 4.5 Create/Edit Journal — `app/(tabs)/journals/create.tsx`
- [ ] Form fields with react-hook-form + Zod (journal schema):
  - Title (Input)
  - Content (TextArea, multiline, auto-growing)
  - Date — `@react-native-community/datetimepicker` (install needed)
  - Location name (Input)
  - Tags — chip input: type + add, displayed as Badge row with remove
  - Status toggle: "Borrador" / "Publicar"
  - isPublic toggle
- [ ] Image upload section (`ImageUpload` component — Phase 8):
  - Up to 5 images in a 3-column grid
  - Remove button per image
  - Add image button with expo-image-picker
  - Upload progress per image
- [ ] Location picker — MapView with tap-to-place marker + current location button
- [ ] Submit button (disabled while uploading or submitting)
- [ ] Edit mode: pre-fill form when `id` query param is present (load via `useJournal(id)`)

---

## Phase 5 — Explore Screen ❌

### 5.1 `app/(tabs)/explore/index.tsx`
- [ ] Header: "Explorar" (Merriweather)
- [ ] Search bar with debounce
- [ ] Filter chips: "Recientes" | "Populares" | "Mis seguidos"
- [ ] `FlatList` of `JournalCard` (public journals only, via `useExplore`)
- [ ] Pull-to-refresh
- [ ] Infinite scroll: load more on `onEndReached`, using pagination from API
- [ ] Empty state when no results

---

## Phase 6 — Map Screen ❌

### Prerequisites
- [ ] Add Google Maps API key in `app.json`:
  - `ios.config.googleMapsApiKey`
  - `android.config.googleMaps.apiKey`
- [ ] Verify `react-native-maps` works in Expo dev build

### 6.1 `app/(tabs)/map/index.tsx`
- [ ] Full-screen `MapView` (react-native-maps)
- [ ] Custom marker colors by type:
  - Visited → amber-600
  - Planned → blue-500
  - Wishlist → rose-400
- [ ] Marker tap → `@gorhom/bottom-sheet` slides up with:
  - Place name, country, date visited
  - Journal count badge
  - "Ver bitácoras" button → navigate to filtered journal list
- [ ] FAB "Agregar lugar" → modal form:
  - Name, country fields
  - Type selector: visitado / planeado / lista de deseos
  - Tap on map to set coordinates
- [ ] Filter buttons (top overlay): Todos | Visitados | Planeados | Lista de deseos
- [ ] Current location button (expo-location)
- [ ] Map legend overlay (bottom-left)
- [ ] Loading spinner while places data fetches

---

## Phase 7 — Profile Screen ❌

### 7.1 `app/(tabs)/profile/index.tsx`
- [ ] Cover photo (full width, 150px)
- [ ] Avatar (80px circle, overlapping cover by -40px)
- [ ] Name (Merriweather, large), username (@handle), bio, location
- [ ] Stats row: N bitácoras | N seguidores | N siguiendo
- [ ] "Editar perfil" button (own profile) OR "Seguir / Siguiendo" button (other user)
- [ ] Tab bar: "Bitácoras" | "Guardados" | "Estadísticas"
  - Bitácoras tab: FlatList of own JournalCard
  - Guardados tab: placeholder or saved journals list
  - Estadísticas tab: stats cards (total km, countries visited, cities — mock if API not ready)
- [ ] Settings icon (top-right) → `profile/settings`

### 7.2 `app/(tabs)/profile/edit.tsx`
- [ ] Avatar upload (single image via ImageUpload component)
- [ ] Cover photo upload
- [ ] Name, username, bio, location inputs
- [ ] Save button

### 7.3 `app/(tabs)/profile/settings.tsx`
- [ ] Account section: email (read-only), change password
- [ ] "Cerrar sesión" button → `signOut()` → redirect to login

---

## Phase 8 — Missing Components + Polish ❌

### Components
- [ ] `src/components/ImageUpload.tsx`:
  - `maxImages` prop (default 5)
  - 3-column grid of selected images
  - Tap to remove (X overlay)
  - "Agregar foto" button with + icon
  - Uses `use-image-upload` hook internally
  - Shows upload progress per image
- [ ] `src/components/CommentItem.tsx`:
  - Avatar + username + timestamp
  - Comment text
  - Like button + count
  - Delete button (own comments only)
- [ ] `src/components/SkeletonCard.tsx`:
  - Animated shimmer placeholder matching JournalCard dimensions
  - Uses `Animated` API pulse loop
- [ ] `src/components/MapMarker.tsx`:
  - Custom marker view with type-based color
  - Small journal count badge

### Polish
- [ ] Toast notifications for all CRUD operations (react-native-toast-message already configured)
- [ ] Error states on all screens: error message + retry button
- [ ] Handle API errors: 401 → sign out + redirect, 404 → not found screen
- [ ] Pull-to-refresh on all FlatList/ScrollView screens
- [ ] Image fullscreen modal (for journal detail image gallery)

---

## Phase 9 — Google OAuth ❌

- [ ] Install `expo-auth-session` + `expo-web-browser`
- [ ] Configure Google OAuth client IDs (iOS, Android, Web) in app.json / `.env`
- [ ] Implement `signInWithGoogle(idToken)` in AuthContext (stub already exists)
- [ ] Wire up Google button in `login.tsx`

---

## Dependencies Still Needed

| Package | Purpose | Phase |
|---------|---------|-------|
| `@react-native-community/datetimepicker` | Date picker for journal form | 4.5 |
| `lucide-react-native` or `@expo/vector-icons` | Icons for tabs and buttons | 4.1 |
| `expo-auth-session` | Google OAuth flow | 9 |
| `expo-web-browser` | Opens OAuth browser | 9 |
| Google Maps API keys (app.json) | Map rendering | 6 |

---

## File Structure (Target State)

```
app/
├── _layout.tsx                    ✅
├── index.tsx                      ✅
├── (auth)/
│   ├── _layout.tsx                ✅
│   ├── login.tsx                  ✅
│   ├── register.tsx               ✅
│   └── forgot-password.tsx        ✅
└── (tabs)/
    ├── _layout.tsx                ❌ Phase 4.1
    ├── journals/
    │   ├── _layout.tsx            ❌ Phase 4.2
    │   ├── index.tsx              ❌ Phase 4.3
    │   ├── [id].tsx               ❌ Phase 4.4
    │   └── create.tsx             ❌ Phase 4.5
    ├── explore/
    │   └── index.tsx              ❌ Phase 5
    ├── map/
    │   └── index.tsx              ❌ Phase 6
    └── profile/
        ├── index.tsx              ❌ Phase 7.1
        ├── edit.tsx               ❌ Phase 7.2
        └── settings.tsx           ❌ Phase 7.3

src/
├── theme/                         ✅
├── types/index.ts                 ✅
├── lib/
│   ├── api/                       ✅ (client, auth, journals, social, profile, places)
│   ├── validations/journal.ts     ✅
│   └── cloudinary.ts              ✅
├── hooks/                         ✅ (all hooks ported from web)
├── context/AuthContext.tsx        ✅
└── components/
    ├── ui/                        ✅ (Button, Input, TextArea, Card, Avatar, Badge, Tabs, Separator, LoadingSpinner, EmptyState)
    ├── JournalCard.tsx            ✅
    ├── ImageUpload.tsx            ❌ Phase 8
    ├── CommentItem.tsx            ❌ Phase 8
    ├── SkeletonCard.tsx           ❌ Phase 8
    └── MapMarker.tsx              ❌ Phase 8
```

---

## Key Technical Notes

- **Icons:** Use `lucide-react-native` — same API as `lucide-react` used in the web app
- **Zod:** v4 installed (not v3 like web). Schema syntax is mostly compatible; `@hookform/resolvers` v5 required for Zod v4
- **Google Maps keys:** Must be added to `app.json` before Phase 6 (`ios.config.googleMapsApiKey`, `android.config.googleMaps.apiKey`)
- **Dark mode:** Web has class-based dark mode. Defer to post-MVP for mobile
- **Backend:** Web currently uses mock data. Mobile hooks call real API — just set `EXPO_PUBLIC_API_BASE_URL` in `.env` when backend is ready
- **Image upload:** `use-image-upload` uses expo-image-picker + Cloudinary. Cloudinary env vars must be set in `.env`
- **Bottom sheets:** `@gorhom/bottom-sheet` already installed — use for map place details, filter panels
