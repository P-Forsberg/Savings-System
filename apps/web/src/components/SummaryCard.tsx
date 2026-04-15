interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export function SummaryCard({ label, value, icon, accent }: SummaryCardProps) {
  return (
    <div className={`summary-card ${accent ? "summary-card-accent" : ""}`}>
      <div className="summary-icon">{icon}</div>
      <div>
        <p className="summary-label">{label}</p>
        <p className="summary-value">{value}</p>
      </div>
    </div>
  );
}
