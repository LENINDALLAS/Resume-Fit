import type { UserDto } from "@resume-fit/shared";
import { authService } from "./authService";

export const dashboardService = {
  /** Processes an extension handoff access token, if present. Never handles the refresh token. */
  async processExtensionHandoff(token: string | null): Promise<UserDto | null> {
    if (!token) return null;
    return authService.authenticateWithHandoffToken(token);
  },
};
