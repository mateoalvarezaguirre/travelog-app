# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Starting the Dev Server

Always clear the Metro cache when changing `babel.config.js` or `metro.config.js`:
```bash
npx expo start --clear
```

## Commands

```bash
# Start dev server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

There are no lint or test scripts configured. TypeScript checking is done via the editor or `npx tsc --noEmit`.

## Environment Variables

Create a `.env` file at the root:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Cloudinary env vars are also needed for image upload (check `src/lib/cloudinary.ts` for the expected variable names). Google Maps API keys go in `app.json` under `ios.config.googleMapsApiKey` and `android.config.googleMaps.apiKey`.

## Architecture

### Path Alias
`@/*` maps to `src/*`. The alias is resolved by **Metro** via `metro.config.js` (not Babel). Always use `@/` for imports from `src/`.

**Note:** `babel-plugin-module-resolver` v2.x is in `devDependencies` but must NOT be added to `babel.config.js` — it crashes with `@babel/core` 7.29+ (tries `plugins.find(...)[1]` on an undefined). The alias is handled by the custom `resolveRequest` in `metro.config.js` instead.

### Routing (Expo Router v6)
File-based routing under `app/`:
- `app/index.tsx` — auth guard: redirects to `(auth)/login` or `(tabs)/journals`
- `app/(auth)/` — unauthenticated screens (login, register, forgot-password)
- `app/(tabs)/` — main tab navigator (not yet built — see `IMPLEMENTATION_PLAN.md`)

### Authentication
`src/context/AuthContext.tsx` holds `user` + `accessToken` state, persists the token in `expo-secure-store`. On app launch it reads the stored token and calls `getMe()` to rehydrate. Consume via `src/hooks/use-auth.ts`.

### API Layer
`src/lib/api/client.ts` — base `apiClient<T>(endpoint, options)` function. All API modules (`auth`, `journals`, `social`, `profile`, `places`) take an explicit `token` parameter and call `apiClient`. Throws `ApiClientError` on non-2xx responses (has `statusCode` and `errors` fields).

### Data Hooks Pattern
Hooks in `src/hooks/` manage their own `useState` + `useEffect` (no React Query / SWR). Each hook returns `{ data, isLoading, error, refetch }`. Mutation hooks return `{ mutate, isLoading, error }`. All hooks get `accessToken` from `useAuth()`.

### Theme
All design tokens live in `src/theme/`. Import from `src/theme/index.ts`. Primary color is `amber[600]` (`#d97706`). Typography uses Inter (body) and Merriweather (headings/labels). Never hardcode colors — use `colors.*` from the theme.

### Forms
Forms use `react-hook-form` v7 + `zod` **v4** (not v3). Resolvers come from `@hookform/resolvers` v5. Zod schemas live in `src/lib/validations/`.

### UI Components
Reusable primitives are in `src/components/ui/` (Button, Input, TextArea, Card, Avatar, Badge, Tabs, Separator, LoadingSpinner, EmptyState). Use these before reaching for raw RN primitives.

### Icons
Use `lucide-react-native` — same icon API as the web counterpart.

### Image Upload
`src/hooks/use-image-upload.ts` handles `expo-image-picker` + Cloudinary upload. The Cloudinary helper in `src/lib/cloudinary.ts` uses RN `FormData` with a file URI (not a browser `File` object).

### Bottom Sheets
`@gorhom/bottom-sheet` is installed. Use it for map place details, filter panels, and similar overlay UX (requires `GestureHandlerRootView` — already in `app/_layout.tsx`).

### Toast Notifications
`react-native-toast-message` is configured in `app/_layout.tsx`. Call `Toast.show(...)` directly — no provider setup needed in individual screens.
