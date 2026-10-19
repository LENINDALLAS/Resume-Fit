import { getScoreBandColor, getScoreInterpretation } from "@resume-fit/shared";

interface ScoreCardProps {
  atsScore: number;
  atsVersion: string;
}

export function ScoreCard({ atsScore, atsVersion }: ScoreCardProps) {
  const color = getScoreBandColor(atsScore);
  const interpretation = getScoreInterpretation(atsScore);

  return (
    <section className="card-section" style={{ textAlign: "center" }}>
      <div className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: 4 }}>
        ATS Score ({atsVersion})
      </div>
      <div style={{ fontSize: "3rem", fontWeight: 700, color, lineHeight: 1 }}>
        {atsScore}
        <span style={{ fontSize: "1.25rem", color: "var(--color-text-secondary)" }}>/100</span>
      </div>
      <div style={{ color, fontWeight: 600, marginTop: 6 }}>{interpretation}</div>
    </section>
  );
}
