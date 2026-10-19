import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAuth, useAnalysis } from "../../hooks";
import { deleteAnalysis, fetchAnalysis, processHandoff } from "../../store";
import { LoadingSpinner } from "../../components/loading/loadingSpinner";
import {
  MatchedSkills,
  MissingSkills,
  ScoreBreakdown,
  ScoreCard,
  Strengths,
  Suggestions,
} from "../../components/analysis";

export function AnalysisPage() {
  const { analysisId: pathAnalysisId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialising } = useAuth();
  const { analysis, isLoading, error } = useAnalysis();
  const [handoffChecked, setHandoffChecked] = useState(false);

  const token = searchParams.get("token");
  const queryAnalysisId = searchParams.get("analysisId");
  const analysisId = pathAnalysisId ?? queryAnalysisId ?? null;

  // Process an extension handoff exactly once, then replace the URL with a clean path.
  useEffect(() => {
    let cancelled = false;

    async function processExtensionToken() {
      if (!token) {
        setHandoffChecked(true);
        return;
      }

      const user = await dispatch(processHandoff(token)).unwrap().catch(() => null);
      if (cancelled) return;

      setHandoffChecked(true);

      if (user && analysisId) {
        navigate(`/analysis/${analysisId}`, { replace: true });
      } else if (!user) {
        navigate("/login", { replace: true });
      }
    }

    processExtensionToken();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!handoffChecked || isInitialising) return;

    if (!isAuthenticated) {
      if (!token) {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (!analysisId) return;
    if (analysis?.id === analysisId) return;

    dispatch(fetchAnalysis(analysisId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoffChecked, isInitialising, isAuthenticated, analysisId]);

  function handleDelete() {
    if (!analysisId) return;
    confirmDialog({
      header: "Delete analysis",
      message: "Are you sure you want to delete this analysis? This cannot be undone.",
      acceptLabel: "Delete",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-danger",
      accept: async () => {
        await dispatch(deleteAnalysis(analysisId));
        navigate("/login", { replace: true });
      },
    });
  }

  if (!handoffChecked || isInitialising || isLoading) {
    return <LoadingSpinner />;
  }

  if (!analysisId) {
    return (
      <div className="app-content">
        <Message severity="warn" text="Invalid analysis link." style={{ width: "100%" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-content">
        <Message severity="error" text={error} style={{ width: "100%" }} />
      </div>
    );
  }

  if (!analysis) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-content">
      <ScoreCard atsScore={analysis.atsScore} atsVersion={analysis.atsVersion} />
      <ScoreBreakdown scoreBreakdown={analysis.scoreBreakdown} />

      <div
        className="analysis-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
      >
        <MatchedSkills matched={analysis.skills.matched} />
        <MissingSkills missing={analysis.skills.missing} />
      </div>

      <div
        className="analysis-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
      >
        <Suggestions suggestions={analysis.suggestions} />
        <Strengths strengths={analysis.strengths} />
      </div>

      <Button
        label="Delete Analysis"
        icon={<Trash2 size={16} style={{ marginRight: 6 }} />}
        severity="danger"
        outlined
        onClick={handleDelete}
      />
    </div>
  );
}
