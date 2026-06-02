import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getContactById, updateContact } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";
import {
  saveContactPhoto,
  deleteContactPhoto,
  getContactPhotoPath,
  contactPhotoUrl,
  MAX_PHOTO_SIZE,
  ALLOWED_TYPES,
} from "@/lib/uploads";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const contact = getContactById(user.id, id);
    if (!contact || !contact.photoUrl) {
      throw new ApiError(404, "Photo not found", "NOT_FOUND");
    }

    const filePath = getContactPhotoPath(user.id, id);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new ApiError(404, "Photo not found", "NOT_FOUND");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "image/jpeg";
    const buffer = fs.readFileSync(filePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
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
    const existing = getContactById(user.id, id);
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
    saveContactPhoto(user.id, id, buffer, file.type);

    const photoUrl = contactPhotoUrl(id);
    const contact = updateContact(user.id, id, { photoUrl });
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
    const existing = getContactById(user.id, id);
    if (!existing) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    deleteContactPhoto(user.id, id);
    const contact = updateContact(user.id, id, { photoUrl: null });
    if (!contact) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    return jsonOk({ contact });
  } catch (error) {
    return jsonError(error);
  }
}
