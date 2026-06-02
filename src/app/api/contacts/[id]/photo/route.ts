import { NextRequest, NextResponse } from "next/server";
import {
  getContactById,
  updateContact,
  saveContactPhotoData,
  getContactPhotoData,
  clearContactPhotoData,
} from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";
import { contactPhotoUrl, MAX_PHOTO_SIZE, ALLOWED_PHOTO_TYPES } from "@/lib/photo-utils";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const ALLOWED_TYPES = new Set<string>(ALLOWED_PHOTO_TYPES);

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const contact = await getContactById(user.id, id);
    if (!contact || !contact.photoUrl) {
      throw new ApiError(404, "Photo not found", "NOT_FOUND");
    }

    const photo = await getContactPhotoData(user.id, id);
    if (!photo) {
      throw new ApiError(404, "Photo not found", "NOT_FOUND");
    }

    return new NextResponse(new Uint8Array(photo.data), {
      headers: {
        "Content-Type": photo.mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const existing = await getContactById(user.id, id);
    if (!existing) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!file || !(file instanceof File)) {
      throw new ApiError(400, "Photo file is required", "FILE_REQUIRED");
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new ApiError(
        400,
        "Only JPEG, PNG, WebP or GIF images are allowed",
        "INVALID_TYPE"
      );
    }

    if (file.size > MAX_PHOTO_SIZE) {
      throw new ApiError(400, "Image must be smaller than 5 MB", "FILE_TOO_LARGE");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await saveContactPhotoData(user.id, id, buffer, file.type);

    const contact = await updateContact(user.id, id, {
      photoUrl: contactPhotoUrl(id),
    });
    if (!contact) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    return jsonOk({ contact });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const existing = await getContactById(user.id, id);
    if (!existing) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    await clearContactPhotoData(user.id, id);
    const contact = await updateContact(user.id, id, { photoUrl: null });
    if (!contact) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    return jsonOk({ contact });
  } catch (error) {
    return jsonError(error);
  }
}
