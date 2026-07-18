"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
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
  icon: ReactNode;
}[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholderKey: "profile.linkedinPlaceholder",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholderKey: "profile.instagramPlaceholder",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholderKey: "profile.facebookPlaceholder",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholderKey: "profile.whatsappPlaceholder",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 7c0 5.44-4.44 9.87-9.9 9.87zm8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.32-1.66a11.88 11.88 0 0 0 5.67 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4z" />
      </svg>
    ),
  },
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
                        <span className="text-text-light">{field.icon}</span>
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
