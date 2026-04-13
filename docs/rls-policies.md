# RLS Policy Specification

RLS is enabled on:

- `public.savings_goals`
- `public.goal_contributions`
- `public.goal_monthly_snapshots`

SQL implementation: `database/rls.sql`

## Security intent

- Only authenticated users can access domain data.
- A user can only read/write rows where `user_id = auth.uid()`.
- Contributions are additionally constrained to goals owned by the same user.

## Policy matrix

| Table | Select | Insert | Update | Delete |
|---|---|---|---|---|
| `savings_goals` | own rows | own rows | own rows | own rows |
| `goal_contributions` | own rows + own goal | own rows + own goal | own rows + own goal | own rows + own goal |
| `goal_monthly_snapshots` | own rows | own rows | own rows | own rows |

## Required app behavior

- Backend must always set `user_id` from the authenticated token, never trust incoming body.
- If RLS blocks a query, API should map to `403`.
- Service layer should include explicit ownership checks for clear error messages.
