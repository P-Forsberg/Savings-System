export type GoalStatus = "active" | "completed" | "paused" | "archived";

export interface Goal {
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

export interface GoalWithProjection extends Goal {
  projection: GoalProjection;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
