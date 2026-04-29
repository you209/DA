-- Core services
create table if not exists services (
  id text primary key,
  name text not null,
  source_url text not null,
  source_name text not null,
  last_checked_at timestamptz,
  verified_status text check (verified_status in ('verified','unverified','needs_review')) default 'needs_review',
  normal_description text,
  easy_read_description text,
  eligibility text,
  opening_hours text,
  phone text,
  website text,
  state text,
  service_area text,
  categories text[] default '{}',
  tags text[] default '{}',
  courses_programs text[] default '{}',
  related_services text[] default '{}',
  active boolean default true,
  publish_stage text check (publish_stage in ('draft','review','published')) default 'draft'
);

create table if not exists admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('viewer','editor','verifier','admin')) not null,
  updated_at timestamptz default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor_id uuid references auth.users(id),
  actor_role text,
  service_id text,
  action text not null,
  from_value text,
  to_value text,
  created_at timestamptz default now()
);

create table if not exists verification_reminders (
  id bigserial primary key,
  service_id text references services(id) on delete cascade,
  due_at timestamptz not null,
  status text check (status in ('open','done','dismissed')) default 'open',
  created_at timestamptz default now()
);

create table if not exists telemetry_events (
  id bigserial primary key,
  user_id uuid,
  session_id text,
  event_name text not null,
  event_payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Helper functions
create or replace function public.current_role()
returns text language sql stable as $$
  select coalesce((select role from admin_roles where user_id = auth.uid()), 'viewer');
$$;

-- RLS
alter table services enable row level security;
alter table admin_roles enable row level security;
alter table audit_logs enable row level security;
alter table verification_reminders enable row level security;
alter table telemetry_events enable row level security;

create policy if not exists services_public_read on services for select using (publish_stage = 'published' and active = true);
create policy if not exists services_admin_write on services for all using (public.current_role() in ('editor','verifier','admin')) with check (public.current_role() in ('editor','verifier','admin'));

create policy if not exists roles_self_read on admin_roles for select using (auth.uid() = user_id or public.current_role() = 'admin');
create policy if not exists roles_admin_write on admin_roles for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

create policy if not exists audit_admin_read on audit_logs for select using (public.current_role() in ('verifier','admin'));
create policy if not exists audit_writer_insert on audit_logs for insert with check (public.current_role() in ('editor','verifier','admin'));

create policy if not exists reminders_admin on verification_reminders for all using (public.current_role() in ('verifier','admin')) with check (public.current_role() in ('verifier','admin'));
create policy if not exists telemetry_insert on telemetry_events for insert with check (true);
create policy if not exists telemetry_admin_read on telemetry_events for select using (public.current_role() in ('admin'));

-- Verification scheduler function (to be triggered by cron daily)
create or replace function public.generate_verification_reminders()
returns void language plpgsql as $$
begin
  insert into verification_reminders(service_id, due_at, status)
  select s.id,
         coalesce(s.last_checked_at, now()) + interval '90 days',
         'open'
  from services s
  where s.active = true
    and not exists (
      select 1 from verification_reminders r
      where r.service_id = s.id and r.status = 'open'
    )
    and coalesce(s.last_checked_at, now() - interval '365 days') < now() - interval '90 days';
end;
$$;
