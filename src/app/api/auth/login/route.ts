import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { findUserByEmail, logAuthAction } from "@/lib/db";
import {
  createSessionToken,
  verifyPassword,
  setSessionCookie,
  getClientInfo,
} from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required", "MISSING_FIELDS");
    }

    const user = findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const { ip, userAgent } = getClientInfo(request);
    logAuthAction(randomUUID(), user.id, "login", ip ?? undefined, userAgent ?? undefined);

    const token = await createSessionToken(user.id);
    await setSessionCookie(token);

    return jsonOk({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
