import { useNavigate } from "react-router-dom";
import { formatDate, formatSEK } from "../lib/format";
import type { GoalWithProjection } from "../types";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";

interface GoalCardProps {
  goal: GoalWithProjection;
  category?: string;
  readOnly?: boolean;
}

export function GoalCard({ goal, category, readOnly }: GoalCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      disabled={readOnly}
      className="goal-card"
      onClick={() => {
        if (!readOnly) {
          navigate(`/goals/${goal.id}`);
        }
      }}
    >
      <div className="goal-top">
        <div>
          <h3>{goal.title}</h3>
          <p className="goal-category">{category ?? "Ingen kategori"}</p>
        </div>
        <StatusBadge status={goal.status} />
      </div>
      <ProgressBar saved={goal.projection.savedSoFar} target={goal.targetAmount} />
      <div className="goal-meta">
        <p>
          <strong>{formatSEK(goal.projection.savedSoFar)}</strong> / {formatSEK(goal.targetAmount)}
        </p>
        <p>{formatDate(goal.startDate)} → {formatDate(goal.targetDate)}</p>
      </div>
    </button>
  );
}
