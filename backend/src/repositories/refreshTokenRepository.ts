import type { RefreshToken } from "@prisma/client";
import { MAX_REFRESH_TOKENS_PER_USER } from "@resume-fit/shared";
import { prisma } from "../lib/prisma.js";

export const refreshTokenRepository = {
  /**
   * Creates a new refresh token and enforces the maximum of five active
   * tokens per user, removing the oldest excess tokens, all within one
   * transaction.
   */
  async createWithLimit(userId: string, tokenHash: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.$transaction(async (tx) => {
      const created = await tx.refreshToken.create({ data: { userId, tokenHash, expiresAt } });

      const tokens = await tx.refreshToken.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      const excess = tokens.slice(MAX_REFRESH_TOKENS_PER_USER);
      if (excess.length > 0) {
        await tx.refreshToken.deleteMany({ where: { id: { in: excess.map((t) => t.id) } } });
      }

      return created;
    });
  },

  findValidByHash(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, expiresAt: { gt: new Date() } },
    });
  },

  deleteByHash(tokenHash: string): Promise<void> {
    return prisma.refreshToken
      .deleteMany({ where: { tokenHash } })
      .then(() => undefined);
  },
};
