# API Specification (CRUD + Projections)

Base path: `/api`

All endpoints require bearer token from Supabase Auth.

## Goals

### `POST /goals`

Creates a new savings goal.

Request:

```json
{
  "title": "Japan Trip",
  "targetAmount": 50000,
  "startDate": "2026-05-01",
  "targetDate": "2027-05-01",
  "plannedMonthlyAmount": 4200
}
```

Response `201`:

```json
{
  "id": "uuid",
  "title": "Japan Trip",
  "savedSoFar": 0,
  "progressPercent": 0
}
```

### `GET /goals`

Returns all user goals plus summary metrics for cards.

Response fields per goal:

- `id`, `title`, `status`
- `targetAmount`, `savedSoFar`, `remainingAmount`
- `startDate`, `targetDate`
- `plannedMonthlyAmount`
- `progressPercent`
- `estimatedCompletionDate`

### `GET /goals/:id`

Returns goal details and monthly history.

Includes:

- Goal metadata
- Latest contributions
- Monthly grouped totals
- Projection snapshot

### `PATCH /goals/:id`

Partial update of title/target/date/status/monthly target.

### `DELETE /goals/:id`

Soft-delete recommendation: set `status=archived`.
Hard-delete allowed if business wants full removal.

## Contributions

### `POST /goals/:id/contributions`

Adds a contribution entry.

```json
{
  "contributionDate": "2026-06-15",
  "amount": 10000,
  "note": "Bonus salary"
}
```

### `GET /goals/:id/contributions?from=2026-01&to=2026-12`

Lists contributions in period and grouped totals by month.

### `PATCH /contributions/:contributionId`

Edits amount/date/note.

### `DELETE /contributions/:contributionId`

Removes one contribution.

## Projection endpoint

### `GET /goals/:id/projection`

Response:

```json
{
  "onTrack": true,
  "savedSoFar": 22000,
  "remainingAmount": 28000,
  "monthsLeft": 10,
  "requiredNextMonthAmount": 2800,
  "plannedMonthlyAmount": 3000,
  "deltaVsPlan": -200,
  "estimatedCompletionDate": "2027-03-01",
  "recommendation": "You are ahead of plan by 200 SEK/month."
}
```

## Validation and errors

- `400` invalid payload (negative target, invalid dates).
- `401` missing/invalid token.
- `403` row not owned by user (RLS or explicit guard).
- `404` goal/contribution not found.
- `409` business conflict (e.g. trying to add contribution to archived goal).
