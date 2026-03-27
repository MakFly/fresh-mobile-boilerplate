# Fresh Mobile Boilerplate

Production-oriented Expo Router starter for React Native apps on iOS and Android.

It ships with a real app shell, onboarding, authentication flows, persistent state, typed forms, deep-link handling, a sample AI chat stack, and a clean path from local demo mode to a backend-connected setup.

## Highlights

- Expo SDK 54 + React Native 0.81 + Expo Router
- TypeScript with strict mode enabled
- `bun` as the package manager
- Auth flow with:
  - local demo repository for fast UI iteration
  - remote repository adapter for backend-ready auth
  - session restore
  - sign in, sign up, sign out, forgot password, profile update
- Onboarding flow separated from the main app shell
- Public routes, app routes, and an isolated samples stack
- Zustand + MMKV / localStorage persistence
- TanStack Query configured with NetInfo online sync
- `react-hook-form` + Zod validation
- API client built with `ky`
- i18n with English and French
- Theme preference: system, light, dark
- Push notification scaffold
- OTA update check scaffold
- Typed environment resolution and dynamic Expo config
- Native deep-link rewriting through Expo Router `+native-intent`
- Jest test setup and GitHub Actions CI
- Sample Assistant UI chat implementation for React Native

## Tech Stack

- Expo
- Expo Router
- React Native
- TypeScript
- Zustand
- TanStack Query
- React Hook Form
- Zod
- NativeWind
- MMKV
- Expo Secure Store
- Expo Notifications
- i18next

## Included App Areas

- `app/(onboarding)`: first-run onboarding flow
- `app/(public)`: sign in, sign up, forgot password
- `app/(app)`: main authenticated / post-onboarding application shell
- `app/samples/chat`: isolated AI chat sample

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Create local environment file

```bash
cp .env.example .env
```

### 3. Start the app

```bash
bun run start
```

Then open:

- `i` for iOS
- `a` for Android
- `w` for web

## Environment Variables

The starter uses build-time Expo public env vars.

```bash
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_SCHEME=freshapp
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_AUTH_MODE=auto
EXPO_PUBLIC_EAS_PROJECT_ID=
EXPO_PUBLIC_APP_LINK_HOSTS=
```

### Variable reference

- `EXPO_PUBLIC_APP_ENV`
  - One of: `development`, `preview`, `production`
- `EXPO_PUBLIC_APP_SCHEME`
  - Custom app URL scheme used for native deep links
- `EXPO_PUBLIC_API_URL`
  - Base API origin for backend auth and API calls
- `EXPO_PUBLIC_AUTH_MODE`
  - One of: `auto`, `local`, `remote`
  - `auto`: use remote auth when `EXPO_PUBLIC_API_URL` is set, otherwise local auth
  - `local`: always use the built-in demo auth repository
  - `remote`: always use the backend auth repository
- `EXPO_PUBLIC_EAS_PROJECT_ID`
  - Used for Expo push token registration
- `EXPO_PUBLIC_APP_LINK_HOSTS`
  - Comma-separated HTTPS hosts for iOS Universal Links and Android App Links

## Authentication Modes

### Local demo auth

Use this when building UI before your backend exists.

- Default demo account:
  - email: `demo@fresh.app`
  - password: `password123`
- User records and session are stored locally with Secure Store

### Remote auth

When `EXPO_PUBLIC_API_URL` is configured and auth mode is `auto` or `remote`, the app switches to the remote auth repository.

Expected backend endpoints:

- `POST /auth/sign-in`
- `POST /auth/sign-up`
- `POST /auth/sign-out`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/profile`

Expected remote session shape:

```json
{
  "token": "access-token",
  "refreshToken": "refresh-token",
  "expiresAt": "2026-03-27T12:00:00.000Z",
  "user": {
    "id": "user_123",
    "email": "jane@example.com",
    "name": "Jane Doe"
  }
}
```

## Deep Linking

The app supports:

- custom scheme links via `EXPO_PUBLIC_APP_SCHEME`
- route rewriting through `app/+native-intent.tsx`
- optional Universal Links / App Links via `EXPO_PUBLIC_APP_LINK_HOSTS`

Examples:

- `freshapp://login`
- `freshapp://chat`
- `https://your-domain.com/register`
- `https://your-domain.com/chat/thread-42`

To enable verified HTTP links in production, you still need to host:

- Apple `apple-app-site-association`
- Android `assetlinks.json`

## Scripts

```bash
bun run start
bun run ios
bun run android
bun run web

bun run lint
bun run typecheck
bun run test
bun run test:watch
bun run doctor
bun run check

bun run build:preview
bun run build:production
bun run update:preview
```

Equivalent Make targets are available through `make`.

## Testing and Validation

This starter includes:

- Jest with `jest-expo`
- focused unit tests for:
  - environment resolution
  - auth repository selection
  - deep-link rewriting
- CI that runs:
  - install
  - lint
  - typecheck
  - test

Recommended local validation before shipping:

```bash
bun run check
npx expo export --platform ios --output-dir dist/export-ios
npx expo export --platform android --output-dir dist/export-android
```

## Local Build Notes

- Expo bundling/export has been validated locally for both iOS and Android
- A full Android native local build requires Java to be installed
- MMKV, biometrics, push notifications, and some native modules require a dev client or production build, not Expo Go

## Project Structure

```text
app/
  (app)/              Main application shell
  (onboarding)/       First-run onboarding
  (public)/           Auth screens
  samples/chat/       AI chat sample

components/           Reusable UI and app shell components
core/                 Infrastructure: auth, env, API, storage, i18n, query, notifications
features/             Feature modules
hooks/                Shared hooks
providers/            Root providers
```

## What Is Already Production-Friendly

- strict TypeScript setup
- Expo Router structure that separates app/public/onboarding/sample flows
- backend-ready auth repository abstraction
- persistent app preferences and route restoration
- dynamic Expo config for environments and linking
- CI with tests
- EAS profiles for development, preview, and production

## What You Still Need Before Shipping a Real Product

- connect the remote auth repository to your real backend
- replace placeholder Expo Updates URL with your real EAS project URL
- configure EAS project metadata and secrets
- configure App Store / Play Store identifiers and credentials
- register push tokens on your backend if you want real notification delivery
- add your production Universal Link / App Link host files

## Notes

- On a physical device, do not use `localhost` for `EXPO_PUBLIC_API_URL`
- The AI chat sample expects a backend endpoint at `/api/chat` if you want actual model responses
- `Zod 4` is required because the `ai` package imports `zod/v4`

## License

Private project template. Add the license you want before publishing publicly.
