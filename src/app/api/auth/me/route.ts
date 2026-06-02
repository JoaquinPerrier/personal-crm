import { getSessionUser } from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }
    return jsonOk({ user });
  } catch (error) {
    return jsonError(error);
  }
}
