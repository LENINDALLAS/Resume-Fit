import { useEffect, useState } from "react";
import { useAppDispatch, useAuth } from "./hooks";
import { initializeAuth } from "./store";
import { PopupHeader } from "./components/common/popupHeader";
import { LoadingSpinner } from "./components/loading/loadingSpinner";
import { Login } from "./pages/login/login";
import { ResumeUpload } from "./pages/resumeUpload/resumeUpload";

export function App() {
  const dispatch = useAppDispatch();
  const { isInitialising, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) setShowLogin(false);
  }, [isAuthenticated]);

  if (isInitialising) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PopupHeader onLoginClick={() => setShowLogin(true)} />
      {/*
        Analysis creation never requires authentication -- the extension lets
        anyone paste a job description and upload a resume immediately. Login
        is only asked for when viewing full details on the dashboard (see
        scoreModal.tsx's claim prompt), or here voluntarily via the header link.
      */}
      {showLogin ? <Login /> : <ResumeUpload />}
    </div>
  );
}
