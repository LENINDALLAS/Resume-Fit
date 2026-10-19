import { z } from "zod";
import { ImportanceEnum, MatchTypeEnum, QualitativeMatchEnum, RequirementMatchEnum } from "../enums/index.js";

const matchedSkillSchema = z.object({
  skill: z.string().trim().min(1),
  matchType: z.nativeEnum(MatchTypeEnum),
  evidence: z.string().trim().min(1),
});

const missingSkillSchema = z.object({
  skill: z.string().trim().min(1),
  importance: z.nativeEnum(ImportanceEnum),
  reason: z.string().trim().min(1),
});

const skillsEvaluationSchema = z.object({
  matched: z.array(matchedSkillSchema).max(50),
  missing: z.array(missingSkillSchema).max(50),
});

const experienceEvaluationSchema = z.object({
  requiredYears: z.number().min(0).nullable(),
  estimatedYears: z.number().min(0).nullable(),
  relevantYears: z.number().min(0).nullable(),
  match: z.nativeEnum(QualitativeMatchEnum),
  reason: z.string().trim().min(1),
});

const relevantProjectSchema = z.object({
  name: z.string().trim().min(1),
  relevance: z.nativeEnum(ImportanceEnum),
  matchedTechnologies: z.array(z.string().trim().min(1)).max(50),
  reason: z.string().trim().min(1),
});

const projectsEvaluationSchema = z.object({
  relevantProjects: z.array(relevantProjectSchema).max(20),
  match: z.nativeEnum(QualitativeMatchEnum),
});

const candidateEducationSchema = z.object({
  degree: z.string().trim().min(1),
  field: z.string().trim().min(1),
});

const educationEvaluationSchema = z.object({
  required: z.string().trim(),
  candidateEducation: z.array(candidateEducationSchema).max(10),
  match: z.nativeEnum(RequirementMatchEnum),
  reason: z.string().trim().min(1),
});

const matchedCertificationSchema = z.object({
  name: z.string().trim().min(1),
  relevance: z.nativeEnum(ImportanceEnum),
});

const missingCertificationSchema = z.object({
  name: z.string().trim().min(1),
  importance: z.nativeEnum(ImportanceEnum),
});

const certificationsEvaluationSchema = z.object({
  required: z.array(z.string().trim().min(1)).max(20),
  matched: z.array(matchedCertificationSchema).max(20),
  missing: z.array(missingCertificationSchema).max(20),
  match: z.nativeEnum(RequirementMatchEnum),
});

/**
 * The complete Gemini structured-output contract. `.strict()` on the root
 * object intentionally rejects any extra field (e.g. a smuggled `atsScore`) —
 * the AI must never be allowed to supply a final score.
 */
export const aiAnalysisResponseSchema = z
  .object({
    skills: skillsEvaluationSchema,
    experience: experienceEvaluationSchema,
    projects: projectsEvaluationSchema,
    education: educationEvaluationSchema,
    certifications: certificationsEvaluationSchema,
    suggestions: z.array(z.string().trim().min(1)).max(20),
    strengths: z.array(z.string().trim().min(1)).max(20),
  })
  .strict();

export type AiAnalysisResponseInput = z.infer<typeof aiAnalysisResponseSchema>;
