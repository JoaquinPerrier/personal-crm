"use client";

import AppHeader from "@/components/AppHeader";
import { useT, type Locale } from "@/lib/i18n";

const LOCALES: { code: Locale; labelKey: "lang.en" | "lang.es" }[] = [
  { code: "en", labelKey: "lang.en" },
  { code: "es", labelKey: "lang.es" },
];

export default function ProfilePage() {
  const { t, locale, setLocale } = useT();

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        <h1 className="font-heading text-3xl font-bold text-text">
          {t("nav.profile")}
        </h1>

        {/* Avatar */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-white">
            JT
          </div>
          <div>
            <p className="font-heading text-lg font-bold text-text">James Turner</p>
            <p className="text-sm text-text-secondary">james.turner@email.com</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t("lang.label")}
          </p>
          <div className="mt-3 flex gap-3">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors ${
                  locale === l.code
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-dark bg-surface text-text-secondary hover:border-primary/40"
                }`}
              >
                {t(l.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
