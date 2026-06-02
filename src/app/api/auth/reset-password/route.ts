import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  findValidResetToken,
  markResetTokenUsed,
  updateUserPassword,
  logAuthAction,
} from "@/lib/db";
import { hashPassword, getClientInfo } from "@/lib/auth";
import {
  ApiError,
  jsonOk,
  jsonError,
  validatePassword,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      throw new ApiError(400, "Reset token is required", "TOKEN_REQUIRED");
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new ApiError(400, passwordError, "WEAK_PASSWORD");
    }

    const resetToken = await findValidResetToken(token);
    if (!resetToken) {
      throw new ApiError(400, "Invalid or expired reset token", "INVALID_TOKEN");
    }

    const passwordHash = await hashPassword(password);
    await updateUserPassword(resetToken.user_id, passwordHash);
    await markResetTokenUsed(resetToken.id);

    const { ip, userAgent } = getClientInfo(request);
    await logAuthAction(
      randomUUID(),
      resetToken.user_id,
      "password_reset",
      ip ?? undefined,
      userAgent ?? undefined
    );

    return jsonOk({ message: "Password updated successfully" });
  } catch (error) {
    return jsonError(error);
  }
}
