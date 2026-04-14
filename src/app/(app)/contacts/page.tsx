"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";
import {
  mockContacts,
  getInitials,
  type Contact,
  type ContactCategory,
  type ContactStatus,
} from "@/lib/mockData";

const CATEGORIES: { key: ContactCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "business", label: "Business" },
  { key: "personal", label: "Personal" },
  { key: "refer", label: "Refer" },
];

const STATUS_STYLES: Record<
  NonNullable<ContactStatus>,
  { bg: string; text: string; label: string }
> = {
  warm: { bg: "bg-orange-100", text: "text-orange-600", label: "WARM" },
  "follow-up-due": {
    bg: "bg-red-100",
    text: "text-red-600",
    label: "FOLLOW-UP DUE",
  },
  new: { bg: "bg-blue-100", text: "text-blue-600", label: "NEW" },
  cold: { bg: "bg-gray-100", text: "text-gray-500", label: "COLD" },
};

const ACTIVITY_ICONS: Record<string, string> = {
  "Last met": "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  Scheduled:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
  Sent: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.25 5.438a2.6 2.6 0 0 1-2.5 0L2.25 6.75",
  Coffee:
    "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z",
  Lunch:
    "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z",
  Last: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

function getActivityIcon(activity?: string): string {
  if (!activity) return ACTIVITY_ICONS["Last"];
  const key = Object.keys(ACTIVITY_ICONS).find((k) =>
    activity.startsWith(k)
  );
  return ACTIVITY_ICONS[key || "Last"];
}

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ContactCategory>("all");

  const filtered = mockContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.position?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
      <h1 className="font-heading text-3xl font-bold text-text">
        Your Network
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Nurturing {mockContacts.length} active connections
      </p>

      {/* Search */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-sm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-text-light"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search your atrium..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-text placeholder:text-text-light outline-none"
        />
      </div>

      {/* Category filters */}
      <div className="mt-5 flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              activeCategory === cat.key
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contact list */}
      <div className="mt-6 space-y-3">
        {filtered.map((contact) => (
          <ContactRow key={contact.id} contact={contact} />
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-text-light">
            No contacts found
          </p>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/contacts/new"
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  const statusStyle = contact.status ? STATUS_STYLES[contact.status] : null;
  const activityIcon = getActivityIcon(contact.activity);

  return (
    <Link href={`/contacts/${contact.id}`} className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm transition-colors hover:bg-neutral">
      {/* Avatar */}
      {contact.photoUrl ? (
        <img
          src={contact.photoUrl}
          alt={contact.name}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary font-heading text-sm font-bold text-primary">
          {getInitials(contact.name)}
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-heading text-sm font-bold text-text">
            {contact.name}
          </p>
          {statusStyle && (
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-text-secondary">
          {contact.position}
          {contact.company ? ` at ${contact.company}` : ""}
        </p>
        {contact.activity && (
          <div className="mt-1 flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-text-light"
            >
              <path d={activityIcon} />
            </svg>
            <p className="truncate text-[11px] italic text-text-light">
              {contact.activity}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
