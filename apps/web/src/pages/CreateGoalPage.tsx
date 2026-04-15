import { useState } from "react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { createGoal, listCategories } from "../lib/api";
import { nextYearIso, todayIso } from "../lib/format";
import type { Category } from "../types";

export function CreateGoalPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [plannedMonthlyAmount, setPlannedMonthlyAmount] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [targetDate, setTargetDate] = useState(nextYearIso());
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCategories()
      .then((items) => setCategories(items))
      .catch(() => {
        // keep create-goal usable even if categories fail
      });
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const parsedTarget = Number(targetAmount);
    const parsedMonthly = Number(plannedMonthlyAmount);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (parsedTarget <= 0 || parsedMonthly <= 0 || Number.isNaN(parsedTarget) || Number.isNaN(parsedMonthly)) {
      setError("Amount fields must be greater than 0.");
      return;
    }
    if (new Date(targetDate) < new Date(startDate)) {
      setError("Target date must be after or equal start date.");
      return;
    }

    setSaving(true);
    try {
      const newGoal = await createGoal({
        title: title.trim(),
        targetAmount: parsedTarget,
        plannedMonthlyAmount: parsedMonthly,
        startDate,
        targetDate,
        categoryId: categoryId || undefined
      });
      navigate(`/goals/${newGoal.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="Skapa mål" subtitle="Definiera ditt nya sparmål">
      <form className="card" style={{ padding: "16px", display: "grid", gap: "10px" }} onSubmit={handleSubmit}>
        <div className="field">
          <label>Titel</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Semester 2027" />
        </div>
        <div className="field">
          <label>Målbelopp (SEK)</label>
          <input type="number" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} />
        </div>
        <div className="field">
          <label>Månadsbelopp (SEK)</label>
          <input
            type="number"
            value={plannedMonthlyAmount}
            onChange={(event) => setPlannedMonthlyAmount(event.target.value)}
          />
        </div>
        <div className="field">
          <label>Startdatum</label>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>
        <div className="field">
          <label>Slutdatum</label>
          <input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
        </div>
        <div className="field">
          <label>Kategori</label>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Ingen kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Sparar..." : "Skapa mål"}
        </button>
        {error ? <p>{error}</p> : null}
      </form>
    </PageShell>
  );
}
