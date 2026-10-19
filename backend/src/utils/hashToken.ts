import { createHash } from "node:crypto";

/**
 * Refresh tokens already carry high entropy (signed JWTs), so a deterministic
 * hash is used -- unlike passwords, we need exact-match lookups by tokenHash.
 */
export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
