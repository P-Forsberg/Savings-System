import { useCallback, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { setStoredToken } from "../lib/api";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setStoredToken("");
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    let timeoutId: number;

    function resetTimer() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart"
    ];

    for (const eventName of activityEvents) {
      window.addEventListener(eventName, resetTimer, { passive: true });
    }
    document.addEventListener("visibilitychange", resetTimer);

    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of activityEvents) {
        window.removeEventListener(eventName, resetTimer);
      }
      document.removeEventListener("visibilitychange", resetTimer);
    };
  }, [handleLogout]);

  return (
    <div className="shell">
      <header className="top-bar">
        <div>
          <h1>Savings Counter</h1>
          <p className="muted">Frontend MVP mapped from your view spec.</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/create">Create</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/history-savings">History savings</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
