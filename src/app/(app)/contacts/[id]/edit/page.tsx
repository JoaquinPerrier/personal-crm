"use client";

import { use, useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import type { Contact, ContactCategory } from "@/lib/types";

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

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ContactCategory>("business");
  const [notes, setNotes] = useState("");
  const [howWeMet, setHowWeMet] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [birthday, setBirthday] = useState("");
  const [aspirations, setAspirations] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { contact } = await api.getContact(id);
        setName(contact.name);
        setCompany(contact.company || "");
        setPosition(contact.position || "");
        setEmail(contact.email || "");
        setPhone(contact.phone || "");
        setLocation(contact.location || "");
        setCategory(contact.category || "business");
        setNotes(contact.notes || "");
        setHowWeMet(contact.howWeMet || "");
        setReferredBy(contact.referredBy || "");
        setBirthday(contact.birthday || "");
        setAspirations(contact.aspirations || "");
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : t("common.error"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, t]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.updateContact(id, {
        name: name.trim(),
        company: company.trim() || undefined,
        position: position.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
        howWeMet: howWeMet.trim() || undefined,
        referredBy: referredBy.trim() || undefined,
        birthday: birthday || undefined,
        aspirations: aspirations.trim() || undefined,
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
    <div className="mx-auto w-full max-w-lg pb-10">
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

        <Field label={t("new.fullName")} value={name} onChange={setName} required />
        <Field label={t("new.companyContext")} value={company} onChange={setCompany} />
        <Field label="Position" value={position} onChange={setPosition} />
        <Field label={t("detail.primaryEmail")} value={email} onChange={setEmail} type="email" />
        <Field label={t("detail.mobile")} value={phone} onChange={setPhone} />
        <Field label={t("detail.location")} value={location} onChange={setLocation} />

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

        <Field label={t("new.howWeMet")} value={howWeMet} onChange={setHowWeMet} />
        <Field label={t("new.birthday")} value={birthday} onChange={setBirthday} type="date" />

        <TextArea label={t("new.initialSpark")} value={notes} onChange={setNotes} />
        <TextArea label={t("detail.aspiration")} value={aspirations} onChange={setAspirations} />

        <button
          type="submit"
          disabled={saving || !name.trim()}
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
