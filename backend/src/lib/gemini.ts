import axios from "axios";
import { env } from "../config/env.js";
import { GEMINI_CONFIG } from "../config/constants.js";
import { GEMINI_ANALYSIS_RESPONSE_SCHEMA } from "./geminiResponseSchema.js";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}

export interface CallGeminiInput {
  systemInstruction: string;
  userContent: string;
}

/** Isolated Gemini transport. Knows nothing about prompt wording, scoring, or persistence. */
export async function callGemini({ systemInstruction, userContent }: CallGeminiInput): Promise<string> {
  const response = await axios.post<GeminiGenerateContentResponse>(
    `${GEMINI_BASE_URL}/models/${GEMINI_CONFIG.model}:generateContent`,
    {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ parts: [{ text: userContent }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: GEMINI_ANALYSIS_RESPONSE_SCHEMA,
        temperature: GEMINI_CONFIG.temperature,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
        // This is bounded structured extraction, not open-ended reasoning --
        // extended thinking only adds latency here, so it's kept minimal.
        thinkingConfig: { thinkingLevel: GEMINI_CONFIG.thinkingLevel },
      },
    },
    {
      params: { key: env.GEMINI_API_KEY },
      timeout: GEMINI_CONFIG.timeoutMs,
    },
  );

  if (response.data.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the prompt: ${response.data.promptFeedback.blockReason}`);
  }

  const candidate = response.data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(`Gemini returned no content (finishReason: ${candidate?.finishReason ?? "unknown"}).`);
  }

  return text;
}
