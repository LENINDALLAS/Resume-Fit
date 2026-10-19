/**
 * Gemini "controlled generation" response schema (a restricted subset of
 * OpenAPI 3.0 Schema Object). Passed as generationConfig.responseSchema so
 * Gemini's structured-output decoding enforces this exact shape -- this is
 * the primary defense against AI_RESPONSE_INVALID failures, on top of the
 * Zod validation that still runs afterward (never trust the network alone).
 *
 * Keep this in lockstep with shared/src/schemas/aiResponseSchemas.ts.
 */
export const GEMINI_ANALYSIS_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    skills: {
      type: "OBJECT",
      properties: {
        matched: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              skill: { type: "STRING" },
              matchType: { type: "STRING", enum: ["exact", "related"] },
              evidence: { type: "STRING" },
            },
            required: ["skill", "matchType", "evidence"],
          },
        },
        missing: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              skill: { type: "STRING" },
              importance: { type: "STRING", enum: ["high", "medium", "low"] },
              reason: { type: "STRING" },
            },
            required: ["skill", "importance", "reason"],
          },
        },
      },
      required: ["matched", "missing"],
    },
    experience: {
      type: "OBJECT",
      properties: {
        requiredYears: { type: "NUMBER", nullable: true },
        estimatedYears: { type: "NUMBER", nullable: true },
        relevantYears: { type: "NUMBER", nullable: true },
        match: { type: "STRING", enum: ["strong", "moderate", "weak", "none"] },
        reason: { type: "STRING" },
      },
      required: ["requiredYears", "estimatedYears", "relevantYears", "match", "reason"],
    },
    projects: {
      type: "OBJECT",
      properties: {
        relevantProjects: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              relevance: { type: "STRING", enum: ["high", "medium", "low"] },
              matchedTechnologies: { type: "ARRAY", items: { type: "STRING" } },
              reason: { type: "STRING" },
            },
            required: ["name", "relevance", "matchedTechnologies", "reason"],
          },
        },
        match: { type: "STRING", enum: ["strong", "moderate", "weak", "none"] },
      },
      required: ["relevantProjects", "match"],
    },
    education: {
      type: "OBJECT",
      properties: {
        required: { type: "STRING" },
        candidateEducation: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              degree: { type: "STRING" },
              field: { type: "STRING" },
            },
            required: ["degree", "field"],
          },
        },
        match: { type: "STRING", enum: ["strong", "moderate", "weak", "none", "not_required"] },
        reason: { type: "STRING" },
      },
      required: ["required", "candidateEducation", "match", "reason"],
    },
    certifications: {
      type: "OBJECT",
      properties: {
        required: { type: "ARRAY", items: { type: "STRING" } },
        matched: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              relevance: { type: "STRING", enum: ["high", "medium", "low"] },
            },
            required: ["name", "relevance"],
          },
        },
        missing: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              importance: { type: "STRING", enum: ["high", "medium", "low"] },
            },
            required: ["name", "importance"],
          },
        },
        match: { type: "STRING", enum: ["strong", "moderate", "weak", "none", "not_required"] },
      },
      required: ["required", "matched", "missing", "match"],
    },
    suggestions: { type: "ARRAY", items: { type: "STRING" } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["skills", "experience", "projects", "education", "certifications", "suggestions", "strengths"],
} as const;
