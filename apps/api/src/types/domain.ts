export type GoalStatus = "active" | "completed" | "paused" | "archived";

export interface SavingsGoal {
  id: string;
  userId: string;
  categoryId?: string | null;
  title: string;
  targetAmount: number;
  startDate: string;
  targetDate: string;
  plannedMonthlyAmount: number;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  goalId: string;
  userId: string;
  contributionDate: string;
  amount: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
