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
  socialLinks?: { linkedin?: string; instagram?: string; twitter?: string };
  photoUrl?: string;
  isFavorite?: boolean;
  lastMet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  contactId: string;
  title: string;
  description: string;
  icon: "note" | "coffee" | "forward" | "gift" | "call";
  completed: boolean;
}

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Julian Thorne",
    company: "Atrium Ventures",
    position: "Managing Partner",
    isFavorite: true,
    lastMet: "2026-03-20T14:30:00Z",
    tags: ["networking", "work"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2026-03-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Elena Vance",
    company: "DesignLab",
    position: "Creative Director",
    isFavorite: true,
    lastMet: "2026-04-01T11:00:00Z",
    tags: ["networking"],
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2026-04-05T11:00:00Z",
  },
  {
    id: "3",
    name: "Marcus Webb",
    company: "Meridian Real Estate",
    position: "Agent",
    isFavorite: false,
    lastMet: "2026-03-10T16:00:00Z",
    tags: ["networking", "personal"],
    createdAt: "2024-03-01T16:00:00Z",
    updatedAt: "2026-03-25T09:15:00Z",
  },
  {
    id: "4",
    name: "Sarah Lin",
    company: "Arc Studio",
    position: "Architect",
    isFavorite: false,
    tags: ["work"],
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2026-02-14T17:00:00Z",
  },
  {
    id: "5",
    name: "David Okafor",
    company: "FreelanceHub",
    position: "Full Stack Developer",
    isFavorite: false,
    lastMet: "2026-02-20T12:00:00Z",
    tags: ["work", "networking"],
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "6",
    name: "Camila Ruiz",
    company: "Marketing360",
    position: "Head of Marketing",
    isFavorite: false,
    lastMet: "2026-03-15T15:00:00Z",
    tags: ["networking"],
    createdAt: "2024-02-28T15:00:00Z",
    updatedAt: "2026-03-30T08:00:00Z",
  },
];

export const mockFollowUps: FollowUp[] = [
  {
    id: "f1",
    contactId: "1",
    title: "Handwritten Note to Dr. Aris",
    description: "Congratulate on the recent publication",
    icon: "note",
    completed: false,
  },
  {
    id: "f2",
    contactId: "2",
    title: "Coffee with Founders Circle",
    description: "Monthly sync at The Atrium Café",
    icon: "coffee",
    completed: false,
  },
  {
    id: "f3",
    contactId: "4",
    title: "Forward Article to Sarah",
    description: "The piece on architectural lighting we discussed",
    icon: "forward",
    completed: false,
  },
];

export function getTimeAgo(dateStr?: string): string {
  if (!dateStr) return "Never";
  const now = typeof window !== "undefined" ? Date.now() : new Date("2026-04-13").getTime();
  const diff = now - new Date(dateStr).getTime();
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 1) return "This week";
  if (weeks === 1) return "1w ago";
  return `${weeks}w ago`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
