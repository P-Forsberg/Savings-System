-- Row Level Security policies for savings system.
-- Assumes Supabase auth and authenticated role.

alter table public.savings_goals enable row level security;
alter table public.goal_contributions enable row level security;
alter table public.goal_monthly_snapshots enable row level security;

-- savings_goals
drop policy if exists "goals_select_own" on public.savings_goals;
create policy "goals_select_own"
on public.savings_goals
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "goals_insert_own" on public.savings_goals;
create policy "goals_insert_own"
on public.savings_goals
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "goals_update_own" on public.savings_goals;
create policy "goals_update_own"
on public.savings_goals
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "goals_delete_own" on public.savings_goals;
create policy "goals_delete_own"
on public.savings_goals
for delete
to authenticated
using (user_id = auth.uid());

-- goal_contributions
drop policy if exists "contrib_select_own" on public.goal_contributions;
create policy "contrib_select_own"
on public.goal_contributions
for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.savings_goals g
    where g.id = goal_contributions.goal_id
      and g.user_id = auth.uid()
  )
);

drop policy if exists "contrib_insert_own" on public.goal_contributions;
create policy "contrib_insert_own"
on public.goal_contributions
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.savings_goals g
    where g.id = goal_contributions.goal_id
      and g.user_id = auth.uid()
  )
);

drop policy if exists "contrib_update_own" on public.goal_contributions;
create policy "contrib_update_own"
on public.goal_contributions
for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.savings_goals g
    where g.id = goal_contributions.goal_id
      and g.user_id = auth.uid()
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.savings_goals g
    where g.id = goal_contributions.goal_id
      and g.user_id = auth.uid()
  )
);

drop policy if exists "contrib_delete_own" on public.goal_contributions;
create policy "contrib_delete_own"
on public.goal_contributions
for delete
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.savings_goals g
    where g.id = goal_contributions.goal_id
      and g.user_id = auth.uid()
  )
);

-- goal_monthly_snapshots
drop policy if exists "snapshots_select_own" on public.goal_monthly_snapshots;
create policy "snapshots_select_own"
on public.goal_monthly_snapshots
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "snapshots_modify_own" on public.goal_monthly_snapshots;
create policy "snapshots_modify_own"
on public.goal_monthly_snapshots
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
