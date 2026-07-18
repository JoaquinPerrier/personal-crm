"use client";

import { useEffect, useState, type FormEvent } from "react";
import AppHeader from "@/components/AppHeader";
import { SOCIAL_ICONS } from "@/components/SocialIcons";
import { useT, type Locale } from "@/lib/i18n";
import { useAuth, ApiClientError } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";
import { hasSocialLinks } from "@/lib/social-links";
import type { UserSocialLinks } from "@/lib/types";

const LOCALES: { code: Locale; labelKey: "lang.en" | "lang.es" }[] = [
  { code: "en", labelKey: "lang.en" },
  { code: "es", labelKey: "lang.es" },
];

const SOCIAL_FIELDS: {
  key: keyof UserSocialLinks;
  label: string;
  placeholderKey:
    | "profile.linkedinPlaceholder"
    | "profile.instagramPlaceholder"
    | "profile.facebookPlaceholder"
    | "profile.whatsappPlaceholder";
}[] = [
  { key: "linkedin", label: "LinkedIn", placeholderKey: "profile.linkedinPlaceholder" },
  { key: "instagram", label: "Instagram", placeholderKey: "profile.instagramPlaceholder" },
  { key: "facebook", label: "Facebook", placeholderKey: "profile.facebookPlaceholder" },
  { key: "whatsapp", label: "WhatsApp", placeholderKey: "profile.whatsappPlaceholder" },
];

export default function ProfilePage() {
  const { t, locale, setLocale } = useT();
  const { user, logout, loading, updateProfile } = useAuth();

  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [links, setLinks] = useState<UserSocialLinks>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setHeadline(user.headline ?? "");
      setLocation(user.location ?? "");
      setLinks(user.socialLinks ?? {});
    }
  }, [user]);

  const missingSocials = !!user && !hasSocialLinks(user.socialLinks);

  function setLink(key: keyof UserSocialLinks, value: string) {
    setLinks((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Empty strings clear the field server-side (undefined would be dropped by JSON.stringify)
      await updateProfile({
        headline: headline.trim(),
        location: location.trim(),
        socialLinks: links,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        <h1 className="font-heading text-3xl font-bold text-text">{t("nav.profile")}</h1>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : user ? (
          <>
            <div className="mt-6 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-white">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="font-heading text-lg font-bold text-text">{user.name}</p>
                {user.headline && (
                  <p className="text-sm text-text">{user.headline}</p>
                )}
                <p className="text-sm text-text-secondary">{user.email}</p>
                {user.location && (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-text-secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {user.location}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="mt-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {t("profile.aboutTitle")}
                </p>

                <div className="mt-4 space-y-4">
                  <fieldset>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      {t("profile.headline")}
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => {
                        setHeadline(e.target.value);
                        setSaved(false);
                      }}
                      placeholder={t("profile.headlinePlaceholder")}
                      className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </fieldset>
                  <fieldset>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      {t("profile.locationLabel")}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setSaved(false);
                      }}
                      placeholder={t("profile.locationPlaceholder")}
                      className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </fieldset>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                  {t("profile.socialTitle")}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{t("profile.socialSubtitle")}</p>

                {missingSocials && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>{t("profile.socialAlert")}</span>
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  {SOCIAL_FIELDS.map((field) => (
                    <fieldset key={field.key}>
                      <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                        <span className="text-text-light">{SOCIAL_ICONS[field.key]}</span>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={links[field.key] ?? ""}
                        onChange={(e) => setLink(field.key, e.target.value)}
                        placeholder={t(field.placeholderKey)}
                        className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </fieldset>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {error && <p className="text-sm text-red-600">{error}</p>}
                {saved && <p className="text-sm text-emerald-600">{t("profile.saved")}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                >
                  {saving ? t("common.saving") : t("common.save")}
                </button>
              </div>
            </form>

            <button
              onClick={() => logout()}
              className="mt-8 w-full rounded-xl border border-neutral-dark py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-red-300 hover:text-red-600"
            >
              {t("auth.logout")}
            </button>
          </>
        ) : null}

        <div className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("lang.label")}</p>
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
