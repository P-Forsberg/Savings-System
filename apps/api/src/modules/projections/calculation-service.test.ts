import { describe, expect, it } from "vitest";
import { projectGoal } from "./calculation-service.js";
import type { Contribution, SavingsGoal } from "../../types/domain.js";

const baseGoal: SavingsGoal = {
  id: "g1",
  userId: "u1",
  title: "Laptop",
  targetAmount: 12000,
  startDate: "2026-01-01",
  targetDate: "2026-12-01",
  plannedMonthlyAmount: 1000,
  status: "active",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z"
};

function contribution(amount: number): Contribution {
  return {
    id: crypto.randomUUID(),
    goalId: "g1",
    userId: "u1",
    contributionDate: "2026-02-01",
    amount,
    note: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z"
  };
}

describe("projectGoal", () => {
  it("shows completed when saved reaches target", () => {
    const result = projectGoal(baseGoal, [contribution(12000)]);
    expect(result.remainingAmount).toBe(0);
    expect(result.requiredNextMonthAmount).toBe(0);
    expect(result.onTrack).toBe(true);
  });

  it("shows ahead of plan after large surplus", () => {
    const result = projectGoal(baseGoal, [contribution(5000)]);
    expect(result.savedSoFar).toBe(5000);
    expect(result.deltaVsPlan).toBeLessThanOrEqual(0);
  });
});
