export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_TYPES)[number])) {
    return "Only JPEG, PNG, WebP or GIF images are allowed";
  }
  if (file.size > MAX_PHOTO_SIZE) {
    return "Image must be smaller than 5 MB";
  }
  return null;
}

export function contactPhotoUrl(contactId: string, updatedAt?: string) {
  const v = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  return `/api/contacts/${contactId}/photo?v=${v}`;
}
