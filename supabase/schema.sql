create table if not exists states (
  code text primary key,
  name text not null
);

create table if not exists categories (
  id bigserial primary key,
  name text unique not null
);

create table if not exists services (
  id text primary key,
  name text not null,
  who_they_help text,
  opening_hours text,
  website text
);

create table if not exists service_contacts (
  id bigserial primary key,
  service_id text references services(id) on delete cascade,
  phone text,
  email text
);

create table if not exists service_locations (
  id bigserial primary key,
  service_id text references services(id) on delete cascade,
  state_code text references states(code),
  area text
);

create table if not exists service_tags (
  id bigserial primary key,
  service_id text references services(id) on delete cascade,
  tag text
);

create table if not exists community_groups (
  id bigserial primary key,
  name text not null,
  state_code text references states(code),
  link text
);

create table if not exists practitioners (
  id bigserial primary key,
  name text not null,
  type text,
  state_code text references states(code),
  contact text
);

create table if not exists user_profiles (
  id uuid primary key,
  display_name text,
  preferred_state text references states(code)
);

create table if not exists saved_services (
  id bigserial primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  service_id text references services(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists call_logs (
  id bigserial primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  service_id text references services(id),
  notes text,
  called_at timestamptz default now()
);

create table if not exists appointments (
  id bigserial primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  provider text,
  appointment_at timestamptz,
  notes text
);

create table if not exists notes (
  id bigserial primary key,
  user_id uuid references user_profiles(id) on delete cascade,
  service_id text references services(id),
  body text,
  created_at timestamptz default now()
);

insert into services(id,name,who_they_help,opening_hours,website) values
('000','000 Emergency','Immediate danger or emergency','24/7','https://www.triplezero.gov.au'),
('1800respect','1800RESPECT','People impacted by domestic, family, or sexual violence','24/7','https://www.1800respect.org.au'),
('lifeline','Lifeline','Anyone in emotional distress or crisis','24/7','https://www.lifeline.org.au'),
('beyondblue','Beyond Blue','People experiencing anxiety or depression','24/7','https://www.beyondblue.org.au'),
('kids','Kids Helpline','Young people aged 5 to 25','24/7','https://kidshelpline.com.au'),
('healthdirect','Healthdirect','Anyone needing health advice','24/7','https://www.healthdirect.gov.au'),
('autismconnect','Autism Connect','Autistic people, families and carers','Business hours','https://www.amaze.org.au/autism-connect'),
('askizzy','Ask Izzy','People looking for local support services','Always available online','https://askizzy.org.au')
on conflict do nothing;
