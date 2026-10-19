import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { ErrorCode } from "@resume-fit/shared";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

function flattenZodError(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fields[key]) {
      fields[key] = issue.message;
    }
  }
  return fields;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, ...(err.fields ? { fields: err.fields } : {}) },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Invalid request data.",
        fields: flattenZodError(err),
      },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        error: { code: ErrorCode.FILE_TOO_LARGE, message: "Resume file is too large." },
      });
      return;
    }

    res.status(400).json({
      success: false,
      error: { code: ErrorCode.INVALID_RESUME, message: "Unable to process the uploaded resume." },
    });
    return;
  }

  logger.error("Unhandled error", {
    requestId: req.requestId,
    route: req.originalUrl,
    method: req.method,
    errorMessage: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    success: false,
    error: { code: ErrorCode.INTERNAL_SERVER_ERROR, message: "Something went wrong." },
  });
}
