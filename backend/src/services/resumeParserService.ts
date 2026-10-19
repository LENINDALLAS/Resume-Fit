import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { ErrorCode } from "@resume-fit/shared";
import { AppError } from "../utils/errors.js";

export interface UploadedResumeFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

async function extractText(file: UploadedResumeFile): Promise<string> {
  try {
    if (file.mimetype === "application/pdf") {
      const result = await pdfParse(file.buffer);
      return result.text;
    }

    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  } catch {
    throw new AppError(422, ErrorCode.RESUME_PARSE_FAILED, "Unable to process the uploaded resume.");
  }
}

export const resumeParserService = {
  async parseResume(file: UploadedResumeFile): Promise<{ text: string }> {
    const text = await extractText(file);

    if (!text || text.trim().length === 0) {
      throw new AppError(422, ErrorCode.RESUME_PARSE_FAILED, "Unable to process the uploaded resume.");
    }

    return { text: text.trim() };
  },
};
