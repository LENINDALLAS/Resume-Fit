import { useState } from "react";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ExternalLink, RotateCcw } from "lucide-react";
import { ATS_SCORE_WEIGHTS, getScoreBandColor, getScoreInterpretation, type AnalysisDto } from "@resume-fit/shared";
import { tokenService } from "../../services/tokenService";
import { extensionService } from "../../services/extensionService";
import { useAppDispatch, useAnalysis, useAuth } from "../../hooks";
import { claimAnalysis } from "../../store";
import { ClaimPrompt } from "./claimPrompt";

interface ScoreModalProps {
  analysis: AnalysisDto;
  onAnalyzeAnother: () => void;
}

const ROWS: Array<{ key: keyof AnalysisDto["scoreBreakdown"]; label: string }> = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "education", label: "Education" },
  { key: "certifications", label: "Certifications" },
];

export function ScoreModal({ analysis, onAnalyzeAnother }: ScoreModalProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const { isClaiming, claimError } = useAnalysis();
  const [showClaimPrompt, setShowClaimPrompt] = useState(false);

  const color = getScoreBandColor(analysis.atsScore);
  const interpretation = getScoreInterpretation(analysis.atsScore);

  async function openDashboard() {
    const accessToken = await tokenService.getAccessToken();
    if (!accessToken) return;
    extensionService.openDashboardTab(accessToken, analysis.id);
  }

  // Claiming is idempotent server-side (it's a no-op if this user already
  // owns the analysis), so it's always safe to run before opening the dashboard.
  async function claimThenOpenDashboard() {
    const result = await dispatch(claimAnalysis(analysis.id));
    if (claimAnalysis.fulfilled.match(result)) {
      await openDashboard();
    }
  }

  function handleViewFullAnalysis() {
    if (!isAuthenticated) {
      setShowClaimPrompt(true);
      return;
    }
    void claimThenOpenDashboard();
  }

  if (showClaimPrompt) {
    return (
      <div className="popup-content">
        <ClaimPrompt
          onAuthenticated={() => {
            setShowClaimPrompt(false);
            void claimThenOpenDashboard();
          }}
          onCancel={() => setShowClaimPrompt(false)}
        />
      </div>
    );
  }

  return (
    <div className="popup-content">
      <div className="card-section" style={{ textAlign: "center" }}>
        <div className="text-secondary" style={{ fontSize: "0.8rem" }}>
          ATS Score
        </div>
        <div style={{ fontSize: "2.5rem", fontWeight: 700, color, lineHeight: 1 }}>
          {analysis.atsScore}
          <span style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)" }}>/100</span>
        </div>
        <div style={{ color, fontWeight: 600, marginTop: 4 }}>{interpretation}</div>
      </div>

      <div className="card-section">
        {ROWS.map(({ key, label }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>{label}</span>
            <span className="text-secondary">
              {analysis.scoreBreakdown[key]} / {ATS_SCORE_WEIGHTS[key]}
            </span>
          </div>
        ))}
      </div>

      {claimError && <Message severity="error" text={claimError} style={{ width: "100%", marginBottom: 12 }} />}

      <Button
        label={isClaiming ? "Loading..." : "See Missing Keywords & Suggestions"}
        icon={<ExternalLink size={16} style={{ marginRight: 6 }} />}
        disabled={isClaiming}
        style={{ width: "100%", marginBottom: 8 }}
        onClick={handleViewFullAnalysis}
      />

      <Button
        label="Analyze Another"
        icon={<RotateCcw size={16} style={{ marginRight: 6 }} />}
        outlined
        style={{ width: "100%" }}
        onClick={onAnalyzeAnother}
      />
    </div>
  );
}
