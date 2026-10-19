import {
  ATS_SCORE_WEIGHTS,
  QUALITATIVE_MATCH_RATIO,
  REQUIREMENT_MATCH_RATIO,
  type AnalysisAiResult,
  type AtsScoreResult,
} from "@resume-fit/shared";

function clampRatio(ratio: number): number {
  if (Number.isNaN(ratio)) return 0;
  return Math.min(1, Math.max(0, ratio));
}

function calculateSkillsRatio(result: AnalysisAiResult): number {
  const matchedCount = result.skills.matched.length;
  const missingCount = result.skills.missing.length;
  const total = matchedCount + missingCount;

  if (total === 0) return 1;
  return clampRatio(matchedCount / total);
}

function calculateExperienceRatio(result: AnalysisAiResult): number {
  const { requiredYears, relevantYears, estimatedYears, match } = result.experience;
  const candidateYears = relevantYears ?? estimatedYears;

  if (requiredYears !== null && requiredYears > 0 && candidateYears !== null) {
    return clampRatio(candidateYears / requiredYears);
  }

  if (requiredYears === 0) return 1;

  return QUALITATIVE_MATCH_RATIO[match];
}

function calculateProjectsRatio(result: AnalysisAiResult): number {
  return QUALITATIVE_MATCH_RATIO[result.projects.match];
}

function calculateEducationRatio(result: AnalysisAiResult): number {
  return REQUIREMENT_MATCH_RATIO[result.education.match];
}

function calculateCertificationsRatio(result: AnalysisAiResult): number {
  return REQUIREMENT_MATCH_RATIO[result.certifications.match];
}

/**
 * Deterministic ATS scoring: given the same validated AI result, this always
 * returns the same score and breakdown. Gemini never influences the number
 * directly -- only the qualitative evaluations feeding these ratios.
 */
export function calculateAtsScore(result: AnalysisAiResult): AtsScoreResult {
  const skills = calculateSkillsRatio(result) * ATS_SCORE_WEIGHTS.skills;
  const experience = calculateExperienceRatio(result) * ATS_SCORE_WEIGHTS.experience;
  const projects = calculateProjectsRatio(result) * ATS_SCORE_WEIGHTS.projects;
  const education = calculateEducationRatio(result) * ATS_SCORE_WEIGHTS.education;
  const certifications = calculateCertificationsRatio(result) * ATS_SCORE_WEIGHTS.certifications;

  const rawTotal = skills + experience + projects + education + certifications;
  const atsScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  return {
    atsScore,
    scoreBreakdown: {
      skills: Math.round(skills),
      experience: Math.round(experience),
      projects: Math.round(projects),
      education: Math.round(education),
      certifications: Math.round(certifications),
    },
  };
}
