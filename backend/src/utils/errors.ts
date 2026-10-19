import type { ErrorCodeType } from "@resume-fit/shared";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodeType;
  public readonly fields?: Record<string, string>;

  constructor(statusCode: number, code: ErrorCodeType, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}
