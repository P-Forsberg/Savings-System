import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function SettingsPage() {
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
    <section className="card">
      <h2>Settings</h2>
      <p>API URL: {apiUrl}</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          New password
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="muted">{success}</p> : null}
    </section>
  );
}
