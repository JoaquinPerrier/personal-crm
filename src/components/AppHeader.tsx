"use client";

import KinshipLogo from "./KinshipLogo";
import { useAuth } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";

export default function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-5 py-4">
      <button className="p-1 text-text">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <KinshipLogo size={22} />
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {user ? getInitials(user.name) : "?"}
        </div>
      </div>
    </header>
  );
}
