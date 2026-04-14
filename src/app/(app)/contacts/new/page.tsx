"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Business", "Personal", "Referral"];

export default function NewContactPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Business"]);
  const [initialSpark, setInitialSpark] = useState("");

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
          New Connection
        </span>
        <div className="w-7" />
      </header>

      <div className="flex-1 px-6 pb-10">
        {/* Title */}
        <h1 className="mt-4 font-heading text-2xl font-bold text-text">
          Capture the Spark
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          Record the essence of this new relationship while the details are fresh.
        </p>

        {/* Full Name */}
        <fieldset className="mt-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Who did you meet?"
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        {/* Company / Context */}
        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Company / Context
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Organization or common ground"
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        {/* Relationship Category */}
        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            Relationship Category
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full border px-5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-neutral-dark bg-surface text-text-secondary hover:border-primary/40"
                  }`}
                >
                  {cat}
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
            Initial Spark
          </label>
          <div className="relative mt-2">
            <textarea
              value={initialSpark}
              onChange={(e) => setInitialSpark(e.target.value)}
              placeholder={"What stood out? Future gift ideas?\nShared interests?"}
              rows={4}
              className="w-full resize-none rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="absolute bottom-3 right-3">
              <span className="flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Warm Lead
              </span>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
