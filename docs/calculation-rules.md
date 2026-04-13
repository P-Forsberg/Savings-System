# Calculation Rules

This document defines deterministic formulas for progress and rebalancing logic.

## Core values

- `savedSoFar = sum(all contribution amounts for goal)`
- `remainingAmount = max(targetAmount - savedSoFar, 0)`
- `monthsLeft = max(monthDiff(currentMonthStart, targetDateMonthStart), 1)`
- `requiredNextMonthAmount = remainingAmount / monthsLeft`
- `deltaVsPlan = requiredNextMonthAmount - plannedMonthlyAmount`

## On-track logic

`onTrack = requiredNextMonthAmount <= plannedMonthlyAmount`

Interpretation:

- Negative `deltaVsPlan`: user is ahead.
- Positive `deltaVsPlan`: user is behind and must increase monthly amount.

## Rebalancing after underpayment

If user pays less than planned during a month:

1. End-of-month variance = `actualMonthDeposit - plannedMonthlyAmount` (negative).
2. Carry deficit into remaining period.
3. Recompute `requiredNextMonthAmount` from updated `remainingAmount`.

This automatically proposes a higher next month amount.

## Rebalancing after overpayment

If user deposits more than planned:

1. Surplus lowers `remainingAmount`.
2. Recompute next month requirement from the same formula.
3. If user returns to planned monthly amount after one surplus month, estimate completion by:
   - Subtracting planned amount month-by-month from remaining amount.
   - First month where running remainder <= 0 becomes `estimatedCompletionDate`.

### Example

- Target 50 000 SEK, plan 2 000 SEK/month.
- User adds 10 000 SEK in one month.
- Remaining amount drops sharply, so completion can move several months earlier even if user goes back to 2 000 SEK/month.

## Edge cases

- Goal already complete: `remainingAmount=0`, `requiredNextMonthAmount=0`, completion date = today.
- Passed target date with remaining amount > 0: `onTrack=false`, return recommendation with required catch-up value.
- Negative contributions (withdrawals) can be allowed in v2; if enabled, formulas still hold.

## Recommended projection response shape

- `savedSoFar`
- `remainingAmount`
- `monthsLeft`
- `requiredNextMonthAmount`
- `plannedMonthlyAmount`
- `deltaVsPlan`
- `onTrack`
- `estimatedCompletionDate`
- `recommendation`
