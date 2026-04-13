import createHttpError from "http-errors";
import { supabase } from "../../lib/supabase.js";
import type { SavingsGoal } from "../../types/domain.js";

function mapGoal(row: any): SavingsGoal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    targetAmount: Number(row.target_amount),
    startDate: row.start_date,
    targetDate: row.target_date,
    plannedMonthlyAmount: Number(row.planned_monthly_amount),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function createGoal(input: {
  userId: string;
  title: string;
  targetAmount: number;
  startDate: string;
  targetDate: string;
  plannedMonthlyAmount: number;
}) {
  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: input.userId,
      title: input.title,
      target_amount: input.targetAmount,
      start_date: input.startDate,
      target_date: input.targetDate,
      planned_monthly_amount: input.plannedMonthlyAmount
    })
    .select("*")
    .single();

  if (error) {
    throw createHttpError(400, error.message);
  }
  return mapGoal(data);
}

export async function listGoals(userId: string) {
  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw createHttpError(400, error.message);
  }
  return (data ?? []).map(mapGoal);
}

export async function getGoalById(id: string, userId: string) {
  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      throw createHttpError(404, "Goal not found");
    }
    throw createHttpError(400, error.message);
  }
  return mapGoal(data);
}

export async function updateGoal(
  id: string,
  userId: string,
  patch: Partial<Pick<SavingsGoal, "title" | "targetAmount" | "targetDate" | "plannedMonthlyAmount" | "status">>
) {
  const mappedPatch: Record<string, unknown> = {};
  if (patch.title !== undefined) mappedPatch.title = patch.title;
  if (patch.targetAmount !== undefined) mappedPatch.target_amount = patch.targetAmount;
  if (patch.targetDate !== undefined) mappedPatch.target_date = patch.targetDate;
  if (patch.plannedMonthlyAmount !== undefined) mappedPatch.planned_monthly_amount = patch.plannedMonthlyAmount;
  if (patch.status !== undefined) mappedPatch.status = patch.status;

  const { data, error } = await supabase
    .from("savings_goals")
    .update(mappedPatch)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) {
    throw createHttpError(400, error.message);
  }
  if (!data) {
    throw createHttpError(404, "Goal not found");
  }
  return mapGoal(data);
}

export async function archiveGoal(id: string, userId: string) {
  const { data, error } = await supabase
    .from("savings_goals")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id")
    .single();
  if (error || !data) {
    throw createHttpError(404, "Goal not found");
  }
}
