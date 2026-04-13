# Data Model

The project uses Supabase `auth.users` for identities and stores savings domain data in three tables.

## Tables

### `public.savings_goals`

- `id` UUID primary key.
- `user_id` UUID foreign key to `auth.users(id)`.
- `title` text (1-120 chars).
- `target_amount` numeric(12,2), must be `> 0`.
- `start_date` date.
- `target_date` date, must be `>= start_date`.
- `planned_monthly_amount` numeric(12,2), must be `> 0`.
- `status` enum: `active | completed | paused | archived`.
- `created_at`, `updated_at` timestamps.

### `public.goal_contributions`

- `id` UUID primary key.
- `goal_id` UUID foreign key to `savings_goals(id)`.
- `user_id` UUID foreign key to `auth.users(id)`.
- `contribution_date` date.
- `amount` numeric(12,2), must be `!= 0`.
- `note` optional text.
- `created_at`, `updated_at` timestamps.

Validation trigger ensures `goal_contributions.user_id` always matches the owning goal's `user_id`.

### `public.goal_monthly_snapshots` (optional optimization)

- `goal_id`, `month_start` composite primary key.
- `user_id` owner.
- `total_contributed` aggregated numeric.
- `transaction_count`.
- `last_recomputed_at`.

Used for fast month-history rendering on very large datasets.

## Relationships

- One user has many goals.
- One goal has many contributions.
- One goal has many monthly snapshots.
- Deleting a goal cascades and removes dependent contributions/snapshots.

## SQL source of truth

- Schema migration: `database/schema.sql`
- Security policies: `database/rls.sql`
