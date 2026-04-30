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

## Fast launch: Public vs Admin mode

After `npm install`, use one of these:

### Mac/Linux
```bash
./start-public.sh
./start-admin.sh
```

### Windows
```bat
start-public.bat
start-admin.bat
```

- **Public mode:** content-only user experience.
- **Admin mode:** shows dev/admin ingestion controls.

## Policy and compliance page

A dedicated public page now exists at `/policy` covering:
- mission and goal
- legal safety message
- compliance commitments
- data source standards
- verification and review process
- safe provider handoff model

## CSV import file (restored content)

A ready-to-import CSV is included at:

- `data/imports/helphub_services_seed.csv`

It includes helplines and services with the full ingestion fields:
`source_url, source_name, last_checked_at, verified_status, normal_description, easy_read_description, eligibility, opening_hours, phone, website, state, service_area, categories, tags, courses_programs, related_services, active`.

Multi-value fields use `|` separators (for example in categories/tags/courses).

## Admin CSV upload preview

In Admin mode, you can now upload a `.csv` file in the Dev ingestion controls.
- It previews the first rows immediately.
- This is a review step before publish.

## New services and placeholders

Added additional service entries (from official provider/government sources) including:
- 13YARN
- SANE Australia
- Open Arms

Added placeholder planning file for staged content expansion:
- `docs/SERVICE_PLACEHOLDERS.md`


Additional placeholder import file:
- `data/imports/helphub_placeholders.csv`

This file contains draft rows for all missing categories so admin can review and publish later.

## Newly created requested categories

Created live directory entries for:
- legal help
- housing
- grandparent/family support
- ADHD pathway
- autism pathway
- child support
- Facebook/community groups
- practitioner directory

These are marked `needs_review` where verification still needs admin confirmation.

## Deep research source file

Added `docs/RESEARCH_SOURCES.md` with official/preferred links for each requested area.
Use these for ongoing import validation and admin verification.

## Admin: toggle groups/services out

In Admin mode (Full Mode > Dev ingestion controls), you can now:
- hide/show Facebook/community groups from public results
- disable/enable any service entry with a button toggle

This supports rapid moderation before publishing.

## Admin publish workflow (new)

Admin controls now support a local publish stage per service:
- Draft
- Review
- Published

Public mode only shows `Published` items.
Dev/Admin mode can still see all items for moderation.

## Next 4 steps implemented

Implemented in MVP scaffold:
1. Persist publish stage locally (`publish_state`), mirroring intended Supabase persistence.
2. Role selector in admin panel (viewer/editor/verifier/admin).
3. Audit log feed in admin panel for stage changes.
4. Re-verification reminder banner for services older than 90 days.

Schema updates added for production persistence:
- `publish_stage` on `services`
- `admin_roles`
- `audit_logs`
- `verification_reminders`

## Reliability, safety, import, and parity upgrades added

Implemented now in MVP:
- Last checked + verified by shown on service cards
- Report incorrect info action on service cards
- Double-Esc quick exit support + neutral destination choice (Google/BOM)
- Browser history warning near quick exit controls
- Safety plan export to text file
- Admin publish workflow + role selector + audit log + stale reminder
- Community group moderation queue in admin panel
- CSV pipeline utility module with required-column validation + duplicate detection
- Added dedicated placeholder pages for Practitioner Search and Courses & Programs

Still pending full production implementation:
- Supabase auth/RLS wiring
- Automated scheduler job (30/60/90)
- Telemetry backend + dashboards
- Backup/restore runbooks

## Production readiness implemented

Added production scaffolding for the remaining work:
- Supabase auth + RLS policies in `supabase/schema.sql`
- Verification scheduler SQL function: `generate_verification_reminders()`
- Telemetry events table with admin-read policy
- Ops runbooks:
  - `docs/ops/RELEASE_RUNBOOK.md`
  - `docs/ops/BACKUP_RESTORE.md`
- Backup/restore scripts:
  - `scripts/backup.sh`
  - `scripts/restore.sh`

## Supabase + server workflow wiring (started)

Added:
- Supabase client scaffold: `lib/supabase/client.ts`
- Admin publish API route scaffold: `app/api/admin/publish/route.ts`
- Telemetry API route scaffold: `app/api/telemetry/route.ts`
- Wiring checklist: `docs/ops/SUPABASE_WIRING.md`

Next action is to connect these route handlers to real Supabase writes with JWT role enforcement.

## Supabase wiring status: enabled

`app/api/admin/publish/route.ts` now performs real server-side updates:
- validates bearer token
- resolves admin role from `admin_roles`
- updates `services.publish_stage`
- writes `audit_logs` entry

`app/api/telemetry/route.ts` now writes real `telemetry_events` rows.

Required env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
