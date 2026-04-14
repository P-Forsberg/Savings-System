import type { Category, Contribution, Goal, GoalProjection, GoalStatus, GoalWithProjection } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_STORAGE_KEY = "savings_api_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? "";
}

export function setStoredToken(token: string) {
  const trimmedToken = token.trim();
  if (!trimmedToken) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, trimmedToken);
}

async function request<T>(path: string, init?: RequestInit, requiresAuth = true): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  if (requiresAuth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error("Missing bearer token. Please log in.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export function getHealthStatus() {
  return request<{ status: string }>("/health", undefined, false);
}

export function listGoals() {
  return request<GoalWithProjection[]>("/api/goals");
}

export function getGoal(goalId: string) {
  return request<{ goal: Goal; contributions: Contribution[]; projection: GoalProjection }>(
    `/api/goals/${goalId}`
  );
}

export function createGoal(payload: {
  title: string;
  targetAmount: number;
  startDate: string;
  targetDate: string;
  plannedMonthlyAmount: number;
  categoryId?: string;
}) {
  return request<Goal>("/api/goals", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateGoal(
  goalId: string,
  payload: Partial<{
    title: string;
    targetAmount: number;
    targetDate: string;
    plannedMonthlyAmount: number;
    status: GoalStatus;
  }>
) {
  return request<Goal>(`/api/goals/${goalId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteGoal(goalId: string) {
  return request<void>(`/api/goals/${goalId}`, {
    method: "DELETE"
  });
}

export function createContribution(
  goalId: string,
  payload: { contributionDate: string; amount: number; note?: string }
) {
  return request<Contribution>(`/api/goals/${goalId}/contributions`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listCategories() {
  return request<Category[]>("/api/categories");
}

export function createCategory(payload: { name: string }) {
  return request<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
