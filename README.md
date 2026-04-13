# SavingsCounter

SavingsCounter is a savings planning platform with monthly tracking, live progress, and projection logic.

## Structure

- `apps/api`: Node.js + TypeScript backend (Express, Supabase auth, RLS-ready).
- `database`: PostgreSQL schema and RLS SQL scripts.
- `docs`: architecture, API, calculation rules, frontend flow, and test strategy.

## Quick start (API)

1. Go to `apps/api`.
2. Copy `.env.example` to `.env` and fill Supabase values.
3. Install dependencies: `npm install`
4. Run in dev mode: `npm run dev`

## Debugging-oriented design

- Separation by module (`goals`, `contributions`, `projections`).
- Schema validation via Zod at route boundary.
- Centralized error handling.
- Structured logging with Pino.
- Projection engine isolated in a pure function service for unit tests.
