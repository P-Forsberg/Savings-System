import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { getStoredToken, setStoredToken } from "./lib/api";
import { supabase } from "./lib/supabase";
import { CreateGoalPage } from "./pages/CreateGoalPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { GoalDetailsPage } from "./pages/GoalDetailsPage";
import { HistorySavingsPage } from "./pages/HistorySavingsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getStoredToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize token from Supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setStoredToken(session.access_token);
      }
    });

    // Listen for auth state changes and update token accordingly
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        // Update token when session is refreshed or user logs in
        setStoredToken(session.access_token);
      } else {
        // Clear token and redirect to login when session ends
        setStoredToken("");
        navigate("/login", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/history-savings" element={<HistorySavingsPage />} />
        <Route path="/goals/:goalId" element={<GoalDetailsPage />} />
        <Route path="/create" element={<CreateGoalPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
