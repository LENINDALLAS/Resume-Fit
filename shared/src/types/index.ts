import type {
  AnalysisStatusEnum,
  ImportanceEnum,
  MatchTypeEnum,
  QualitativeMatchEnum,
  RequirementMatchEnum,
  TokenTypeEnum,
} from "../enums/index.js";

export interface JwtPayload {
  sub: string;
  type: TokenTypeEnum;
  iat?: number;
  exp?: number;
}

export interface MatchedSkill {
  skill: string;
  matchType: MatchTypeEnum;
  evidence: string;
}

export interface MissingSkill {
  skill: string;
  importance: ImportanceEnum;
  reason: string;
}

export interface SkillsEvaluation {
  matched: MatchedSkill[];
  missing: MissingSkill[];
}

export interface ExperienceEvaluation {
  requiredYears: number | null;
  estimatedYears: number | null;
  relevantYears: number | null;
  match: QualitativeMatchEnum;
  reason: string;
}

export interface RelevantProject {
  name: string;
  relevance: ImportanceEnum;
  matchedTechnologies: string[];
  reason: string;
}

export interface ProjectsEvaluation {
  relevantProjects: RelevantProject[];
  match: QualitativeMatchEnum;
}

export interface CandidateEducation {
  degree: string;
  field: string;
}

export interface EducationEvaluation {
  required: string;
  candidateEducation: CandidateEducation[];
  match: RequirementMatchEnum;
  reason: string;
}

export interface MatchedCertification {
  name: string;
  relevance: ImportanceEnum;
}

export interface MissingCertification {
  name: string;
  importance: ImportanceEnum;
}

export interface CertificationsEvaluation {
  required: string[];
  matched: MatchedCertification[];
  missing: MissingCertification[];
  match: RequirementMatchEnum;
}

/** The validated, structured result returned by Gemini (never includes a score). */
export interface AnalysisAiResult {
  skills: SkillsEvaluation;
  experience: ExperienceEvaluation;
  projects: ProjectsEvaluation;
  education: EducationEvaluation;
  certifications: CertificationsEvaluation;
  suggestions: string[];
  strengths: string[];
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  projects: number;
  education: number;
  certifications: number;
}

export interface AtsScoreResult {
  atsScore: number;
  scoreBreakdown: ScoreBreakdown;
}

/** The complete analysis record as returned by the API. */
export interface AnalysisDto {
  id: string;
  jobTitle: string | null;
  companyName: string | null;
  atsScore: number;
  atsVersion: string;
  summary: string;
  skills: SkillsEvaluation;
  experience: ExperienceEvaluation;
  projects: ProjectsEvaluation;
  education: EducationEvaluation;
  certifications: CertificationsEvaluation;
  suggestions: string[];
  strengths: string[];
  scoreBreakdown: ScoreBreakdown;
  status: AnalysisStatusEnum;
  createdAt: string;
}

export interface AnalysisSummaryDto {
  id: string;
  atsScore: number;
  atsVersion: string;
  jobTitle: string | null;
  companyName: string | null;
  status: AnalysisStatusEnum;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}
