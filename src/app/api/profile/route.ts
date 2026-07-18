import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { updateUserProfile, findUserById } from "@/lib/db";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";
import type { UpdateUserProfileInput, UserSocialLinks } from "@/lib/types";

export const runtime = "nodejs";

const SOCIAL_KEYS = ["linkedin", "instagram", "facebook", "whatsapp"] as const;
const MAX_TEXT_LENGTH = 200;

function sanitizeText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, MAX_TEXT_LENGTH);
  return trimmed || undefined;
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const body = await request.json();
    const input: UpdateUserProfileInput = {};

    if ("headline" in body) {
      input.headline = sanitizeText(body.headline);
    }
    if ("location" in body) {
      input.location = sanitizeText(body.location);
    }
    if ("socialLinks" in body) {
      if (body.socialLinks == null || typeof body.socialLinks !== "object") {
        throw new ApiError(400, "socialLinks must be an object", "INVALID_FIELDS");
      }
      const socialLinks: UserSocialLinks = {};
      for (const key of SOCIAL_KEYS) {
        const value = sanitizeText(body.socialLinks[key]);
        if (value) socialLinks[key] = value;
      }
      input.socialLinks = socialLinks;
    }

    await updateUserProfile(user.id, input);
    const updated = await findUserById(user.id);

    return jsonOk({ user: updated });
  } catch (error) {
    return jsonError(error);
  }
}
