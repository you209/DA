# HelpHub AU (MVP)

A mobile-first + desktop-complete support services finder built with Next.js, TypeScript, and Tailwind.



## 0) Super quick click-to-see preview (no npm needed)

If you just want to click and see something immediately:

```bash
./start-preview.sh  (Mac/Linux)
start-preview.bat (Windows)
```

Then open `http://localhost:4173`.

This launches a lightweight clickable demo (`demo/index.html`) so you can test the flow instantly.

## 1) Run locally (fastest)

### Prerequisites
- Node.js 20+
- npm 10+

### Start
```bash
npm install
npm run dev
```
Open: `http://localhost:3000`

### Build + production run
```bash
npm run build
npm run start
```

## 2) Quick test checklist

1. Open app and confirm disclaimer appears.
2. Filter by state/category.
3. Type natural language in search (e.g. "I need help with ADHD diagnosis").
4. Open `More info` on a service.
5. Click speech reader.
6. Save a service and refresh page (saved item should persist from localStorage).
7. Click **Exit now** (redirects to neutral site).
8. On narrow screen/mobile emulator, verify bottom nav appears.

## 3) Easiest phone install (PWA)

This app includes `public/manifest.json` and can be installed from browser when hosted over HTTPS.

### Android (Chrome)
1. Host the app (Vercel/Netlify/etc.).
2. Open site in Chrome.
3. Tap **Add to Home screen**.
4. Launch from app icon.

### iPhone (Safari)
1. Open hosted site in Safari.
2. Share → **Add to Home Screen**.

## 4) APK options

There is no one-click APK directly from Next.js, but two practical routes:

### Option A (Recommended): PWA + Trusted Web Activity (Android)
- Keep the web app as-is.
- Use Bubblewrap/TWA to wrap the hosted PWA into a Play Store-ready Android package.

High-level:
1. Deploy site with HTTPS.
2. Ensure PWA quality (manifest + service worker + icons).
3. Generate Android project with Bubblewrap.
4. Build/sign APK/AAB via Android Studio.

### Option B: Capacitor wrapper
- Wrap the web build with Capacitor for Android.
- Good when you need deeper native APIs.

## 5) Current environment note

If `npm install` fails with `403 Forbidden`, your environment is blocking npm registry access. In that case:
- run in another network/dev machine,
- or configure npm registry credentials/proxy.

## 6) Supabase schema

See `supabase/schema.sql` for placeholder tables + sample seed services.

## 7) Build Android APK with Capacitor (hands-on)

If you want a real APK from this codebase, these are the exact commands:

```bash
npm install
npm run android:init
npm run android:sync
npm run android:open
```

Then in Android Studio:
1. Wait for Gradle sync.
2. Build > Build Bundle(s) / APK(s) > Build APK(s).
3. Use generated debug APK for testing.
4. For release, create a keystore and sign the app.

### Notes
- `webDir` is set to `out` in `capacitor.config.ts`, so Capacitor uses exported static files.
- Run `npm run android:sync` each time web code changes.


## Content population update

More content has now been preloaded in `lib/data.ts` so you can browse a larger service list during testing (mental health, family violence, LGBTQIA+, youth, ADHD, autism and more).

## Data ingestion system (new)

HelpHub now includes ingestion primitives in `lib/ingestion.ts` for:
- API import
- CSV import
- Manual admin import
- Approved public-page import (when terms allow)

Admin workflow is represented in the app Admin tab:
- review before publish
- flag outdated
- verified/unverified status
- easy-read editing workflow
- disable inactive services

## Simple Mode (default) + Full Mode

The app now starts in **Simple Mode** by default for calm, low-stress support.

Simple Mode screens:
1. I need help now
2. Tell me what’s happening
3. Find support near me
4. Saved help
5. My support log
6. Quick Exit (always visible)

Simple Mode keeps one main question at a time, big buttons, easy-read language, obvious Call/Website actions, and hides complexity until needed.

Use **Switch to Full Mode** for advanced filters, full directory behavior, courses/programs exploration, and admin-style details.

## Dev/Admin mode vs Public mode

There are now two experiences:

- **Public mode (default):** users only see support content and guidance.
- **Dev/Admin mode:** enables ingestion/admin controls, including a dev-only force-scrape trigger for approved-directory testing.

Set in `.env.local`:

```bash
NEXT_PUBLIC_DEV_MODE=true
```

If not set, the app behaves as public-facing content-only mode.
