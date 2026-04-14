"use client";

import BottomNav from "@/components/BottomNav";
import { I18nProvider } from "@/lib/i18n";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="min-h-full bg-background pb-16">
        {children}
        <BottomNav />
      </div>
    </I18nProvider>
  );
}
