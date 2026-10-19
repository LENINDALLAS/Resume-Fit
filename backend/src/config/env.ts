import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),

  ACCESS_TOKEN_SECRET: z.string().min(1, "ACCESS_TOKEN_SECRET is required"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),

  // NOT z.coerce.boolean() -- that just runs JS's Boolean(value), and any
  // non-empty string (including the literal string "false") is truthy.
  GEMINI_MOCK_MODE: z
    .string()
    .default("false")
    .transform((value) => value.trim().toLowerCase() === "true"),

  DASHBOARD_ORIGIN: z.string().min(1, "DASHBOARD_ORIGIN is required"),
  EXTENSION_ORIGIN: z.string().min(1, "EXTENSION_ORIGIN is required")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error(
    "Application failed to start due to invalid environment configuration."
  );
}

export const env = parsed.data;
