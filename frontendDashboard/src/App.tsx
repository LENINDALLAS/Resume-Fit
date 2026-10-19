import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useAppDispatch, useAuth } from "./hooks";
import { initializeAuth } from "./store";
import { Navbar } from "./components/navigation/navbar";
import { ProtectedRoute } from "./components/common/protectedRoute";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { AnalysisPage } from "./pages/analysis/analysis";
import { NotFound } from "./pages/notFound/notFound";

export function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="app-shell">
      <ConfirmDialog />
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/analysis" : "/login"} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Public entry point: handles the extension handoff (?token=&analysisId=) before redirecting. */}
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route
          path="/analysis/:analysisId"
          element={
            <ProtectedRoute>
              <AnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
