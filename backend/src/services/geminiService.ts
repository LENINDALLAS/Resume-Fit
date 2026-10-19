import { ErrorCode } from "@resume-fit/shared";
import { env } from "../config/env.js";
import { callGemini, type CallGeminiInput } from "../lib/gemini.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { GEMINI_MOCK_RESPONSE_TEXT } from "./geminiMockResponse.js";

export const geminiService = {
  /** Calls Gemini with a prepared prompt and returns the raw response text. No retries. */
  async generate(input: CallGeminiInput, requestId?: string): Promise<string> {
    if (env.GEMINI_MOCK_MODE) {
      logger.warn("GEMINI_MOCK_MODE is enabled -- returning a static response instead of calling Gemini.", {
        requestId,
      });
      return GEMINI_MOCK_RESPONSE_TEXT;
    }

    try {
      return await callGemini(input);
    } catch (error) {
      logger.error("Gemini request failed", {
        requestId,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(502, ErrorCode.AI_ANALYSIS_FAILED, "Unable to analyze this resume right now.");
    }
  },
};
