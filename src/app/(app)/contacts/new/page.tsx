"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function NewContactPage() {
  const router = useRouter();
  const { t } = useT();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["new.business"]);
  const [initialSpark, setInitialSpark] = useState("");

  const CATEGORIES = [
    { key: "new.business" as const, label: t("new.business") },
    { key: "new.personal" as const, label: t("new.personal") },
    { key: "new.referral" as const, label: t("new.referral") },
  ];

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="p-1 text-text">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="font-heading text-base font-bold text-primary">
          {t("new.title")}
        </span>
        <div className="w-7" />
      </header>

      <div className="flex-1 px-6 pb-10">
        {/* Title */}
        <h1 className="mt-4 font-heading text-2xl font-bold text-text">
          {t("new.heading")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {t("new.subtitle")}
        </p>

        {/* Full Name */}
        <fieldset className="mt-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t("new.fullName")}
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("new.fullNamePlaceholder")}
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        {/* Company / Context */}
        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t("new.companyContext")}
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("new.companyPlaceholder")}
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        {/* Relationship Category */}
        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t("new.category")}
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`rounded-full border px-5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-neutral-dark bg-surface text-text-secondary hover:border-primary/40"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <button className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-neutral-dark text-text-light transition-colors hover:border-primary hover:text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </fieldset>

        {/* Initial Spark */}
        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t("new.initialSpark")}
          </label>
          <div className="relative mt-2">
            <textarea
              value={initialSpark}
              onChange={(e) => setInitialSpark(e.target.value)}
              placeholder={t("new.sparkPlaceholder")}
              rows={4}
              className="w-full resize-none rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute bottom-3 right-3">
              <span className="flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {t("new.warmLead")}
              </span>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
