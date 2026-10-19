import { describe, expect, it } from "vitest";
import {
  ImportanceEnum,
  MatchTypeEnum,
  QualitativeMatchEnum,
  RequirementMatchEnum,
  type AnalysisAiResult,
} from "@resume-fit/shared";
import { calculateAtsScore } from "./atsScoringService.js";

function buildAiResult(overrides: Partial<AnalysisAiResult> = {}): AnalysisAiResult {
  return {
    skills: { matched: [], missing: [] },
    experience: {
      requiredYears: null,
      estimatedYears: null,
      relevantYears: null,
      match: QualitativeMatchEnum.NONE,
      reason: "",
    },
    projects: { relevantProjects: [], match: QualitativeMatchEnum.NONE },
    education: {
      required: "",
      candidateEducation: [],
      match: RequirementMatchEnum.NONE,
      reason: "",
    },
    certifications: {
      required: [],
      matched: [],
      missing: [],
      match: RequirementMatchEnum.NONE,
    },
    suggestions: [],
    strengths: [],
    ...overrides,
  };
}

const FULL_MATCH = buildAiResult({
  skills: {
    matched: [{ skill: "Node.js", matchType: MatchTypeEnum.EXACT, evidence: "..." }],
    missing: [],
  },
  experience: {
    requiredYears: 3,
    estimatedYears: 5,
    relevantYears: 5,
    match: QualitativeMatchEnum.STRONG,
    reason: "",
  },
  projects: {
    relevantProjects: [
      { name: "Project", relevance: ImportanceEnum.HIGH, matchedTechnologies: [], reason: "" },
    ],
    match: QualitativeMatchEnum.STRONG,
  },
  education: {
    required: "Bachelor's",
    candidateEducation: [{ degree: "Bachelor's", field: "CS" }],
    match: RequirementMatchEnum.STRONG,
    reason: "",
  },
  certifications: {
    required: ["AWS"],
    matched: [{ name: "AWS", relevance: ImportanceEnum.HIGH }],
    missing: [],
    match: RequirementMatchEnum.STRONG,
  },
});

const ZERO_MATCH = buildAiResult({
  skills: {
    matched: [],
    missing: [{ skill: "Kubernetes", importance: ImportanceEnum.HIGH, reason: "..." }],
  },
  experience: {
    requiredYears: 5,
    estimatedYears: 0,
    relevantYears: 0,
    match: QualitativeMatchEnum.NONE,
    reason: "",
  },
  projects: { relevantProjects: [], match: QualitativeMatchEnum.NONE },
  education: {
    required: "Bachelor's",
    candidateEducation: [],
    match: RequirementMatchEnum.NONE,
    reason: "",
  },
  certifications: {
    required: ["AWS"],
    matched: [],
    missing: [{ name: "AWS", importance: ImportanceEnum.HIGH }],
    match: RequirementMatchEnum.NONE,
  },
});

describe("calculateAtsScore", () => {
  it("returns 100 when every category is a full match", () => {
    const result = calculateAtsScore(FULL_MATCH);
    expect(result.atsScore).toBe(100);
    expect(result.scoreBreakdown).toEqual({
      skills: 40,
      experience: 25,
      projects: 15,
      education: 10,
      certifications: 10,
    });
  });

  it("returns 0 when every category has no match", () => {
    const result = calculateAtsScore(ZERO_MATCH);
    expect(result.atsScore).toBe(0);
    expect(result.scoreBreakdown).toEqual({
      skills: 0,
      experience: 0,
      projects: 0,
      education: 0,
      certifications: 0,
    });
  });

  it("calculates a partial skills match proportionally", () => {
    const result = calculateAtsScore(
      buildAiResult({
        skills: {
          matched: [
            { skill: "A", matchType: MatchTypeEnum.EXACT, evidence: "" },
            { skill: "B", matchType: MatchTypeEnum.EXACT, evidence: "" },
          ],
          missing: [{ skill: "C", importance: ImportanceEnum.MEDIUM, reason: "" }],
        },
      }),
    );
    // 2 of 3 relevant skills matched -> 2/3 * 40 = 26.67 -> rounds to 27
    expect(result.scoreBreakdown.skills).toBe(27);
  });

  it("does not penalize when the job description lists no relevant skills", () => {
    const result = calculateAtsScore(buildAiResult({ skills: { matched: [], missing: [] } }));
    expect(result.scoreBreakdown.skills).toBe(40);
  });

  it("caps experience credit at the required years -- more experience never scores above 100%", () => {
    const result = calculateAtsScore(
      buildAiResult({
        experience: {
          requiredYears: 3,
          estimatedYears: 12,
          relevantYears: 12,
          match: QualitativeMatchEnum.STRONG,
          reason: "",
        },
      }),
    );
    expect(result.scoreBreakdown.experience).toBe(25);
  });

  it("prorates experience below the required years", () => {
    const result = calculateAtsScore(
      buildAiResult({
        experience: {
          requiredYears: 5,
          estimatedYears: 3,
          relevantYears: 3,
          match: QualitativeMatchEnum.MODERATE,
          reason: "",
        },
      }),
    );
    // 3/5 * 25 = 15
    expect(result.scoreBreakdown.experience).toBe(15);
  });

  it("falls back to the qualitative match level when no required years are given", () => {
    const result = calculateAtsScore(
      buildAiResult({
        experience: {
          requiredYears: null,
          estimatedYears: null,
          relevantYears: null,
          match: QualitativeMatchEnum.MODERATE,
          reason: "",
        },
      }),
    );
    // moderate = 0.75 * 25 = 18.75 -> rounds to 19
    expect(result.scoreBreakdown.experience).toBe(19);
  });

  it("treats education as fully satisfied when not required", () => {
    const result = calculateAtsScore(
      buildAiResult({
        education: {
          required: "",
          candidateEducation: [],
          match: RequirementMatchEnum.NOT_REQUIRED,
          reason: "",
        },
      }),
    );
    expect(result.scoreBreakdown.education).toBe(10);
  });

  it("treats certifications as fully satisfied when not required", () => {
    const result = calculateAtsScore(
      buildAiResult({
        certifications: { required: [], matched: [], missing: [], match: RequirementMatchEnum.NOT_REQUIRED },
      }),
    );
    expect(result.scoreBreakdown.certifications).toBe(10);
  });

  it("keeps the final score within 0-100", () => {
    const result = calculateAtsScore(FULL_MATCH);
    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
  });

  it("is deterministic for identical input", () => {
    const first = calculateAtsScore(FULL_MATCH);
    const second = calculateAtsScore(FULL_MATCH);
    expect(first).toEqual(second);
  });
});
