import { CheckCircle2 } from "lucide-react";

interface StrengthsProps {
  strengths: string[];
}

export function Strengths({ strengths }: StrengthsProps) {
  return (
    <section className="card-section">
      <h2>Strengths</h2>
      {strengths.length === 0 ? (
        <p className="text-secondary">No strengths identified.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {strengths.map((strength) => (
            <li
              key={strength}
              style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}
            >
              <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
