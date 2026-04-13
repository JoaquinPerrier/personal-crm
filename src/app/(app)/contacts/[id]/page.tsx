"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockContacts, getInitials } from "@/lib/mockData";

const contactDetails: Record<
  string,
  {
    badge?: string;
    status: string;
    lastSpoke: string;
    interests: string[];
    aspiration: string;
    lifeGoal: string;
    origins: string;
    memories: { title: string; date: string; detail: string }[];
    social: string[];
    email: string;
    phone: string;
    phoneLabel?: string;
    location: string;
  }
> = {
  "1": {
    badge: "Founding Member",
    status: "Warm Connection",
    lastSpoke: "Last spoke 4 days ago",
    interests: ["Pre-war Jazz", "Sustainable Aviation", "Archery", "Rare Coffee Beans"],
    aspiration:
      "Wants to establish a foundation for urban music education by 2026. Currently scouting locations in Chicago.",
    lifeGoal:
      "Fly a vintage Spitfire across the English Channel. Has a pilot license but needs 50 more hours of flight time.",
    origins:
      "Met at the 2019 Aerospace Summit in Zurich. We both missed the same shuttle and spent 3 hours discussing electric propulsion in the lobby.",
    memories: [
      { title: "The London Rainstorm Escape", date: "Nov 2022", detail: "Found a hidden vinyl shop" },
      { title: "Project Aurora Breakthrough", date: "Feb 2021", detail: "Zoom call that went until 3 AM" },
    ],
    social: ["LinkedIn", "X / Twitter", "Personal Blog", "Portfolio"],
    email: "julian.vane@meridian.aero",
    phone: "+44 7700 900542",
    phoneLabel: "Secret Line",
    location: "London, United Kingdom",
  },
  "2": {
    badge: "Inner Circle",
    status: "Warm Connection",
    lastSpoke: "Last spoke 1 week ago",
    interests: ["Typography", "Ceramics", "Architecture", "Matcha"],
    aspiration: "Open a design residency in Kyoto by 2027. Already has connections with local artisans.",
    lifeGoal: "Curate an exhibition at the Serpentine Gallery. Working on a proposal with two collaborators.",
    origins: "Introduced by a mutual friend at a gallery opening in Brooklyn. Bonded over shared love of brutalist architecture.",
    memories: [
      { title: "The Tokyo Detour", date: "Apr 2023", detail: "Found the perfect ramen spot at 2 AM" },
      { title: "Studio A Launch Night", date: "Sep 2022", detail: "Helped set up the entire exhibition" },
    ],
    social: ["LinkedIn", "Portfolio"],
    email: "sophia@studio-a.design",
    phone: "+1 212 555 0198",
    location: "New York, United States",
  },
};

const SOCIAL_ICONS: Record<string, string> = {
  LinkedIn: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2ZM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "X / Twitter": "M4 4l7.07 9.34L4 20h1.6l5.86-5.54L16 20h4l-7.44-9.84L19.4 4H17.8l-5.47 5.16L8 4H4Z",
  "Personal Blog": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 5.29 2H6.71A8 8 0 0 1 12 4Zm0 16a8 8 0 0 1-5.29-2h10.58A8 8 0 0 1 12 20Z",
  Portfolio: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v12h16V6H4Zm2 2h4v4H6V8Z",
};

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const contact = mockContacts.find((c) => c.id === id);
  const details = contactDetails[id] || contactDetails["1"];

  if (!contact) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-secondary">Contact not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="p-1 text-text">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <Link href="/" className="font-heading text-lg font-bold text-primary">
          Kinship Ledger
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-1 text-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
          <button className="p-1 text-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </header>

      <div className="px-5 pb-8">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-tertiary font-heading text-3xl font-bold text-primary shadow-lg">
              {getInitials(contact.name)}
            </div>
            <span className="absolute -right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-secondary">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Badge + Name */}
        {details.badge && (
          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-secondary">
            {details.badge}
          </p>
        )}
        <h1 className="mt-1 font-heading text-3xl font-bold text-text">
          {contact.name}
        </h1>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
            </svg>
            {contact.position}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
            </svg>
            {contact.company}
          </div>
        </div>

        {/* Status pill */}
        <div className="mt-4 flex items-center gap-4 rounded-full bg-surface px-5 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="text-xs font-bold text-text">{details.status}</span>
          </div>
          <span className="text-xs text-text-light">{details.lastSpoke}</span>
        </div>

        {/* Quick Note */}
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Quick Note
          </p>
          <p className="mt-3 text-sm text-text-light italic">
            Capture a passing thought or a small detail...
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-3">
              <button className="text-text-light transition-colors hover:text-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button className="text-text-light transition-colors hover:text-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
                </svg>
              </button>
            </div>
            <button className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white">
              Save Insight
            </button>
          </div>
        </div>

        {/* The Gold Mine */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-text">
              The Gold Mine
            </h2>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          {/* Deep Interests */}
          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Deep Interests
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {details.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-neutral-dark px-4 py-2 text-xs font-medium text-text"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Aspiration */}
          <div className="mt-6 border-l-4 border-primary pl-4">
            <h3 className="font-heading text-base font-bold text-text">
              Aspiration
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {details.aspiration}
            </p>
          </div>

          {/* Life Goal */}
          <div className="mt-5 border-l-4 border-secondary pl-4">
            <h3 className="font-heading text-base font-bold text-text">
              Life Goal
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              {details.lifeGoal}
            </p>
          </div>
        </div>

        {/* Context */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-text">
              Context
            </h2>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>

          {/* Origins */}
          <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Origins
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {details.origins}
          </p>

          {/* Core Memories */}
          <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Core Memories
          </p>
          <div className="mt-3 space-y-4">
            {details.memories.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                <div>
                  <p className="text-sm font-bold text-text">{m.title}</p>
                  <p className="text-xs text-text-light">
                    {m.date} &bull; {m.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Presence */}
        <div className="mt-8 rounded-3xl bg-primary p-6">
          <h2 className="text-center font-heading text-xl font-bold text-white">
            Digital Presence
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {details.social.map((label) => (
              <button
                key={label}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-white/10"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d={SOCIAL_ICONS[label] || SOCIAL_ICONS.LinkedIn} />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Channels */}
        <div className="mt-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Contact Channels
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-secondary">Primary Email</p>
              <p className="mt-0.5 text-sm font-semibold text-text">
                {details.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary">
                Mobile{details.phoneLabel ? ` (${details.phoneLabel})` : ""}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-text">
                {details.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary">Location</p>
              <p className="mt-0.5 text-sm font-semibold text-text">
                {details.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-16 z-40 flex justify-end px-5 pb-4">
        <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z" />
          </svg>
          Schedule Coffee
        </button>
      </div>
    </div>
  );
}
