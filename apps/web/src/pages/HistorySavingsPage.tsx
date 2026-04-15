import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import { GoalCard } from "../components/GoalCard";
import { EmptyState } from "../components/EmptyState";
import { listCategories, listGoals } from "../lib/api";
import type { GoalWithProjection } from "../types";

export function HistorySavingsPage() {
  const [goals, setGoals] = useState<GoalWithProjection[]>([]);
  const [categoryNameById, setCategoryNameById] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    listGoals()
      .then((data) => {
        if (active) {
          setGoals(data);
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    listCategories()
      .then((items) => {
        if (!active) return;
        const map = items.reduce<Record<string, string>>((acc, item) => {
          acc[item.id] = item.name;
          return acc;
        }, {});
        setCategoryNameById(map);
      })
      .catch(() => {
        // keep page usable even if categories fail
      });

    return () => {
      active = false;
    };
  }, []);

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "completed"),
    [goals]
  );

  return (
    <PageShell title="Historik" subtitle="Avklarade sparmål">
      {loading ? <p>Laddar historik...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading && !error && completedGoals.length === 0 ? (
        <EmptyState title="Ingen historik ännu" description="Här visas dina avklarade sparmål." />
      ) : (
        completedGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            readOnly
            category={goal.categoryId ? (categoryNameById[goal.categoryId] ?? "Kategori") : undefined}
          />
        ))
      )}
    </PageShell>
  );
}
