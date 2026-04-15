import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { ProgressBar } from "../components/ProgressBar";
import { StatusBadge } from "../components/StatusBadge";
import { SummaryCard } from "../components/SummaryCard";
import { createContribution, deleteGoal, getGoal, listCategories, updateGoal } from "../lib/api";
import { formatDate, formatSEK } from "../lib/format";
import type { Category, Contribution, Goal, GoalProjection } from "../types";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Coins,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    let active = true;
    listCategories()
      .then((items) => {
        if (active) {
          setCategories(items);
        }
      })
      .catch(() => {
        // keep details page usable even if category listing fails
      });

    return () => {
      active = false;
    };
  }, []);

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

  if (loading) return <PageShell title="Målladdning"><p>Laddar...</p></PageShell>;
  if (error) return <PageShell title="Fel"><p>{error}</p></PageShell>;
  if (!goal || !projection) return <PageShell title="Mål saknas"><p>Inget mål hittades.</p></PageShell>;

  return (
    <PageShell
      title={goal.title}
      subtitle={goal.categoryId ? categories.find((x) => x.id === goal.categoryId)?.name : undefined}
      action={
        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} aria-label="Tillbaka">
          <ArrowLeft size={18} />
        </button>
      }
    >
      <div className="card detail-top-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StatusBadge status={goal.status} />
          <p className="goal-category">{formatDate(goal.startDate)} → {formatDate(goal.targetDate)}</p>
        </div>
        <p>
          <strong style={{ fontSize: "38px", letterSpacing: "-0.01em" }}>{formatSEK(projection.savedSoFar)}</strong>{" "}
          <span className="goal-category">/ {formatSEK(goal.targetAmount)}</span>
        </p>
        <ProgressBar saved={projection.savedSoFar} target={goal.targetAmount} />
      </div>

      <div className="summary-grid">
        <SummaryCard label="Kvar att spara" value={formatSEK(projection.remainingAmount)} icon={<Coins size={18} />} />
        <SummaryCard label="Behov nästa mån" value={formatSEK(projection.requiredNextMonthAmount)} icon={<TrendingDown size={18} />} />
        <SummaryCard label="Beräknad klar" value={formatDate(projection.estimatedCompletionDate)} icon={<CalendarClock size={18} />} />
        <SummaryCard
          label="Status"
          value={projection.onTrack ? "I fas" : "Bakom ⚠️"}
          icon={projection.onTrack ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        />
      </div>

      {!showForm ? (
        <button type="button" className="outline-wide-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Lägg till insättning
        </button>
      ) : (
        <div className="card" style={{ padding: "14px" }}>
          <h3 style={{ marginBottom: "8px" }}>Ny insättning</h3>
          <form style={{ display: "grid", gap: "8px" }} onSubmit={handleAddContribution}>
            <div className="field">
              <label>Datum</label>
              <input type="date" value={contributionDate} onChange={(event) => setContributionDate(event.target.value)} />
            </div>
            <div className="field">
              <label>Belopp (SEK)</label>
              <input type="number" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="1000" />
            </div>
            <div className="field">
              <label>Anteckning</label>
              <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Valfritt" />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? "Sparar..." : "Spara"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}

      <h3 style={{ marginTop: "4px" }}>Insättningshistorik</h3>
      <div style={{ display: "grid", gap: "8px" }}>
        {contributions.length === 0 ? <p className="goal-category">Inga insättningar ännu.</p> : null}
        {contributions.map((item) => (
          <div key={item.id} className="history-row">
            <div>
              <p style={{ fontWeight: 700 }}>{formatSEK(item.amount)}</p>
              {item.note ? <p className="goal-category">{item.note}</p> : null}
            </div>
            <p className="goal-category">{formatDate(item.contributionDate)}</p>
          </div>
        ))}
      </div>

      <div className="details-footer-actions">
        <button
          type="button"
          className="outline-wide-btn"
          onClick={handleMarkCompleted}
          disabled={actionPending || goal.status === "completed"}
        >
          <CheckCircle2 size={18} />
          {actionPending ? "Sparar..." : "Markera klar"}
        </button>
        <button type="button" className="danger-icon-btn" onClick={handleDeleteGoal} disabled={actionPending}>
          <Trash2 size={17} />
        </button>
      </div>
    </PageShell>
  );
}
