import type { Contribution, SavingsGoal } from "../../types/domain.js";

export interface GoalProjection {
  onTrack: boolean;
  savedSoFar: number;
  remainingAmount: number;
  monthsLeft: number;
  requiredNextMonthAmount: number;
  plannedMonthlyAmount: number;
  deltaVsPlan: number;
  estimatedCompletionDate: string;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function monthsBetween(currentDate: Date, targetDate: Date) {
  const years = targetDate.getUTCFullYear() - currentDate.getUTCFullYear();
  const months = targetDate.getUTCMonth() - currentDate.getUTCMonth();
  return years * 12 + months;
}

function estimateCompletionDate(startAt: Date, remainingAmount: number, monthlyAmount: number) {
  if (remainingAmount <= 0) {
    return startAt.toISOString().slice(0, 10);
  }

  const monthCount = Math.ceil(remainingAmount / monthlyAmount);
  const result = new Date(Date.UTC(startAt.getUTCFullYear(), startAt.getUTCMonth() + monthCount, 1));
  return result.toISOString().slice(0, 10);
}

export function projectGoal(goal: SavingsGoal, contributions: Contribution[]): GoalProjection {
  const now = new Date();
  const targetDate = new Date(goal.targetDate);
  const savedSoFar = round2(contributions.reduce((sum, item) => sum + item.amount, 0));
  const remainingAmount = round2(Math.max(goal.targetAmount - savedSoFar, 0));
  const monthsLeft = Math.max(monthsBetween(now, targetDate), 1);
  const requiredNextMonthAmount = round2(remainingAmount / monthsLeft);
  const deltaVsPlan = round2(requiredNextMonthAmount - goal.plannedMonthlyAmount);

  const estimatedCompletionDate = estimateCompletionDate(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    remainingAmount,
    Math.max(goal.plannedMonthlyAmount, 1)
  );

  return {
    onTrack: requiredNextMonthAmount <= goal.plannedMonthlyAmount,
    savedSoFar,
    remainingAmount,
    monthsLeft,
    requiredNextMonthAmount,
    plannedMonthlyAmount: goal.plannedMonthlyAmount,
    deltaVsPlan,
    estimatedCompletionDate
  };
}
