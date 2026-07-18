import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { getContactsByUser, createContact } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";
import type { Contact, ContactCategory } from "@/lib/types";

const SOCIAL_KEYS = ["linkedin", "instagram", "facebook", "whatsapp", "twitter"] as const;

function sanitizeSocialLinks(input: unknown): Contact["socialLinks"] | undefined {
  if (input == null || typeof input !== "object") return undefined;
  const links: NonNullable<Contact["socialLinks"]> = {};
  for (const key of SOCIAL_KEYS) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      links[key] = value.trim().slice(0, 200);
    }
  }
  return Object.keys(links).length > 0 ? links : undefined;
}

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }
    const contacts = await getContactsByUser(user.id);
    return jsonOk({ contacts });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const body = await request.json();
    const { name, company, position, phone, email, category, howWeMet, referredBy, notes, interests, aspirations, location, birthday } = body;

    if (!name?.trim()) {
      throw new ApiError(400, "Name is required", "NAME_REQUIRED");
    }

    const validCategories: ContactCategory[] = ["business", "personal", "refer"];
    const contact = await createContact(user.id, randomUUID(), {
      name: name.trim(),
      company: company?.trim() || undefined,
      position: position?.trim() || undefined,
      phone: phone?.trim() || undefined,
      email: email?.trim() || undefined,
      category: validCategories.includes(category) ? category : undefined,
      howWeMet: howWeMet?.trim() || undefined,
      referredBy: referredBy?.trim() || undefined,
      notes: notes?.trim() || undefined,
      interests: Array.isArray(interests) ? interests : undefined,
      aspirations: aspirations?.trim() || undefined,
      location: location?.trim() || undefined,
      birthday: birthday?.trim() || undefined,
      socialLinks: sanitizeSocialLinks(body.socialLinks),
      status: "new",
    });

    return jsonOk({ contact }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
