"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="3" width="8" height="8" rx="2" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: "Reminders",
    href: "/reminders",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    name: "Profile",
    href: "/profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-neutral-dark bg-surface py-2">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
              active ? "text-primary" : "text-text-light"
            }`}
          >
            {tab.icon(active)}
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
