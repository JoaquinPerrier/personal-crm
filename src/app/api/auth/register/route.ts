import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  createUser,
  findUserByEmail,
  logAuthAction,
} from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  setSessionCookie,
  getClientInfo,
} from "@/lib/auth";
import {
  ApiError,
  jsonOk,
  jsonError,
  validateEmail,
  validatePassword,
} from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name?.trim()) {
      throw new ApiError(400, "Name is required", "NAME_REQUIRED");
    }
    if (!email?.trim() || !validateEmail(email)) {
      throw new ApiError(400, "Valid email is required", "INVALID_EMAIL");
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      throw new ApiError(400, passwordError, "WEAK_PASSWORD");
    }

    if (await findUserByEmail(email)) {
      throw new ApiError(409, "Email already registered", "EMAIL_EXISTS");
    }

    const userId = randomUUID();
    const passwordHash = await hashPassword(password);
    const user = await createUser(userId, name.trim(), email.trim(), passwordHash);

    const { ip, userAgent } = getClientInfo(request);
    await logAuthAction(randomUUID(), userId, "register", ip ?? undefined, userAgent ?? undefined);

    const token = await createSessionToken(userId);
    await setSessionCookie(token);

    return jsonOk({ user }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
