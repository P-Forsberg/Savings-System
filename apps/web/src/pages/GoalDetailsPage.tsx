import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createContribution, deleteGoal, getGoal, updateGoal } from "../lib/api";
import { formatIsoDate, formatSek } from "../lib/format";
import type { Contribution, Goal, GoalProjection } from "../types";

export function GoalDetailsPage() {
  const { goalId = "" } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [projection, setProjection] = useState<GoalProjection | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const [contributionDate, setContributionDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const loadGoal = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGoal(goalId);
      setGoal(data.goal);
      setProjection(data.projection);
      setContributions(data.contributions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    if (!goalId) {
      return;
    }
    loadGoal();
  }, [goalId, loadGoal]);

  async function handleAddContribution(event: FormEvent) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || Number.isNaN(parsedAmount)) {
      setError("Amount must be non-zero.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createContribution(goalId, {
        contributionDate,
        amount: parsedAmount,
        note: note || undefined
      });
      setAmount("");
      setNote("");
      await loadGoal();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkCompleted() {
    if (!goal) {
      return;
    }

    setActionPending(true);
    setError("");
    try {
      await updateGoal(goal.id, { status: "completed" });
      await loadGoal();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionPending(false);
    }
  }

  async function handleDeleteGoal() {
    if (!goal) {
      return;
    }

    const confirmed = window.confirm("Delete this goal permanently?");
    if (!confirmed) {
      return;
    }

    setActionPending(true);
    setError("");
    try {
      await deleteGoal(goal.id);
      navigate("/", { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setActionPending(false);
    }
  }

  if (loading) {
    return <p>Loading goal...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!goal || !projection) {
    return <p>No goal data.</p>;
  }

  return (
    <section>
      <div className="card">
        <h2>{goal.title}</h2>
        <p className="muted">
          {formatIsoDate(goal.startDate)} - {formatIsoDate(goal.targetDate)}
        </p>
        <p className="muted">
          Status: <strong>{goal.status}</strong>
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
          <button
            type="button"
            onClick={handleMarkCompleted}
            disabled={actionPending || goal.status === "completed"}
          >
            {actionPending ? "Saving..." : "Complete/Purchased"}
          </button>
          <button type="button" onClick={handleDeleteGoal} disabled={actionPending}>
            Delete
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="card">
          <p className="muted">Saved so far</p>
          <p className="value">{formatSek(projection.savedSoFar)}</p>
        </div>
        <div className="card">
          <p className="muted">Remaining</p>
          <p className="value">{formatSek(projection.remainingAmount)}</p>
        </div>
        <div className="card">
          <p className="muted">Required next month</p>
          <p className="value">{formatSek(projection.requiredNextMonthAmount)}</p>
        </div>
        <div className="card">
          <p className="muted">Estimated completion</p>
          <p className="value">{formatIsoDate(projection.estimatedCompletionDate)}</p>
          <p className="muted">{projection.onTrack ? "On track" : "Behind plan"}</p>
        </div>
      </div>

      <div className="card">
        <h3>Add contribution</h3>
        <form className="form-grid" onSubmit={handleAddContribution}>
          <label>
            Date
            <input type="date" value={contributionDate} onChange={(event) => setContributionDate(event.target.value)} />
          </label>
          <label>
            Amount (SEK)
            <input
              type="number"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="1000"
            />
          </label>
          <label className="full">
            Note
            <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note" />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add contribution"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Contributions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((item) => (
              <tr key={item.id}>
                <td>{formatIsoDate(item.contributionDate)}</td>
                <td>{formatSek(item.amount)}</td>
                <td>{item.note ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
