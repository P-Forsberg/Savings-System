import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { getStoredToken } from "./lib/api";
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

function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CreateGoalPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
        path="/create"
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HomePage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <HistorySavingsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals/:goalId"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <GoalDetailsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <CategoriesPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <SettingsPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
