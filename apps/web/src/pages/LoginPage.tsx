import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark } from "lucide-react";
import { setStoredToken } from "../lib/api";
import { supabase } from "../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    setIsSubmitting(false);

    if (signInError || !data.session?.access_token) {
      setError(signInError?.message ?? "Login failed");
      return;
    }

    setStoredToken(data.session.access_token);
    navigate("/", { replace: true });
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "16px" }}>
      <section className="card" style={{ width: "100%", maxWidth: "420px", padding: "18px", display: "grid", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Landmark size={22} />
          <h2>Savings Counter</h2>
        </div>
        <p className="goal-category">Logga in med ditt Supabase-konto.</p>
        <form style={{ display: "grid", gap: "8px" }} onSubmit={handleSubmit}>
          <div className="field">
            <label>E-post</label>
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="field">
            <label>Lösenord</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Loggar in..." : "Logga in"}
          </button>
        </form>
        {error ? <p>{error}</p> : null}
      </section>
    </div>
  );
}
