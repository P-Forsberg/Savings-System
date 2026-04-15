import { progressPercent } from "../lib/format";

interface ProgressBarProps {
  saved: number;
  target: number;
}

export function ProgressBar({ saved, target }: ProgressBarProps) {
  const pct = progressPercent(saved, target);

  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div
          className={`progress-fill ${pct >= 100 ? "progress-fill-complete" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="progress-label">{pct}%</span>
    </div>
  );
}
