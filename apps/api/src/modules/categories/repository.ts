import createHttpError from "http-errors";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "../../types/domain.js";

function mapCategory(row: any): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listCategories(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw createHttpError(400, error.message);
  }

  return (data ?? []).map(mapCategory);
}

export async function createCategory(input: { supabase: SupabaseClient; userId: string; name: string }) {
  const { data, error } = await input.supabase
    .from("categories")
    .insert({
      user_id: input.userId,
      name: input.name
    })
    .select("*")
    .single();

  if (error) {
    throw createHttpError(400, error.message);
  }

  return mapCategory(data);
}
