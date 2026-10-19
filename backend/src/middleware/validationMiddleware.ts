import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationSource = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: ValidationSource = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[source]);
    (req as Record<ValidationSource, unknown>)[source] = parsed;
    next();
  };
}
