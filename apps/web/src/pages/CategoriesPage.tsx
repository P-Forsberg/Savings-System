import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { PageShell } from "../components/PageShell";
import { EmptyState } from "../components/EmptyState";
import { createCategory, listCategories, listGoals } from "../lib/api";
import type { Category, GoalWithProjection } from "../types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<GoalWithProjection[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([listCategories(), listGoals()])
      .then(([categoriesData, goalsData]) => {
        if (active) {
          setCategories(categoriesData);
          setGoals(goalsData);
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const created = await createCategory({ name: name.trim() });
      setCategories((prev) => [created, ...prev]);
      setName("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="Kategorier" subtitle="Organisera dina sparmål">
      <form className="card" style={{ padding: "14px", display: "grid", gap: "8px" }} onSubmit={handleSubmit}>
        <div className="field">
          <label>Ny kategori</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Träning" />
        </div>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Sparar..." : "Skapa kategori"}
        </button>
      </form>
      {loading ? <p>Laddar kategorier...</p> : null}
      {error ? <p>{error}</p> : null}
      {!loading && categories.length === 0 ? (
        <EmptyState title="Inga kategorier" description="Skapa din första kategori för bättre översikt." />
      ) : (
        categories.map((category) => (
          <article className="card" key={category.id} style={{ padding: "14px" }}>
            <h3>{category.name}</h3>
            <p className="goal-category">{goals.filter((goal) => goal.categoryId === category.id).length} mål</p>
          </article>
        ))
      )}
    </PageShell>
  );
}
