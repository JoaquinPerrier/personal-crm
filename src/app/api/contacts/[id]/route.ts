import { NextRequest } from "next/server";
import {
  getContactById,
  updateContact,
  deleteContact,
} from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { ApiError, jsonOk, jsonError } from "@/lib/api-helpers";
import type { ContactCategory } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const contact = await getContactById(user.id, id);
    if (!contact) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    return jsonOk({ contact });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      throw new ApiError(401, "Not authenticated", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const body = await request.json();

    const validCategories: ContactCategory[] = ["business", "personal", "refer"];
    const updateData = {
      ...body,
      name: body.name?.trim(),
      company: body.company?.trim() || undefined,
      position: body.position?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      email: body.email?.trim() || undefined,
      howWeMet: body.howWeMet?.trim() || undefined,
      referredBy: body.referredBy?.trim() || undefined,
      notes: body.notes?.trim() || undefined,
      aspirations: body.aspirations?.trim() || undefined,
      sharedMemories: body.sharedMemories?.trim() || undefined,
      location: body.location?.trim() || undefined,
      birthday: body.birthday?.trim() || undefined,
      category: validCategories.includes(body.category) ? body.category : undefined,
    };

    const contact = await updateContact(user.id, id, updateData);
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
    const deleted = await deleteContact(user.id, id);
    if (!deleted) {
      throw new ApiError(404, "Contact not found", "NOT_FOUND");
    }

    return jsonOk({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
