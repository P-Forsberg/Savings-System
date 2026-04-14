import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { createCategory, listCategories } from "../lib/api";
import type { Category } from "../types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listCategories()
      .then((data) => {
        if (active) {
          setCategories(data);
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
    <section className="card">
      <h2>Categories</h2>
      <p className="muted">Create your own categories like Training, Golf or Home.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="full">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Training" />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create category"}
        </button>
      </form>

      {loading ? <p>Loading categories...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && categories.length === 0 ? <p className="muted">No categories yet.</p> : null}

      {categories.length > 0 ? (
        <div className="goals-grid">
          {categories.map((category) => (
            <article className="card" key={category.id}>
              <h3>{category.name}</h3>
              <p className="muted">{category.createdAt.slice(0, 10)}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
