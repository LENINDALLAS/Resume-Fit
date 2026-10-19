import { Tag } from "primereact/tag";
import { ImportanceEnum, type MissingSkill } from "@resume-fit/shared";

interface MissingSkillsProps {
  missing: MissingSkill[];
}

const IMPORTANCE_ORDER: Record<ImportanceEnum, number> = {
  [ImportanceEnum.HIGH]: 0,
  [ImportanceEnum.MEDIUM]: 1,
  [ImportanceEnum.LOW]: 2,
};

const IMPORTANCE_SEVERITY: Record<ImportanceEnum, "danger" | "warning" | "info"> = {
  [ImportanceEnum.HIGH]: "danger",
  [ImportanceEnum.MEDIUM]: "warning",
  [ImportanceEnum.LOW]: "info",
};

export function MissingSkills({ missing }: MissingSkillsProps) {
  const sorted = [...missing].sort((a, b) => IMPORTANCE_ORDER[a.importance] - IMPORTANCE_ORDER[b.importance]);

  return (
    <section className="card-section">
      <h2>Missing Keywords &amp; Skills</h2>
      {sorted.length === 0 && <p className="text-secondary">No major missing skills identified.</p>}
      {sorted.map((item) => (
        <div key={item.skill} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong>{item.skill}</strong>
            <Tag severity={IMPORTANCE_SEVERITY[item.importance]} value={item.importance} />
          </div>
          <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
            {item.reason}
          </div>
        </div>
      ))}
    </section>
  );
}
