const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function SettingsPage() {
  return (
    <section className="card">
      <h2>Settings</h2>
      <p>API URL: {apiUrl}</p>
      <p className="muted">
        Password changes are handled by your auth provider (Supabase). This page is prepared for future session
        management.
      </p>
    </section>
  );
}
