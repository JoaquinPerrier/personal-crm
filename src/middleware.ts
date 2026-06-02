import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/session";

const PROTECTED_PREFIXES = ["/dashboard", "/contacts", "/reminders", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = !!session;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Don't redirect away from login based on JWT alone — the token may be
  // valid but the user may no longer exist in the DB (e.g. after a DB migration).
  // The login page handles redirect client-side once /api/auth/me confirms the session.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/reminders/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
