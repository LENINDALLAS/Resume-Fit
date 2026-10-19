import type { User } from "@prisma/client";
import { ErrorCode, type UserDto } from "@resume-fit/shared";
import { userRepository } from "../repositories/userRepository.js";
import { refreshTokenRepository } from "../repositories/refreshTokenRepository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashToken } from "../utils/hashToken.js";
import { AppError } from "../utils/errors.js";
import { JWT_CONFIG } from "../config/constants.js";

function toUserDto(user: User): UserDto {
  return { id: user.id, name: user.name, email: user.email };
}

async function issueTokensForUser(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  const expiresAt = new Date(Date.now() + JWT_CONFIG.refreshTokenExpiresInMs);
  await refreshTokenRepository.createWithLimit(userId, hashToken(refreshToken), expiresAt);

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: { name: string; email: string; password: string }): Promise<UserDto> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, ErrorCode.EMAIL_ALREADY_EXISTS, "An account with this email already exists.");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({ name: input.name, email: input.email, passwordHash });

    return toUserDto(user);
  },

  async login(
    input: { email: string; password: string },
  ): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
    const user = await userRepository.findByEmail(input.email);
    const isValid = user ? await comparePassword(input.password, user.passwordHash) : false;

    if (!user || !isValid) {
      throw new AppError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid email or password.");
    }

    const tokens = await issueTokensForUser(user.id);
    return { user: toUserDto(user), ...tokens };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = verifyRefreshToken(refreshToken);

    const stored = await refreshTokenRepository.findValidByHash(hashToken(refreshToken));
    if (!stored) {
      throw new AppError(401, ErrorCode.INVALID_REFRESH_TOKEN, "Session expired. Please log in again.");
    }

    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError(401, ErrorCode.INVALID_REFRESH_TOKEN, "Session expired. Please log in again.");
    }

    return { accessToken: signAccessToken(user.id) };
  },

  async logout(refreshToken: string): Promise<void> {
    await refreshTokenRepository.deleteByHash(hashToken(refreshToken));
  },
};
