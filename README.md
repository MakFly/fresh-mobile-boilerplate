# Fresh Mobile Boilerplate

Production-oriented Expo Router starter for React Native apps on iOS and Android.

This repository is meant to be a strong starting point for real mobile products, not just a demo. It includes a complete route structure, onboarding, auth flows, persistent app state, typed forms, deep-link handling, CI, and a sample AI chat stack.

## What You Get

- Expo SDK 54 + React Native 0.81
- Expo Router app structure with:
  - onboarding flow
  - public auth flow
  - main app shell
  - isolated sample stack
- TypeScript with strict mode
- `bun` as the package manager
- Zustand + MMKV / localStorage persistence
- TanStack Query with online/offline sync via NetInfo
- `react-hook-form` + Zod
- `ky` API client
- theme preference: system / light / dark
- i18n with English and French
- push notification scaffold
- OTA update scaffold
- dynamic Expo config
- native deep-link rewriting with Expo Router `+native-intent`
- local demo auth + backend-ready remote auth adapter
- sample Assistant UI React Native chat implementation
- Jest test setup + GitHub Actions CI

## App Structure

```text
app/
  (onboarding)/       First-run onboarding flow
  (public)/           Sign in, sign up, forgot password
  (app)/              Main app shell and tabs
  samples/chat/       Isolated AI chat sample

components/           Shared UI and app shell components
core/                 Infrastructure: auth, env, api, storage, i18n, query, notifications
features/             Product feature modules
hooks/                Shared hooks
providers/            Root providers
```

## Quick Start

### Prerequisites

- Bun
- Node.js compatible with Expo SDK 54
- Xcode for local iOS native builds
- Java + Android toolchain for local Android native builds

### Install

```bash
bun install
cp .env.example .env
```

### Start development

```bash
bun run start
```

Useful shortcuts from the Expo terminal:

- `i` for iOS
- `a` for Android
- `w` for web

### Recommended validation

```bash
bun run check
npx expo export --platform ios --output-dir dist/export-ios
npx expo export --platform android --output-dir dist/export-android
```

## Environment Variables

The app uses Expo public env variables that are resolved in the dynamic Expo config.

```bash
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_APP_SCHEME=freshapp
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_AUTH_MODE=auto
EXPO_PUBLIC_EAS_PROJECT_ID=
EXPO_PUBLIC_APP_LINK_HOSTS=
```

### Reference

- `EXPO_PUBLIC_APP_ENV`
  - `development | preview | production`
- `EXPO_PUBLIC_APP_SCHEME`
  - custom native URL scheme
- `EXPO_PUBLIC_API_URL`
  - API origin used by backend auth and feature APIs
- `EXPO_PUBLIC_AUTH_MODE`
  - `auto | local | remote`
- `EXPO_PUBLIC_EAS_PROJECT_ID`
  - required for Expo push token registration
- `EXPO_PUBLIC_APP_LINK_HOSTS`
  - comma-separated domains for Universal Links / App Links

## Authentication

### Local auth mode

Use this mode when you want to build and test the app before your backend is ready.

Default demo account:

- email: `demo@fresh.app`
- password: `password123`

### Remote auth mode

When `EXPO_PUBLIC_API_URL` is configured and `EXPO_PUBLIC_AUTH_MODE` is `auto` or `remote`, the app switches to the remote auth repository.

Expected endpoints:

- `POST /auth/sign-in`
- `POST /auth/sign-up`
- `POST /auth/sign-out`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/profile`

Expected session payload:

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

The project is ready for:

- custom scheme links
- native path rewriting through `app/+native-intent.tsx`
- optional iOS Universal Links and Android App Links

Examples:

- `freshapp://login`
- `freshapp://chat`
- `https://your-domain.com/register`
- `https://your-domain.com/chat/thread-42`

To enable verified HTTP links in production, you still need to host:

- `apple-app-site-association`
- `assetlinks.json`

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

Equivalent `make` targets are available in the included [Makefile](/Users/kev/Documents/lab/sandbox/mobile/fresh-app/Makefile#L1).

## Testing and CI

Included today:

- Jest with `jest-expo`
- tests for:
  - env resolution
  - auth repository selection
  - deep-link rewriting
- GitHub Actions CI running:
  - install
  - lint
  - typecheck
  - test

## Build and Release Notes

- Expo bundling/export has been validated locally for both iOS and Android
- full Android native local builds require Java to be installed
- MMKV, biometrics, push notifications, and several native APIs require a dev client or production build
- `eas.json` already includes `development`, `preview`, and `production` profiles

## Sample AI Chat

The repository contains an isolated sample chat stack under `app/samples/chat`.

It is useful for:

- testing gated sample flows
- experimenting with Assistant UI on React Native
- validating auth return paths for sample routes

If you want actual model responses, expose a backend endpoint at `/api/chat` and configure `EXPO_PUBLIC_API_URL`.

## Current Status

Already in place:

- solid Expo Router structure
- onboarding + auth flows
- session restore and route restoration
- dynamic Expo config and typed env resolution
- local-to-remote auth transition path
- theme preference handling
- sample chat UI
- test baseline
- CI baseline

Still expected from the app owner before shipping a real product:

- connect remote auth to a real backend
- replace the placeholder Expo Updates URL
- configure production app identifiers and credentials
- register push tokens on your backend
- add verified link association files for your production domains
- add your actual product analytics / monitoring stack

## Notes

- On a physical device, do not use `localhost` for `EXPO_PUBLIC_API_URL`
- `Zod 4` is required because the `ai` package imports `zod/v4`
- This repository is public, but no license file has been added yet

