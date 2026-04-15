import type { GoalStatus } from "../types";

const labels: Record<GoalStatus, string> = {
  active: "Aktiv",
  completed: "Klar",
  paused: "Pausad",
  archived: "Arkiverad",
};

export function StatusBadge({ status }: { status: GoalStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
