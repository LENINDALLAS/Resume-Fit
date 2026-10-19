import {
  ATS_SCORE_VERSION,
  ErrorCode,
  getScoreInterpretation,
  PAGINATION_DEFAULTS,
  aiAnalysisResponseSchema,
  type AnalysisAiResult,
  type AnalysisDto,
  type AnalysisSummaryDto,
  type PaginationMeta,
} from "@resume-fit/shared";
import { resumeParserService, type UploadedResumeFile } from "./resumeParserService.js";
import { geminiService } from "./geminiService.js";
import { buildResumeAnalysisSystemInstruction, buildResumeAnalysisUserContent } from "../prompts/index.js";
import { calculateAtsScore } from "../scoring/atsScoringService.js";
import { analysisRepository } from "../repositories/analysisRepository.js";
import { toAnalysisDto, toAnalysisSummaryDto } from "./analysisMapper.js";
import { AppError } from "../utils/errors.js";

function parseGeminiJson(rawText: string): unknown {
  const cleaned = rawText.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AppError(422, ErrorCode.AI_RESPONSE_INVALID, "Unable to analyze this resume right now.");
  }
}

function validateAiResult(rawJson: unknown): AnalysisAiResult {
  const parsed = aiAnalysisResponseSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new AppError(422, ErrorCode.AI_RESPONSE_INVALID, "Unable to analyze this resume right now.");
  }
  return parsed.data as AnalysisAiResult;
}

function buildSummary(atsScore: number, aiResult: AnalysisAiResult): string {
  const interpretation = getScoreInterpretation(atsScore);
  const matchedCount = aiResult.skills.matched.length;
  const totalRelevant = matchedCount + aiResult.skills.missing.length;
  return `${interpretation} (${atsScore}/100) — ${matchedCount} of ${totalRelevant} relevant skills matched.`;
}

export const analysisService = {
  async createAnalysis(
    userId: string | null,
    jobDescription: string,
    file: UploadedResumeFile,
    requestId?: string,
  ): Promise<AnalysisDto> {
    const { text: resumeText } = await resumeParserService.parseResume(file);

    const rawResponse = await geminiService.generate(
      {
        systemInstruction: buildResumeAnalysisSystemInstruction(),
        userContent: buildResumeAnalysisUserContent({ resumeText, jobDescription }),
      },
      requestId,
    );

    const rawJson = parseGeminiJson(rawResponse);
    const aiResult = validateAiResult(rawJson);

    const { atsScore, scoreBreakdown } = calculateAtsScore(aiResult);
    const summary = buildSummary(atsScore, aiResult);

    let created;
    try {
      created = await analysisRepository.create({
        userId,
        jobTitle: null,
        companyName: null,
        atsScore,
        atsVersion: ATS_SCORE_VERSION,
        summary,
        matchedSkills: aiResult.skills.matched,
        missingSkills: aiResult.skills.missing,
        experienceEvaluation: aiResult.experience,
        educationEvaluation: aiResult.education,
        projectsEvaluation: aiResult.projects,
        certificationsEvaluation: aiResult.certifications,
        suggestions: aiResult.suggestions,
        strengths: aiResult.strengths,
        scoreBreakdown,
      });
    } catch {
      throw new AppError(500, ErrorCode.ANALYSIS_SAVE_FAILED, "Unable to save this analysis. Please try again.");
    }

    return toAnalysisDto(created);
  },

  async getAnalysis(analysisId: string, userId: string): Promise<AnalysisDto> {
    const row = await analysisRepository.findByIdAndUserId(analysisId, userId);
    if (!row) {
      throw new AppError(404, ErrorCode.ANALYSIS_NOT_FOUND, "Analysis not found.");
    }
    return toAnalysisDto(row);
  },

  async listAnalyses(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ analyses: AnalysisSummaryDto[]; pagination: PaginationMeta }> {
    const safePage = page || PAGINATION_DEFAULTS.page;
    const safeLimit = limit || PAGINATION_DEFAULTS.limit;
    const skip = (safePage - 1) * safeLimit;

    const [rows, totalItems] = await Promise.all([
      analysisRepository.findManyByUserId(userId, skip, safeLimit),
      analysisRepository.countByUserId(userId),
    ]);

    return {
      analyses: rows.map(toAnalysisSummaryDto),
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalItems,
        totalPages: Math.ceil(totalItems / safeLimit) || 0,
      },
    };
  },

  async deleteAnalysis(analysisId: string, userId: string): Promise<void> {
    const deleted = await analysisRepository.deleteByIdAndUserId(analysisId, userId);
    if (!deleted) {
      throw new AppError(404, ErrorCode.ANALYSIS_NOT_FOUND, "Analysis not found.");
    }
  },

  /**
   * Attaches the authenticated user as the owner of an anonymously-created
   * analysis (the extension's "log in to view full details" flow). Never
   * lets a second user claim an analysis someone else already owns.
   */
  async claimAnalysis(analysisId: string, userId: string): Promise<AnalysisDto> {
    const row = await analysisRepository.claimById(analysisId, userId);
    if (!row) {
      throw new AppError(404, ErrorCode.ANALYSIS_NOT_FOUND, "Analysis not found.");
    }
    return toAnalysisDto(row);
  },
};
