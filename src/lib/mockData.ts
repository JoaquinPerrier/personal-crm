export type ContactStatus = "warm" | "follow-up-due" | "new" | "cold" | null;
export type ContactCategory = "all" | "business" | "personal" | "refer";

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
    name: "Marcus Thorne",
    company: "New Venture",
    position: "Founder",
    isFavorite: true,
    lastMet: "2026-03-30T14:30:00Z",
    tags: ["networking", "work"],
    category: "business",
    status: "warm",
    activity: "Last met 2 weeks ago",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2026-03-30T14:30:00Z",
  },
  {
    id: "2",
    name: "Sophia Chen",
    company: "Studio A",
    position: "Design Director",
    isFavorite: true,
    lastMet: "2026-04-01T11:00:00Z",
    tags: ["networking"],
    category: "business",
    status: "follow-up-due",
    activity: "Scheduled for tomorrow",
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2026-04-05T11:00:00Z",
  },
  {
    id: "3",
    name: "Julian Voss",
    company: "Form & Space",
    position: "Architect",
    isFavorite: false,
    lastMet: "2026-04-10T16:00:00Z",
    tags: ["networking", "personal"],
    category: "business",
    status: "new",
    activity: "Sent welcome note 3 days ago",
    createdAt: "2026-04-10T16:00:00Z",
    updatedAt: "2026-04-10T16:00:00Z",
  },
  {
    id: "4",
    name: "Elena Moretti",
    company: "National Gallery",
    position: "Curator",
    isFavorite: false,
    lastMet: "2026-03-10T08:00:00Z",
    tags: ["personal"],
    category: "personal",
    status: "warm",
    activity: "Coffee meeting last month",
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2026-03-10T17:00:00Z",
  },
  {
    id: "5",
    name: "David Okafor",
    company: "FreelanceHub",
    position: "Full Stack Developer",
    isFavorite: false,
    lastMet: "2026-02-20T12:00:00Z",
    tags: ["work", "networking"],
    category: "refer",
    status: "cold",
    activity: "Last contact 2 months ago",
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
    category: "business",
    status: "warm",
    activity: "Lunch 3 weeks ago",
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
