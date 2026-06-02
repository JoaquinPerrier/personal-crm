import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { findUserById } from "./db";
import type { User } from "./types";
import {
  createSessionToken,
  verifySessionToken,
  COOKIE_NAME,
} from "./session";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) {
    await clearSessionCookie();
    return null;
  }

  const user = await findUserById(session.userId);
  if (!user) {
    await clearSessionCookie();
    return null;
  }

  return user;
}

export async function getSessionFromRequest(
  request: NextRequest
): Promise<User | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await findUserById(session.userId);
  if (!user) return null;

  return user;
}

export function getClientInfo(request: NextRequest) {
  return {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent") ?? null,
  };
}

export { createSessionToken, COOKIE_NAME };
