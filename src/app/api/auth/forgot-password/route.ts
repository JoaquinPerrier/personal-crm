import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  findUserByEmail,
  createPasswordResetToken,
  logAuthAction,
} from "@/lib/db";
import { getClientInfo } from "@/lib/auth";
import { ApiError, jsonOk, jsonError, validateEmail } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email?.trim() || !validateEmail(email)) {
      throw new ApiError(400, "Valid email is required", "INVALID_EMAIL");
    }

    const user = findUserByEmail(email);
    const message =
      "If an account exists with that email, you will receive reset instructions.";

    if (user) {
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      createPasswordResetToken(randomUUID(), user.id, token, expiresAt);

      const { ip, userAgent } = getClientInfo(request);
      logAuthAction(
        randomUUID(),
        user.id,
        "password_reset_request",
        ip ?? undefined,
        userAgent ?? undefined
      );

      // In development, return the reset URL for testing (no email service configured)
      if (process.env.NODE_ENV === "development") {
        const origin = request.headers.get("origin") || "http://localhost:3000";
        return jsonOk({
          message,
          resetUrl: `${origin}/reset-password?token=${token}`,
        });
      }
    }

    return jsonOk({ message });
  } catch (error) {
    return jsonError(error);
  }
}
