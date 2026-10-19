import { ProgressBar } from "primereact/progressbar";
import { ATS_SCORE_WEIGHTS, type ScoreBreakdown as ScoreBreakdownType } from "@resume-fit/shared";

interface ScoreBreakdownProps {
  scoreBreakdown: ScoreBreakdownType;
}

const ROWS: Array<{ key: keyof ScoreBreakdownType; label: string }> = [
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "education", label: "Education" },
  { key: "certifications", label: "Certifications" },
];

export function ScoreBreakdown({ scoreBreakdown }: ScoreBreakdownProps) {
  return (
    <section className="card-section">
      <h2>Score Breakdown</h2>
      {ROWS.map(({ key, label }) => {
        const value = scoreBreakdown[key];
        const max = ATS_SCORE_WEIGHTS[key];
        return (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{label}</span>
              <span className="text-secondary">
                {value} / {max}
              </span>
            </div>
            <ProgressBar value={(value / max) * 100} showValue={false} style={{ height: 8 }} />
          </div>
        );
      })}
    </section>
  );
}
