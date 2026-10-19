import { Tag } from "primereact/tag";
import { MatchTypeEnum, type MatchedSkill } from "@resume-fit/shared";

interface MatchedSkillsProps {
  matched: MatchedSkill[];
}

const MATCH_TYPE_LABEL: Record<MatchTypeEnum, string> = {
  [MatchTypeEnum.EXACT]: "Exact Match",
  [MatchTypeEnum.RELATED]: "Related Match",
};

export function MatchedSkills({ matched }: MatchedSkillsProps) {
  return (
    <section className="card-section">
      <h2>Matched Skills</h2>
      {matched.length === 0 && <p className="text-secondary">No matched skills identified.</p>}
      {matched.map((item) => (
        <div key={item.skill} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong>{item.skill}</strong>
            <Tag severity="success" value={MATCH_TYPE_LABEL[item.matchType]} />
          </div>
          <div className="text-secondary" style={{ fontSize: "0.9rem" }}>
            {item.evidence}
          </div>
        </div>
      ))}
    </section>
  );
}
