"use client";

import { use, useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import type { ContactCategory } from "@/lib/types";
import ContactProfileAccordion from "@/components/ContactProfileAccordion";
import {
  emptyExtendedProfile,
  type ContactExtendedProfile,
  type RootFieldValues,
} from "@/lib/contact-profile";

const CATEGORIES: { key: ContactCategory; labelKey: "new.business" | "new.personal" | "new.referral" }[] = [
  { key: "business", labelKey: "new.business" },
  { key: "personal", labelKey: "new.personal" },
  { key: "refer", labelKey: "new.referral" },
];

export default function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useT();

  const [rootFields, setRootFields] = useState<RootFieldValues>({
    name: "",
    birthday: "",
    location: "",
    company: "",
    position: "",
    howWeMet: "",
  });
  const [extendedProfile, setExtendedProfile] = useState<ContactExtendedProfile>(emptyExtendedProfile());
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<ContactCategory>("business");
  const [notes, setNotes] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { contact } = await api.getContact(id);
        setRootFields({
          name: contact.name,
          birthday: contact.birthday || "",
          location: contact.location || "",
          company: contact.company || "",
          position: contact.position || "",
          howWeMet: contact.howWeMet || "",
        });
        setExtendedProfile(contact.extendedProfile ?? emptyExtendedProfile());
        setEmail(contact.email || "");
        setPhone(contact.phone || "");
        setCategory(contact.category || "business");
        setNotes(contact.notes || "");
        setReferredBy(contact.referredBy || "");
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : t("common.error"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, t]);

  function handleRootFieldChange(field: keyof RootFieldValues, value: string) {
    setRootFields((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.updateContact(id, {
        name: rootFields.name.trim(),
        company: rootFields.company.trim() || undefined,
        position: rootFields.position.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        location: rootFields.location.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
        howWeMet: rootFields.howWeMet.trim() || undefined,
        referredBy: referredBy.trim() || undefined,
        birthday: rootFields.birthday || undefined,
        extendedProfile,
      });
      router.push(`/contacts/${id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="p-1 text-text">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="font-heading text-base font-bold text-primary">{t("contacts.editContact")}</span>
        <div className="w-7" />
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 px-6">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <Field label={t("detail.primaryEmail")} value={email} onChange={setEmail} type="email" />
        <Field label={t("detail.mobile")} value={phone} onChange={setPhone} />

        <fieldset>
          <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("new.category")}</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`rounded-full border px-5 py-2 text-xs font-semibold ${
                  category === cat.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-dark bg-surface text-text-secondary"
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </fieldset>

        {category === "refer" && (
          <Field label={t("new.referredBy")} value={referredBy} onChange={setReferredBy} />
        )}

        <TextArea label={t("new.initialSpark")} value={notes} onChange={setNotes} />

        <ContactProfileAccordion
          profile={extendedProfile}
          rootFields={rootFields}
          onProfileChange={setExtendedProfile}
          onRootFieldChange={handleRootFieldChange}
        />

        <button
          type="submit"
          disabled={saving || !rootFields.name.trim()}
          className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg disabled:opacity-60"
        >
          {saving ? t("common.saving") : t("common.save")}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <fieldset>
      <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </fieldset>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-2 w-full resize-none rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </fieldset>
  );
}
