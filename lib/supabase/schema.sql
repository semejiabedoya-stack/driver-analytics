create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.platforms (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  commission_rate numeric not null default 0,
  tax_rate numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.work_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  status text not null check (status in ('idle','running','paused','finished')),
  created_at timestamptz not null default now()
);

create table if not exists public.pauses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.work_sessions(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  platform_id text not null references public.platforms(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  valor_viaje numeric not null,
  propina numeric not null default 0,
  comision numeric not null default 0,
  impuestos numeric not null default 0,
  libre_comision boolean not null default false,
  hora_inicio timestamptz not null,
  hora_recogida timestamptz not null,
  hora_final timestamptz not null,
  km_inicial numeric not null,
  km_recogida numeric not null,
  km_final numeric not null,
  latitud_inicio numeric not null,
  longitud_inicio numeric not null,
  latitud_recogida numeric not null,
  longitud_recogida numeric not null,
  latitud_final numeric not null,
  longitud_final numeric not null,
  ganancia_neta numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  value numeric not null,
  category text not null check (category in ('gasolina','comida','peajes','lavado','parqueadero','mantenimiento','otros')),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  value numeric not null,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

alter table public.users enable row level security;
alter table public.platforms enable row level security;
alter table public.work_sessions enable row level security;
alter table public.pauses enable row level security;
alter table public.trips enable row level security;
alter table public.expenses enable row level security;
alter table public.goals enable row level security;

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can upsert own profile" on public.users for insert with check (auth.uid() = id);

create policy "Users own platforms" on public.platforms for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own sessions" on public.work_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own trips" on public.trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own expenses" on public.expenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own goals" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own pauses through sessions" on public.pauses for all
using (exists (select 1 from public.work_sessions ws where ws.id = session_id and ws.user_id = auth.uid()))
with check (exists (select 1 from public.work_sessions ws where ws.id = session_id and ws.user_id = auth.uid()));

create index if not exists trips_user_created_idx on public.trips(user_id, created_at desc);
create index if not exists trips_platform_idx on public.trips(platform_id);
create index if not exists expenses_user_created_idx on public.expenses(user_id, created_at desc);
