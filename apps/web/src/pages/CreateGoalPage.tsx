import { useState } from "react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createGoal, listCategories } from "../lib/api";
import type { Category } from "../types";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function nextYearIso() {
  const now = new Date();
  const next = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  return next.toISOString().slice(0, 10);
}

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
    <section className="card">
      <h2>Create goal</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="full">
          Title
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Vacation 2027" />
        </label>
        <label>
          Target amount
          <input
            type="number"
            step="1"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            placeholder="50000"
          />
        </label>
        <label>
          Planned monthly amount
          <input
            type="number"
            step="1"
            value={plannedMonthlyAmount}
            onChange={(event) => setPlannedMonthlyAmount(event.target.value)}
            placeholder="3000"
          />
        </label>
        <label>
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Target date
          <input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
