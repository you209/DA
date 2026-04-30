# Supabase wiring checklist

1. Set env vars:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

2. Apply `supabase/schema.sql` migration.
3. Create initial admin_roles row for first admin user.
4. Replace API stubs in:
- `app/api/admin/publish/route.ts`
- `app/api/telemetry/route.ts`
with direct Supabase writes + JWT role checks.
5. Add cron trigger for `generate_verification_reminders()` daily.
