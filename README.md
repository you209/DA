# HelpHub AU (MVP)

A mobile-first + desktop-complete support services finder built with Next.js, TypeScript, and Tailwind.

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
