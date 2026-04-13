# Savings System Architecture

## Core stack

- Frontend: React + TypeScript (recommended in Next.js app router).
- Backend: Node.js + TypeScript (NestJS or Fastify).
- Database: PostgreSQL via Supabase.
- Authentication: Supabase Auth (email/password).
- Authorization: PostgreSQL RLS with `auth.uid()`.
- Realtime: Supabase Realtime subscriptions for inserts/updates.

## Domain modules

- `goals`: create and manage saving goals.
- `contributions`: monthly/adhoc deposits per goal.
- `projections`: evaluate plan feasibility and next-step recommendations.
- `settings`: account security (password changes).

## High-level flow

1. User signs in through Supabase Auth.
2. Frontend calls backend API with user access token.
3. Backend validates token and applies user context.
4. CRUD and projection queries execute against Postgres.
5. RLS ensures each user only accesses own rows.
6. Frontend listens to realtime events and updates cards instantly.

## Deployment notes

- Host frontend on Vercel or Netlify.
- Host backend on Fly.io/Render/Railway.
- Use Supabase-managed Postgres and auth.
- Keep projection logic in backend service so web/mobile clients share the same business rules.
