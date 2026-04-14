create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_user_id on public.categories (user_id);
create unique index if not exists idx_categories_user_name on public.categories (user_id, lower(name));

drop trigger if exists trg_categories_set_updated_at on public.categories;
create trigger trg_categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

alter table public.savings_goals
  add column if not exists category_id uuid references public.categories(id) on delete cascade;
