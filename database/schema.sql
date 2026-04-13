-- Savings system core schema (PostgreSQL)
-- Uses Supabase auth.users as identity source.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'goal_status') then
    create type public.goal_status as enum ('active', 'completed', 'paused', 'archived');
  end if;
end $$;

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  target_amount numeric(12,2) not null check (target_amount > 0),
  start_date date not null,
  target_date date not null,
  planned_monthly_amount numeric(12,2) not null check (planned_monthly_amount > 0),
  status public.goal_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_target_after_start check (target_date >= start_date)
);

create index if not exists idx_goals_user_id on public.savings_goals (user_id);
create index if not exists idx_goals_target_date on public.savings_goals (target_date);

create table if not exists public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.savings_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  contribution_date date not null,
  amount numeric(12,2) not null check (amount <> 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contributions_goal_id on public.goal_contributions (goal_id);
create index if not exists idx_contributions_user_id on public.goal_contributions (user_id);
create index if not exists idx_contributions_date on public.goal_contributions (contribution_date);

-- Optional aggregate table for large histories
create table if not exists public.goal_monthly_snapshots (
  goal_id uuid not null references public.savings_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  total_contributed numeric(12,2) not null default 0,
  transaction_count int not null default 0 check (transaction_count >= 0),
  last_recomputed_at timestamptz not null default now(),
  primary key (goal_id, month_start)
);

create index if not exists idx_snapshots_user_month
  on public.goal_monthly_snapshots (user_id, month_start desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_goals_set_updated_at on public.savings_goals;
create trigger trg_goals_set_updated_at
before update on public.savings_goals
for each row
execute function public.set_updated_at();

drop trigger if exists trg_contributions_set_updated_at on public.goal_contributions;
create trigger trg_contributions_set_updated_at
before update on public.goal_contributions
for each row
execute function public.set_updated_at();

-- Guardrail: contribution user must match goal owner.
create or replace function public.validate_contribution_owner()
returns trigger
language plpgsql
as $$
declare
  goal_owner uuid;
begin
  select user_id into goal_owner
  from public.savings_goals
  where id = new.goal_id;

  if goal_owner is null then
    raise exception 'Goal does not exist: %', new.goal_id;
  end if;

  if new.user_id <> goal_owner then
    raise exception 'Contribution owner must match goal owner';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_contributions_validate_owner on public.goal_contributions;
create trigger trg_contributions_validate_owner
before insert or update on public.goal_contributions
for each row
execute function public.validate_contribution_owner();
