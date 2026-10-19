import path from "node:path";
import multer from "multer";
import { ALLOWED_RESUME_EXTENSIONS, ALLOWED_RESUME_MIME_TYPES, ErrorCode, VALIDATION_LIMITS } from "@resume-fit/shared";
import { AppError } from "../utils/errors.js";

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: { fileSize: VALIDATION_LIMITS.maxResumeFileSizeBytes },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedExtension = (ALLOWED_RESUME_EXTENSIONS as readonly string[]).includes(extension);
    const isAllowedMimeType = (ALLOWED_RESUME_MIME_TYPES as readonly string[]).includes(file.mimetype);

    if (!isAllowedExtension || !isAllowedMimeType) {
      callback(new AppError(400, ErrorCode.INVALID_FILE_TYPE, "Please upload a PDF or DOCX file."));
      return;
    }

    callback(null, true);
  },
}).single("resume");
