import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { logAuthAction } from "@/lib/db";
import { clearSessionCookie, getSessionFromRequest, getClientInfo } from "@/lib/auth";
import { jsonOk, jsonError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (user) {
      const { ip, userAgent } = getClientInfo(request);
      logAuthAction(randomUUID(), user.id, "logout", ip ?? undefined, userAgent ?? undefined);
    }
    await clearSessionCookie();
    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
