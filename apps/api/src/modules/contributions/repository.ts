import createHttpError from "http-errors";
import { supabase } from "../../lib/supabase.js";
import type { Contribution } from "../../types/domain.js";

function mapContribution(row: any): Contribution {
  return {
    id: row.id,
    goalId: row.goal_id,
    userId: row.user_id,
    contributionDate: row.contribution_date,
    amount: Number(row.amount),
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function createContribution(input: {
  goalId: string;
  userId: string;
  contributionDate: string;
  amount: number;
  note?: string;
}) {
  const { data, error } = await supabase
    .from("goal_contributions")
    .insert({
      goal_id: input.goalId,
      user_id: input.userId,
      contribution_date: input.contributionDate,
      amount: input.amount,
      note: input.note ?? null
    })
    .select("*")
    .single();

  if (error) {
    throw createHttpError(400, error.message);
  }
  return mapContribution(data);
}

export async function listContributionsByGoal(goalId: string, userId: string) {
  const { data, error } = await supabase
    .from("goal_contributions")
    .select("*")
    .eq("goal_id", goalId)
    .eq("user_id", userId)
    .order("contribution_date", { ascending: false });

  if (error) {
    throw createHttpError(400, error.message);
  }
  return (data ?? []).map(mapContribution);
}

export async function updateContribution(
  id: string,
  userId: string,
  patch: Partial<Pick<Contribution, "amount" | "contributionDate" | "note">>
) {
  const mappedPatch: Record<string, unknown> = {};
  if (patch.amount !== undefined) mappedPatch.amount = patch.amount;
  if (patch.contributionDate !== undefined) mappedPatch.contribution_date = patch.contributionDate;
  if (patch.note !== undefined) mappedPatch.note = patch.note;

  const { data, error } = await supabase
    .from("goal_contributions")
    .update(mappedPatch)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw createHttpError(400, error.message);
  }
  if (!data) {
    throw createHttpError(404, "Contribution not found");
  }
  return mapContribution(data);
}

export async function deleteContribution(id: string, userId: string) {
  const { error } = await supabase.from("goal_contributions").delete().eq("id", id).eq("user_id", userId);
  if (error) {
    throw createHttpError(400, error.message);
  }
}
