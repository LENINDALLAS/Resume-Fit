import type { Analysis } from "@prisma/client";
import type {
  AnalysisDto,
  AnalysisSummaryDto,
  AnalysisStatusEnum,
  CertificationsEvaluation,
  EducationEvaluation,
  ExperienceEvaluation,
  MatchedSkill,
  MissingSkill,
  ProjectsEvaluation,
  ScoreBreakdown,
} from "@resume-fit/shared";

export function toAnalysisDto(row: Analysis): AnalysisDto {
  return {
    id: row.id,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    atsScore: row.atsScore,
    atsVersion: row.atsVersion,
    summary: row.summary,
    skills: {
      matched: row.matchedSkills as unknown as MatchedSkill[],
      missing: row.missingSkills as unknown as MissingSkill[],
    },
    experience: row.experienceEvaluation as unknown as ExperienceEvaluation,
    projects: row.projectsEvaluation as unknown as ProjectsEvaluation,
    education: row.educationEvaluation as unknown as EducationEvaluation,
    certifications: row.certificationsEvaluation as unknown as CertificationsEvaluation,
    suggestions: row.suggestions as unknown as string[],
    strengths: row.strengths as unknown as string[],
    scoreBreakdown: row.scoreBreakdown as unknown as ScoreBreakdown,
    status: row.status as unknown as AnalysisStatusEnum,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toAnalysisSummaryDto(row: Analysis): AnalysisSummaryDto {
  return {
    id: row.id,
    atsScore: row.atsScore,
    atsVersion: row.atsVersion,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    status: row.status as unknown as AnalysisStatusEnum,
    createdAt: row.createdAt.toISOString(),
  };
}
