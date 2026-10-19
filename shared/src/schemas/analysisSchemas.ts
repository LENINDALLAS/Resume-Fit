import { z } from "zod";
import { PAGINATION_DEFAULTS, VALIDATION_LIMITS } from "../constants/validation.js";

export const jobDescriptionSchema = z
  .string()
  .trim()
  .min(VALIDATION_LIMITS.jobDescriptionMin, "Job description is too short to analyze.")
  .max(VALIDATION_LIMITS.jobDescriptionMax, "Job description is too long.");

export const createAnalysisSchema = z.object({
  jobDescription: jobDescriptionSchema,
});

export const analysisIdParamSchema = z.object({
  analysisId: z.string().uuid(),
});

export const analysisQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION_DEFAULTS.page),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION_DEFAULTS.maxLimit)
    .default(PAGINATION_DEFAULTS.limit),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
export type AnalysisQueryInput = z.infer<typeof analysisQuerySchema>;
