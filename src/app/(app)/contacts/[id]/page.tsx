"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import ContactPhoto from "@/components/ContactPhoto";
import { getDaysSince } from "@/lib/utils";
import type { Contact } from "@/lib/types";

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useT();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editingLastContact, setEditingLastContact] = useState(false);
  const [lastContactDate, setLastContactDate] = useState("");
  const [savingLastContact, setSavingLastContact] = useState(false);
  const [lastContactSaved, setLastContactSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { contact: data } = await api.getContact(id);
        setContact(data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : t("common.error"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, t]);

  async function handleDelete() {
    if (!confirm(t("contacts.deleteConfirm"))) return;
    setDeleting(true);
    try {
      await api.deleteContact(id);
      router.push("/contacts");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
      setDeleting(false);
    }
  }

  function openLastContactEditor() {
    const today = new Date().toISOString().slice(0, 10);
    setLastContactDate(contact?.lastMet?.slice(0, 10) || today);
    setLastContactSaved(false);
    setEditingLastContact(true);
  }

  async function handleLastContactSubmit(e: FormEvent) {
    e.preventDefault();
    if (!contact || !lastContactDate) return;

    setSavingLastContact(true);
    setError("");
    try {
      const { contact: updated } = await api.updateContact(id, {
        lastMet: lastContactDate,
      });
      setContact(updated);
      setEditingLastContact(false);
      setLastContactSaved(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setSavingLastContact(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5">
        <p className="text-text-secondary">{error || t("detail.notFound")}</p>
        <Link href="/contacts" className="text-sm font-semibold text-primary">
          ← {t("nav.contacts")}
        </Link>
      </div>
    );
  }

  const daysSince = getDaysSince(contact.lastMet || contact.updatedAt);
  const lastSpokeText = daysSince === 0
    ? t("detail.lastSpokeToday")
    : daysSince === 7
      ? t("detail.lastSpokeWeek")
      : t("detail.lastSpoke", { days: daysSince ?? 0 });

  return (
    <div className="mx-auto w-full max-w-lg">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => router.back()} className="p-1 text-text">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <Link href="/dashboard" className="font-heading text-lg font-bold text-primary">Kinship Ledger</Link>
        <div className="flex items-center gap-2">
          <Link href={`/contacts/${id}/edit`} className="p-1 text-sm font-semibold text-primary">
            {t("common.edit")}
          </Link>
        </div>
      </header>

      <div className="px-5 pb-8">
        <div className="flex justify-center">
          <ContactPhoto
            contact={contact}
            onUpdated={setContact}
          />
        </div>

        <h1 className="mt-5 font-heading text-3xl font-bold text-text">{contact.name}</h1>
        <div className="mt-2 space-y-1">
          {contact.position && (
            <p className="text-sm text-text-secondary">{contact.position}</p>
          )}
          {contact.company && (
            <p className="text-sm text-text-secondary">{contact.company}</p>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-surface px-5 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary" />
                <span className="text-xs font-bold text-text">{t("detail.warmConnection")}</span>
              </div>
              <span className="truncate text-xs text-text-light">{lastSpokeText}</span>
            </div>
            <button
              type="button"
              onClick={openLastContactEditor}
              className="shrink-0 rounded-full p-1.5 text-primary transition-colors hover:bg-primary/10"
              aria-label={t("detail.updateLastContact")}
              title={t("detail.updateLastContact")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
          </div>

          {editingLastContact && (
            <form onSubmit={handleLastContactSubmit} className="mt-3 border-t border-neutral-dark pt-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                {t("detail.lastContact")}
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="date"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  value={lastContactDate}
                  onChange={(e) => setLastContactDate(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-neutral-dark bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={savingLastContact}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                >
                  {savingLastContact ? t("common.saving") : t("detail.saveLastContact")}
                </button>
              </div>
            </form>
          )}
        </div>

        {lastContactSaved && (
          <p className="mt-2 text-xs font-medium text-emerald-600">
            {t("detail.lastContactSaved")}
          </p>
        )}

        {contact.notes && (
          <div className="mt-6 rounded-2xl bg-surface p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{t("detail.quickNote")}</p>
            <p className="mt-3 text-sm text-text-secondary">{contact.notes}</p>
          </div>
        )}

        {(contact.interests?.length || contact.aspirations || contact.howWeMet) && (
          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-text">{t("detail.goldMine")}</h2>

            {contact.interests && contact.interests.length > 0 && (
              <>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("detail.deepInterests")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contact.interests.map((interest) => (
                    <span key={interest} className="rounded-full border border-neutral-dark px-4 py-2 text-xs font-medium text-text">
                      {interest}
                    </span>
                  ))}
                </div>
              </>
            )}

            {contact.aspirations && (
              <div className="mt-6 border-l-4 border-primary pl-4">
                <h3 className="font-heading text-base font-bold text-text">{t("detail.aspiration")}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{contact.aspirations}</p>
              </div>
            )}
          </div>
        )}

        {contact.howWeMet && (
          <div className="mt-8">
            <h2 className="font-heading text-2xl font-bold text-text">{t("detail.context")}</h2>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("detail.origins")}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{contact.howWeMet}</p>
            {contact.referredBy && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("detail.referredBy")}</p>
                <p className="mt-1 text-sm text-text-secondary">{contact.referredBy}</p>
              </div>
            )}
          </div>
        )}

        {!contact.howWeMet && contact.referredBy && (
          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("detail.referredBy")}</p>
            <p className="mt-2 text-sm text-text-secondary">{contact.referredBy}</p>
          </div>
        )}

        {(contact.email || contact.phone || contact.location || contact.birthday) && (
          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{t("detail.contactChannels")}</p>
            <div className="mt-4 space-y-4">
              {contact.email && (
                <div>
                  <p className="text-xs text-secondary">{t("detail.primaryEmail")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-text">{contact.email}</p>
                </div>
              )}
              {contact.phone && (
                <div>
                  <p className="text-xs text-secondary">{t("detail.mobile")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-text">{contact.phone}</p>
                </div>
              )}
              {contact.location && (
                <div>
                  <p className="text-xs text-secondary">{t("detail.location")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-text">{contact.location}</p>
                </div>
              )}
              {contact.birthday && (
                <div>
                  <p className="text-xs text-secondary">{t("detail.birthday")}</p>
                  <p className="mt-0.5 text-sm font-semibold text-text">{contact.birthday}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="mt-10 w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? t("common.loading") : t("common.delete")}
        </button>
      </div>
    </div>
  );
}
