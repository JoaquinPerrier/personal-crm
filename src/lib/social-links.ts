import type { UserSocialLinks } from "./types";

export function hasSocialLinks(links?: UserSocialLinks): boolean {
  if (!links) return false;
  return Object.values(links).some((v) => typeof v === "string" && v.trim() !== "");
}
