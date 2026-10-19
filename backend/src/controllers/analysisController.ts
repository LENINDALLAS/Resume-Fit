import type { Request, Response } from "express";
import { ErrorCode, type AnalysisQueryInput, type CreateAnalysisInput } from "@resume-fit/shared";
import { analysisService } from "../services/analysisService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { AppError } from "../utils/errors.js";

export const analysisController = {
  async createAnalysis(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new AppError(400, ErrorCode.RESUME_REQUIRED, "Resume is required.");
    }

    const { jobDescription } = req.body as CreateAnalysisInput;
    const analysis = await analysisService.createAnalysis(
      req.user?.id ?? null,
      jobDescription,
      req.file,
      req.requestId,
    );

    sendSuccess(res, { analysis }, 201);
  },

  async claimAnalysis(req: Request, res: Response): Promise<void> {
    const { analysisId } = req.params as { analysisId: string };
    const analysis = await analysisService.claimAnalysis(analysisId, req.user!.id);
    sendSuccess(res, { analysis });
  },

  async getAnalysis(req: Request, res: Response): Promise<void> {
    const { analysisId } = req.params as { analysisId: string };
    const analysis = await analysisService.getAnalysis(analysisId, req.user!.id);
    sendSuccess(res, { analysis });
  },

  async listAnalyses(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query as unknown as AnalysisQueryInput;
    const result = await analysisService.listAnalyses(req.user!.id, page, limit);
    sendSuccess(res, result);
  },

  async deleteAnalysis(req: Request, res: Response): Promise<void> {
    const { analysisId } = req.params as { analysisId: string };
    await analysisService.deleteAnalysis(analysisId, req.user!.id);
    sendSuccess(res, { message: "Analysis deleted successfully." });
  },
};
