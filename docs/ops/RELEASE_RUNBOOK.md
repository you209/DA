# Release + Ops Runbook

## Pre-release
1. Run migrations in staging.
2. Validate RLS policies.
3. Verify admin roles mapped for production users.
4. Smoke test public and admin modes.

## Release
1. Apply migrations to production.
2. Deploy app build.
3. Run `select public.generate_verification_reminders();`
4. Confirm telemetry inserts.

## Post-release checks
- Public services render with published-only visibility.
- Admin can draft/review/publish.
- Audit logs record stage changes.
- Reminder queue populated for stale services.
