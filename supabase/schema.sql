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
  published boolean default false
);

create table if not exists import_jobs (
  id bigserial primary key,
  import_method text check (import_method in ('api','csv','manual','approved_scrape')) not null,
  source_name text not null,
  source_url text,
  terms_checked boolean default false,
  ran_at timestamptz default now(),
  created_by text
);

create table if not exists service_reviews (
  id bigserial primary key,
  service_id text references services(id) on delete cascade,
  review_status text check (review_status in ('pending','approved','rejected','outdated')) default 'pending',
  notes text,
  reviewed_at timestamptz,
  reviewed_by text
);
