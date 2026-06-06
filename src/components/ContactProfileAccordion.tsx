"use client";

import { useState } from "react";
import { useT, type Locale } from "@/lib/i18n";
import {
  PROFILE_SECTIONS,
  countSectionAnswers,
  countTotalAnswers,
  type ContactExtendedProfile,
  type ProfileFieldDef,
  type ProfileRootField,
  type RootFieldValues,
} from "@/lib/contact-profile";

interface ContactProfileAccordionProps {
  profile: ContactExtendedProfile;
  rootFields: RootFieldValues;
  onProfileChange: (profile: ContactExtendedProfile) => void;
  onRootFieldChange: (field: ProfileRootField, value: string) => void;
}

function fieldLabel(field: ProfileFieldDef, locale: Locale) {
  return locale === "es" ? field.labelEs : field.labelEn;
}

function sectionTitle(section: (typeof PROFILE_SECTIONS)[number], locale: Locale) {
  return locale === "es" ? section.titleEs : section.titleEn;
}

export default function ContactProfileAccordion({
  profile,
  rootFields,
  onProfileChange,
  onRootFieldChange,
}: ContactProfileAccordionProps) {
  const { locale, t } = useT();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const totalAnswered = countTotalAnswers(profile, rootFields);
  const totalFields = PROFILE_SECTIONS.reduce((n, s) => n + s.fields.length, 0);

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setSectionField(sectionId: keyof ContactExtendedProfile, key: string, value: string) {
    onProfileChange({
      ...profile,
      [sectionId]: { ...profile[sectionId], [key]: value },
    });
  }

  function getValue(sectionId: keyof ContactExtendedProfile, field: ProfileFieldDef): string {
    if (field.rootField) return rootFields[field.rootField] ?? "";
    return profile[sectionId][field.key] ?? "";
  }

  function setValue(sectionId: keyof ContactExtendedProfile, field: ProfileFieldDef, value: string) {
    if (field.rootField) {
      onRootFieldChange(field.rootField, value);
    } else {
      setSectionField(sectionId, field.key, value);
    }
  }

  return (
    <div className="mt-8 border-t border-neutral-dark pt-6">
      <div className="mb-4">
        <h2 className="font-heading text-xl font-bold text-primary">{t("profile.mackayTitle")}</h2>
        <p className="mt-1 text-sm text-text-secondary">{t("profile.mackaySubtitle")}</p>
        <p className="mt-2 text-xs font-semibold text-secondary">
          {t("profile.progress", { answered: totalAnswered, total: totalFields })}
        </p>
      </div>

      <div className="space-y-3">
        {PROFILE_SECTIONS.map((section) => {
          const isOpen = openSections.has(section.id);
          const answered = countSectionAnswers(section, profile, rootFields);
          const total = section.fields.length;

          return (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-neutral-dark bg-surface shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-bold text-text">{sectionTitle(section, locale)}</p>
                  <p className="mt-0.5 text-xs text-text-light">
                    {t("profile.sectionProgress", { answered, total })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {answered > 0 && (
                    <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary">
                      {answered}/{total}
                    </span>
                  )}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={`text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-neutral-dark px-4 py-4">
                  {section.fields.map((field) => (
                    <ProfileField
                      key={field.key}
                      field={field}
                      locale={locale}
                      value={getValue(section.id, field)}
                      onChange={(v) => setValue(section.id, field, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileField({
  field,
  locale,
  value,
  onChange,
}: {
  field: ProfileFieldDef;
  locale: Locale;
  value: string;
  onChange: (v: string) => void;
}) {
  const label = fieldLabel(field, locale);
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-neutral-dark bg-background px-4 py-3 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  if (field.type === "textarea") {
    return (
      <fieldset>
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </fieldset>
    );
  }

  return (
    <fieldset>
      <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{label}</label>
      <input
        type={field.type === "date" ? "date" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </fieldset>
  );
}
