# Frontend Views and Behavior

## 1) Home page

### Top total card

- Displays total saved amount across all goals.
- Optional secondary value: total target across all goals.
- Shows aggregated progress percentage.

### Goal cards (clickable)

Each card shows:

- Goal title.
- Saved amount vs target amount.
- Date interval (`startDate - targetDate`).
- Progress bar/slider visual.
- Status badge (`active`, `completed`, etc).

Card click routes to goal details page.

## 2) Goal details page

- Header with title and current progress.
- KPI row:
  - Saved so far
  - Remaining
  - Required next month
  - Estimated completion date
- Contributions list by month.
- Monthly history chart/table.
- Add contribution form.
- Realtime updates when a contribution is added/edited/deleted.

## 3) Create page

Create new savings goal form:

- `title`
- `targetAmount`
- `startDate`
- `targetDate`
- `plannedMonthlyAmount`

Client validation:

- Amount fields must be > 0.
- Target date must be after or equal start date.

## 4) Settings page

- Change password action through auth provider.
- Optional: current session list and sign-out-all in future version.

## UX notes

- Currency should be formatted in SEK.
- All projection values should explain whether user is ahead/behind.
- Prefer optimistic UI for contribution insertions and reconcile via realtime event.
