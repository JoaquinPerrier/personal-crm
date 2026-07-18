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
    const updateData = { ...body };
    const optionalTextFields = [
      "company",
      "position",
      "phone",
      "email",
      "howWeMet",
      "referredBy",
      "notes",
      "aspirations",
      "sharedMemories",
      "location",
      "birthday",
    ] as const;

    if ("name" in body) {
      updateData.name = body.name?.trim();
    }
    for (const field of optionalTextFields) {
      if (field in body) {
        updateData[field] = body[field]?.trim() || undefined;
      }
    }
    if ("category" in body) {
      updateData.category = validCategories.includes(body.category)
        ? body.category
        : undefined;
    }
    if ("lastMet" in body) {
      if (
        typeof body.lastMet !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.lastMet)
      ) {
        throw new ApiError(400, "Invalid last contact date", "INVALID_DATE");
      }
      updateData.lastMet = body.lastMet;
    }

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
