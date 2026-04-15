import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { setStoredToken } from "../lib/api";
import { supabase } from "../lib/supabase";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function SettingsPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Password updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <PageShell title="Inställningar" subtitle={`API: ${apiUrl}`}>
      <form className="card" style={{ padding: "14px", display: "grid", gap: "8px" }} onSubmit={handleSubmit}>
        <div className="field">
          <label>Nytt lösenord</label>
          <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
        </div>
        <div className="field">
          <label>Bekräfta lösenord</label>
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Uppdaterar..." : "Uppdatera lösenord"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setStoredToken("");
            navigate("/login", { replace: true });
          }}
        >
          Logga ut
        </button>
        {error ? <p>{error}</p> : null}
        {success ? <p>{success}</p> : null}
      </form>
    </PageShell>
  );
}
