import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHealthStatus, listGoals } from "../lib/api";
import { formatPercent, formatSek, formatIsoDate } from "../lib/format";
import type { GoalWithProjection } from "../types";

export function HomePage() {
  const [health, setHealth] = useState("loading");
  const [goals, setGoals] = useState<GoalWithProjection[]>([]);
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

  const totals = useMemo(() => {
    const saved = goals.reduce((sum, goal) => sum + goal.projection.savedSoFar, 0);
    const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const progress = target > 0 ? (saved / target) * 100 : 0;
    return { saved, target, progress };
  }, [goals]);

  return (
    <section>
      <div className="card">
        <h2>Total savings</h2>
        <p className="value">{formatSek(totals.saved)}</p>
        <p className="muted">
          Target: {formatSek(totals.target)} - Progress: {formatPercent(totals.progress)}
        </p>
        <p className="muted">API health: {health}</p>
      </div>

      {loading ? <p>Loading goals...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="goals-grid">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.projection.savedSoFar / goal.targetAmount) * 100 : 0;
          return (
            <Link key={goal.id} to={`/goals/${goal.id}`} className="card goal-card">
              <h3>{goal.title}</h3>
              <p>
                {formatSek(goal.projection.savedSoFar)} / {formatSek(goal.targetAmount)}
              </p>
              <p className="muted">
                {formatIsoDate(goal.startDate)} - {formatIsoDate(goal.targetDate)}
              </p>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
              </div>
              <p className="muted">
                {formatPercent(progress)} - <strong>{goal.status}</strong>
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
