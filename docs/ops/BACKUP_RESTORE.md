# Backup / Restore

## Backup (Supabase/Postgres)
- Daily logical backup (pg_dump)
- Weekly restore test in staging

## Restore checklist
1. Restore latest snapshot to staging
2. Validate row counts (services, admin_roles, audit_logs, reminders)
3. Verify RLS policies still present
4. Promote restore procedure to production only after validation
