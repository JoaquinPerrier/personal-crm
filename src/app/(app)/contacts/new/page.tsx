"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import { SOCIAL_ICONS } from "@/components/SocialIcons";
import type { ContactCategory } from "@/lib/types";

const CATEGORY_MAP: Record<string, ContactCategory> = {
  "new.business": "business",
  "new.personal": "personal",
  "new.referral": "refer",
};

type SocialKey = "instagram" | "linkedin" | "facebook" | "whatsapp";

const SOCIAL_FIELDS: {
  key: SocialKey;
  label: string;
  placeholderKey:
    | "profile.linkedinPlaceholder"
    | "profile.instagramPlaceholder"
    | "profile.facebookPlaceholder"
    | "profile.whatsappPlaceholder";
}[] = [
  { key: "instagram", label: "Instagram", placeholderKey: "profile.instagramPlaceholder" },
  { key: "linkedin", label: "LinkedIn", placeholderKey: "profile.linkedinPlaceholder" },
  { key: "facebook", label: "Facebook", placeholderKey: "profile.facebookPlaceholder" },
  { key: "whatsapp", label: "WhatsApp", placeholderKey: "profile.whatsappPlaceholder" },
];

export default function NewContactPage() {
  const router = useRouter();
  const { t } = useT();
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["new.business"]);
  const [referredBy, setReferredBy] = useState("");
  const [howWeMet, setHowWeMet] = useState("");
  const [birthday, setBirthday] = useState("");
  const [initialSpark, setInitialSpark] = useState("");
  const [socialLinks, setSocialLinks] = useState<Partial<Record<SocialKey, string>>>({});
  const [visibleSocials, setVisibleSocials] = useState<SocialKey[]>(["instagram"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isReferral = selectedCategories.includes("new.referral");

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

  function addSocialField(key: SocialKey) {
    setVisibleSocials((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }

  const hiddenSocials = SOCIAL_FIELDS.filter((f) => !visibleSocials.includes(f.key));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;

    setError("");
    setLoading(true);
    try {
      const categoryKey = selectedCategories[0];
      const category = categoryKey ? CATEGORY_MAP[categoryKey] : undefined;
      const cleanedSocials = Object.fromEntries(
        Object.entries(socialLinks)
          .map(([k, v]) => [k, v?.trim()])
          .filter(([, v]) => v)
      );
      const { contact } = await api.createContact({
        name: fullName.trim(),
        company: company.trim() || undefined,
        category,
        referredBy: referredBy.trim() || undefined,
        howWeMet: howWeMet.trim() || undefined,
        birthday: birthday || undefined,
        notes: initialSpark.trim() || undefined,
        socialLinks: Object.keys(cleanedSocials).length > 0 ? cleanedSocials : undefined,
      });
      router.push(`/contacts/${contact.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col bg-background">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="p-1 text-text">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="font-heading text-base font-bold text-primary">{t("new.title")}</span>
        <div className="w-7" />
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-6 pb-10">
        <h1 className="mt-4 font-heading text-2xl font-bold text-text">{t("new.heading")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t("new.subtitle")}</p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <fieldset className="mt-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.fullName")}</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("new.fullNamePlaceholder")}
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.companyContext")}</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("new.companyPlaceholder")}
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("profile.socialTitle")}</label>
          <div className="mt-2 space-y-3">
            {SOCIAL_FIELDS.filter((f) => visibleSocials.includes(f.key)).map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <span className="shrink-0 text-text-light" title={field.label}>
                  {SOCIAL_ICONS[field.key]}
                </span>
                <input
                  type="text"
                  value={socialLinks[field.key] ?? ""}
                  onChange={(e) =>
                    setSocialLinks((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={t(field.placeholderKey)}
                  aria-label={field.label}
                  className="min-w-0 flex-1 rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ))}
          </div>
          {hiddenSocials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hiddenSocials.map((field) => (
                <button
                  key={field.key}
                  type="button"
                  onClick={() => addSocialField(field.key)}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-dark bg-surface px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span className="text-sm leading-none">+</span>
                  {field.label}
                </button>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.category")}</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  type="button"
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
        </fieldset>

        {isReferral && (
          <fieldset className="mt-6">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.referredBy")}</label>
            <input
              type="text"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              placeholder={t("new.referredByPlaceholder")}
              className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </fieldset>
        )}

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.howWeMet")}</label>
          <input
            type="text"
            value={howWeMet}
            onChange={(e) => setHowWeMet(e.target.value)}
            placeholder={t("new.howWeMetPlaceholder")}
            className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.birthday")}</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={`mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${birthday ? "text-text" : "text-text-light date-empty"}`}
          />
        </fieldset>

        <fieldset className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.initialSpark")}</label>
          <textarea
            value={initialSpark}
            onChange={(e) => setInitialSpark(e.target.value)}
            placeholder={t("new.sparkPlaceholder")}
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </fieldset>

        <button
          type="submit"
          disabled={loading || !fullName.trim()}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? t("common.saving") : t("new.addToLedger")}
        </button>
      </form>
    </div>
  );
}
