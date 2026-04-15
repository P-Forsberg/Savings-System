import { useEffect, useMemo, useState } from "react";
import { Target, Wallet } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { EmptyState } from "../components/EmptyState";
import { GoalCard } from "../components/GoalCard";
import { SummaryCard } from "../components/SummaryCard";
import { getHealthStatus, listCategories, listGoals } from "../lib/api";
import { progressPercent, formatSEK } from "../lib/format";
import type { GoalWithProjection } from "../types";

export function HomePage() {
  const [health, setHealth] = useState("loading");
  const [goals, setGoals] = useState<GoalWithProjection[]>([]);
  const [categoryNameById, setCategoryNameById] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealthStatus()
      .then((data) => setHealth(data.status))
      .catch(() => setHealth("unreachable"));
  }, []);

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

  const totals = useMemo(() => {
    const saved = goals.reduce((sum, goal) => sum + goal.projection.savedSoFar, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = progressPercent(saved, target);
    return { saved, target, progress };
  }, [goals]);

  return (
    <PageShell title="Savings Counter" subtitle={`API: ${health}`}>
      <div className="summary-grid">
        <SummaryCard label="Totalt sparat" value={formatSEK(totals.saved)} icon={<Wallet size={18} />} accent />
        <SummaryCard label="Totalt mål" value={formatSEK(totals.target)} icon={<Target size={18} />} />
        <SummaryCard label="Framsteg" value={`${totals.progress}%`} icon={<Target size={18} />} />
      </div>
      {loading ? <p>Laddar mål...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading && goals.length === 0 ? (
        <EmptyState title="Inga mål ännu" description="Skapa ditt första sparmål för att komma igång." />
      ) : (
        goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            category={goal.categoryId ? (categoryNameById[goal.categoryId] ?? "Kategori") : undefined}
          />
        ))
      )}
    </PageShell>
  );
}
