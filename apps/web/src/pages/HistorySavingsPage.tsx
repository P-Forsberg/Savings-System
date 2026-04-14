import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listGoals } from "../lib/api";
import { formatIsoDate, formatSek } from "../lib/format";
import type { GoalWithProjection } from "../types";

export function HistorySavingsPage() {
  const [goals, setGoals] = useState<GoalWithProjection[]>([]);
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

  const completedGoals = useMemo(
    () => goals.filter((goal) => goal.status === "completed"),
    [goals]
  );

  return (
    <section>
      <div className="card">
        <h2>History savings</h2>
        <p className="muted">Completed goals are shown here.</p>
      </div>

      {loading ? <p>Loading history...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && completedGoals.length === 0 ? (
        <p className="muted">No completed goals yet.</p>
      ) : null}

      <div className="goals-grid">
        {completedGoals.map((goal) => (
          <Link key={goal.id} to={`/goals/${goal.id}`} className="card goal-card">
            <h3>{goal.title}</h3>
            <p>
              {formatSek(goal.projection.savedSoFar)} / {formatSek(goal.targetAmount)}
            </p>
            <p className="muted">
              {formatIsoDate(goal.startDate)} - {formatIsoDate(goal.targetDate)}
            </p>
            <p className="muted">
              Status: <strong>{goal.status}</strong>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
