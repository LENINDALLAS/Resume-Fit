import { Router } from "express";
import { analysisController } from "../controllers/analysisController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuthMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";
import { analysisRateLimiter } from "../middleware/rateLimiter.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { analysisIdParamSchema, analysisQuerySchema, createAnalysisSchema } from "../validators/analysisValidators.js";

export const analysisRoutes = Router();

// Anonymous callers may create an analysis (extension flow before login);
// if a valid access token is present, the analysis is owned immediately.
analysisRoutes.post(
  "/",
  optionalAuthMiddleware,
  analysisRateLimiter,
  uploadResume,
  validate(createAnalysisSchema),
  asyncHandler(analysisController.createAnalysis),
);

analysisRoutes.post(
  "/:analysisId/claim",
  authMiddleware,
  validate(analysisIdParamSchema, "params"),
  asyncHandler(analysisController.claimAnalysis),
);

analysisRoutes.get(
  "/",
  authMiddleware,
  validate(analysisQuerySchema, "query"),
  asyncHandler(analysisController.listAnalyses),
);

analysisRoutes.get(
  "/:analysisId",
  authMiddleware,
  validate(analysisIdParamSchema, "params"),
  asyncHandler(analysisController.getAnalysis),
);

analysisRoutes.delete(
  "/:analysisId",
  authMiddleware,
  validate(analysisIdParamSchema, "params"),
  asyncHandler(analysisController.deleteAnalysis),
);
