import type { ContactExtendedProfile } from "./contact-profile";

export type ContactStatus = "warm" | "follow-up-due" | "new" | "cold" | null;
export type ContactCategory = "all" | "business" | "personal" | "refer";
export type { ContactExtendedProfile };

export interface Contact {
  id: string;
  name: string;
  company?: string;
  position?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  interests?: string[];
  aspirations?: string;
  howWeMet?: string;
  sharedMemories?: string;
  tags?: string[];
  category?: ContactCategory;
  socialLinks?: { linkedin?: string; instagram?: string; twitter?: string };
  photoUrl?: string;
  isFavorite?: boolean;
  lastMet?: string;
  status?: ContactStatus;
  activity?: string;
  notes?: string;
  location?: string;
  referredBy?: string;
  extendedProfile?: ContactExtendedProfile;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthLogEntry {
  id: string;
  userId: string | null;
  action: string;
  createdAt: string;
}

export interface CreateContactInput {
  name: string;
  company?: string;
  position?: string;
  phone?: string;
  email?: string;
  category?: ContactCategory;
  howWeMet?: string;
  referredBy?: string;
  notes?: string;
  interests?: string[];
  aspirations?: string;
  location?: string;
  birthday?: string;
  status?: ContactStatus;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  isFavorite?: boolean;
  lastMet?: string;
  activity?: string;
  sharedMemories?: string;
  socialLinks?: Contact["socialLinks"];
  photoUrl?: string | null;
  extendedProfile?: ContactExtendedProfile;
}
