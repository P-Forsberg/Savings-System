# Test Plan

## 1) Unit tests (calculation engine)

Cover at least:

- `onTrack=true` when required/month <= planned/month.
- `onTrack=false` when behind plan.
- Surplus month reduces next-month requirement.
- Deficit month increases next-month requirement.
- Big one-off contribution moves estimated completion date earlier.
- Completed goals return zero remaining and immediate completion date.

## 2) Integration tests (API + DB)

- Create/list/update/archive goals.
- Add/edit/delete contributions.
- Projection endpoint returns expected shape and coherent values.
- Validation errors for bad payloads and invalid dates.

## 3) Authorization tests (RLS)

- User A cannot read User B goals.
- User A cannot insert contribution on User B goal.
- User A cannot update/delete User B contribution.
- Anonymous requests are denied.

## 4) Realtime tests

- New contribution triggers live update on home and detail views.
- Updated contribution recomputes KPIs.
- Deleted contribution recomputes projection and progress bar.

## 5) UI tests

- Home renders top total card and goal cards correctly.
- Card click opens details view.
- Details view shows monthly history and KPI block.
- Create form validates fields and submits valid payload.
- Settings password change flow works end-to-end.

## 6) Suggested tools

- Unit/integration: Vitest or Jest + Supertest.
- E2E/UI: Playwright.
- SQL/policy testing: pgTAP or dedicated integration suite against test Supabase project.
