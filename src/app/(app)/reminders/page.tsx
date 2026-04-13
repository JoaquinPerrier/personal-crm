"use client";

import AppHeader from "@/components/AppHeader";
import { getInitials } from "@/lib/mockData";

const featured = {
  badge: "Upcoming",
  title: "Elena's 30th Birthday",
  description:
    "Coming up in 3 days. She recently mentioned wanting to try the new pottery studio in Soho.",
};

const warmConnection = {
  name: "Marcus Thorne",
  subtitle: "Follow-up: New Venture",
  label: "Warm Connection",
};

const timeline = [
  {
    day: "Today",
    name: "Julian Vance",
    description: "Check in on the gallery opening he hosted last night.",
    action: "Message Julian",
    actionStyle: "outlined" as const,
    icon: "chat",
  },
  {
    day: "Tomorrow",
    name: "Sophia Chen",
    description: "Anniversary of joining the board. Acknowledge her impact.",
    action: "Write Note",
    actionStyle: "outlined" as const,
    icon: "pen",
  },
  {
    day: "Friday",
    name: "Sarah & David",
    description: "Scheduled Coffee at The Atrium Café.",
    actions: ["Confirm", "Reschedule"],
    icon: "calendar",
  },
];

const reconnections = [
  {
    name: "Dr. Sarah Jenkins",
    description: "Last spoke 4 months ago",
    icon: "wave",
  },
  {
    name: "Liam O'Connell",
    description: "Missed follow-up regarding the portfolio review",
    icon: "link",
  },
];

const ICON_PATHS: Record<string, string> = {
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  pen: "M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z",
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  wave: "M7 11c1.33-2 4-6 8-6s5.33 2 8 6c-1.33 2-4 6-8 6s-5.33-2-8-6Zm4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  gift: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z",
  coffee: "M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8Z",
};

function Icon({
  name,
  size = 16,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={ICON_PATHS[name] || ICON_PATHS.chat} />
    </svg>
  );
}

export default function RemindersPage() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        {/* Title */}
        <h1 className="font-heading text-3xl font-bold text-primary">
          Reminders
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          Nurturing your most valued connections this week.
        </p>

        {/* Featured upcoming */}
        <div className="mt-6 rounded-3xl bg-surface p-6 shadow-sm">
          <span className="inline-block rounded-full bg-tertiary/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
            Upcoming
          </span>
          <h2 className="mt-3 font-heading text-2xl font-bold text-text">
            {featured.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {featured.description}
          </p>
          <div className="mt-5 flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white">
              <Icon name="gift" size={14} className="text-white" />
              Send Gift Idea
            </button>
            <button className="flex items-center gap-2 rounded-xl border-2 border-primary px-4 py-2.5 text-xs font-bold text-primary">
              <Icon name="coffee" size={14} className="text-primary" />
              Schedule Coffee
            </button>
          </div>
        </div>

        {/* Warm connection card */}
        <div className="mt-4 flex items-center gap-4 rounded-3xl bg-primary p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-lg font-bold text-tertiary">
            {getInitials(warmConnection.name)}
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-white">
              {warmConnection.name}
            </p>
            <p className="mt-0.5 text-xs text-text-light">
              {warmConnection.subtitle}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                {warmConnection.label}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-8">
          {/* Vertical line */}
          <div className="absolute top-2 left-0 h-full w-px bg-gradient-to-b from-secondary/60 via-secondary/30 to-transparent" />

          <div className="space-y-6 pl-6">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                {/* Dot on timeline */}
                <div className="absolute -left-6 top-0 flex h-3 w-3 -translate-x-1/2 items-center justify-center">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-secondary bg-surface" />
                </div>

                <div className="rounded-2xl bg-surface p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {item.day}
                    </span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        item.icon === "pen"
                          ? "bg-tertiary text-secondary"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon name={item.icon} size={14} />
                    </div>
                  </div>
                  <h3 className="mt-3 font-heading text-base font-bold text-text">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>

                  {item.action && (
                    <button className="mt-4 w-full rounded-xl border-2 border-neutral-dark py-2.5 text-xs font-bold uppercase tracking-wide text-text transition-colors hover:border-primary hover:text-primary">
                      <span className="flex items-center justify-center gap-2">
                        <Icon name={item.icon} size={13} />
                        {item.action}
                      </span>
                    </button>
                  )}

                  {item.actions && (
                    <div className="mt-4 flex gap-3">
                      <button className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold uppercase tracking-wide text-white">
                        {item.actions[0]}
                      </button>
                      <button className="flex-1 rounded-xl border-2 border-neutral-dark py-2.5 text-xs font-bold uppercase tracking-wide text-text transition-colors hover:border-primary">
                        {item.actions[1]}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reconnection Opportunities */}
        <div className="mt-10 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <h2 className="font-heading text-xl font-bold text-text">
            Reconnection Opportunities
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {reconnections.map((person, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tertiary font-heading text-sm font-bold text-primary">
                {getInitials(person.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-bold text-text">
                  {person.name}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {person.description}
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon name={person.icon} size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
