import { ErrorCode, type UserDto } from "@resume-fit/shared";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/errors.js";

export const userService = {
  async getCurrentUser(userId: string): Promise<UserDto> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(401, ErrorCode.UNAUTHORIZED, "Authentication required.");
    }

    return { id: user.id, name: user.name, email: user.email };
  },
};
