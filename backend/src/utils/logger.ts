import fs from "node:fs";
import path from "node:path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

function ensureLogDir(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function write(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>): void {
  // `message` is spread last so a `meta.message` (e.g. an upstream error's own
  // message) can never silently overwrite the caller's actual log message.
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...meta,
    message,
  };
  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }

  try {
    ensureLogDir();
    fs.appendFileSync(LOG_FILE, `${line}\n`);
  } catch {
    // Never let logging failures crash the request pipeline.
  }
}

/**
 * Never pass passwords, tokens, secrets, resume text, or job description
 * content into `meta` -- only safe identifiers (requestId, userId, analysisId,
 * route, status, duration, error code).
 */
export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => write("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => write("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),
};
