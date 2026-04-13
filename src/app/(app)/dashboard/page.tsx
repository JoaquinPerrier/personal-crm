"use client";

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import {
  mockContacts,
  mockFollowUps as initialFollowUps,
  getTimeAgo,
  getInitials,
  type FollowUp,
} from "@/lib/mockData";

const FOLLOW_UP_ICONS: Record<FollowUp["icon"], string> = {
  note: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM7 7h10M7 12h10M7 17h6",
  coffee:
    "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8ZM6 2v3M10 2v3M14 2v3",
  forward: "M13 5l7 7-7 7M5 12h14",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z",
  call: "M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.67 2.36a2 2 0 0 1-.45 2.11L8.09 11.5a16 16 0 0 0 6.41 6.41l2.31-2.24a2 2 0 0 1 2.11-.45c.76.31 1.55.54 2.36.67A2 2 0 0 1 22 16.92Z",
};

export default function DashboardPage() {
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const priorityContacts = mockContacts.filter((c) => c.isFavorite);
  const totalCircles = mockContacts.length;

  const toggleFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f))
    );
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        {/* Relationship Pulse */}
        <div className="mt-2 flex items-center gap-2">
          <h2 className="font-heading text-xl font-bold text-primary">
            Relationship Pulse
          </h2>
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
        </div>

        {/* Network Health Card */}
        <div className="mt-4 rounded-3xl bg-primary p-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-tertiary">
            Network Health
          </p>
          <p className="mt-1 font-heading text-4xl font-bold text-white">
            Thriving
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="font-heading text-2xl font-bold text-tertiary">
                {totalCircles}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-light">
                Total
                <br />
                Circles
              </p>
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-tertiary">
                12
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-light">
                Due
                <br />
                Today
              </p>
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-tertiary">
                84%
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-light">
                Pulse Rate
              </p>
            </div>
          </div>
        </div>

        {/* Gifting Window */}
        <div className="mt-4 rounded-3xl bg-tertiary p-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
            <rect x="3" y="8" width="18" height="14" rx="2" fill="currentColor" opacity="0.15" />
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="mt-3 font-heading text-lg font-bold text-text">
            Gifting Window
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            3 key anniversaries are approaching in the next fortnight.
          </p>
          <button className="mt-4 rounded-lg bg-surface px-4 py-2 text-xs font-bold text-text">
            View Events
          </button>
        </div>

        {/* Priority Contacts */}
        <div className="mt-8 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary">
              Priority Contacts
            </h2>
            <p className="text-sm text-text-secondary">
              Deepen these connections this week
            </p>
          </div>
          <button className="mt-1 text-sm font-semibold text-text">
            See All &gt;
          </button>
        </div>

        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {priorityContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex w-40 shrink-0 flex-col items-center rounded-2xl bg-surface p-4 shadow-sm"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary font-heading text-lg font-bold text-primary">
                  {getInitials(contact.name)}
                </div>
                {contact.isFavorite && (
                  <span className="absolute -right-0.5 bottom-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-secondary">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-bold text-text">
                {contact.name}
              </p>
              <p className="text-[11px] text-text-light">
                Last met {getTimeAgo(contact.lastMet)}
              </p>
              <div className="mt-3 flex gap-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Follow-ups */}
        <h2 className="mt-8 font-heading text-xl font-bold text-primary">
          Upcoming Follow-ups
        </h2>

        <div className="mt-4 space-y-3">
          {followUps.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm transition-opacity ${
                item.completed ? "opacity-50" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary text-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={FOLLOW_UP_ICONS[item.icon]} />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-bold text-text ${
                    item.completed ? "line-through" : ""
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {item.description}
                </p>
              </div>
              <button
                onClick={() => toggleFollowUp(item.id)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  item.completed
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-dark bg-transparent text-transparent"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
