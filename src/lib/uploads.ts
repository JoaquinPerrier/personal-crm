import fs from "fs";
import path from "path";
import {
  MAX_PHOTO_SIZE,
  ALLOWED_PHOTO_TYPES,
  contactPhotoUrl,
} from "./photo-utils";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const ALLOWED_TYPES = new Set<string>(ALLOWED_PHOTO_TYPES);

function contactPhotoDir(userId: string, contactId: string) {
  return path.join(UPLOADS_DIR, userId, contactId);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getContactPhotoPath(
  userId: string,
  contactId: string
): string | null {
  const dir = contactPhotoDir(userId, contactId);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.startsWith("photo"));
  if (files.length === 0) return null;

  return path.join(dir, files[0]);
}

export function saveContactPhoto(
  userId: string,
  contactId: string,
  buffer: Buffer,
  mimeType: string
): string {
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("Invalid image type");
  }

  const ext = EXT_BY_TYPE[mimeType] ?? ".jpg";
  const dir = contactPhotoDir(userId, contactId);
  ensureDir(dir);

  deleteContactPhoto(userId, contactId);

  const filename = `photo${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export function deleteContactPhoto(userId: string, contactId: string) {
  const dir = contactPhotoDir(userId, contactId);
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    fs.unlinkSync(path.join(dir, file));
  }
}

export { MAX_PHOTO_SIZE, ALLOWED_TYPES, contactPhotoUrl };
