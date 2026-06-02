"use client";

import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import ContactAvatar from "@/components/ContactAvatar";
import type { Contact, ContactCategory, ContactStatus } from "@/lib/types";

const CATEGORY_KEYS: { key: ContactCategory; tKey: "contacts.all" | "contacts.business" | "contacts.personal" | "contacts.refer" }[] = [
  { key: "all", tKey: "contacts.all" },
  { key: "business", tKey: "contacts.business" },
  { key: "personal", tKey: "contacts.personal" },
  { key: "refer", tKey: "contacts.refer" },
];

const STATUS_TKEYS: Record<NonNullable<ContactStatus>, "contacts.statusWarm" | "contacts.statusFollowUp" | "contacts.statusNew" | "contacts.statusCold"> = {
  warm: "contacts.statusWarm",
  "follow-up-due": "contacts.statusFollowUp",
  new: "contacts.statusNew",
  cold: "contacts.statusCold",
};

const STATUS_STYLES: Record<NonNullable<ContactStatus>, { bg: string; text: string }> = {
  warm: { bg: "bg-orange-100", text: "text-orange-600" },
  "follow-up-due": { bg: "bg-red-100", text: "text-red-600" },
  new: { bg: "bg-blue-100", text: "text-blue-600" },
  cold: { bg: "bg-gray-100", text: "text-gray-500" },
};

export default function ContactsPage() {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ContactCategory>("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { contacts: data } = await api.getContacts();
      setContacts(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("contacts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.position?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isEmpty = !loading && !error && contacts.length === 0;
  const noResults = !loading && !error && contacts.length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        <h1 className="font-heading text-3xl font-bold text-text">
          {t("contacts.yourNetwork")}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {t("contacts.nurturing", { count: contacts.length })}
        </p>

        {!isEmpty && (
          <>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-light">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={t("contacts.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-text placeholder:text-text-light outline-none"
              />
            </div>

            <div className="mt-5 flex gap-2">
              {CATEGORY_KEYS.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    activeCategory === cat.key
                      ? "bg-primary text-white"
                      : "bg-surface text-text-secondary"
                  }`}
                >
                  {t(cat.tKey)}
                </button>
              ))}
            </div>
          </>
        )}

        {loading && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-text-light">{t("common.loading")}</p>
          </div>
        )}

        {error && (
          <div className="mt-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button onClick={loadContacts} className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white">
              {t("common.retry")}
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="mt-12 flex flex-col items-center rounded-2xl bg-surface px-6 py-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tertiary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="mt-4 font-heading text-lg font-bold text-text">{t("contacts.empty")}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t("contacts.emptyDesc")}</p>
            <Link href="/contacts/new" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg">
              {t("contacts.addFirst")}
            </Link>
          </div>
        )}

        {!loading && !error && !isEmpty && (
          <div className="mt-6 space-y-3">
            {filtered.map((contact) => (
              <ContactRow key={contact.id} contact={contact} />
            ))}
            {noResults && (
              <p className="py-12 text-center text-sm text-text-light">
                {t("contacts.noResults")}
              </p>
            )}
          </div>
        )}

        {!isEmpty && (
          <Link
            href="/contacts/new"
            className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  const { t } = useT();
  const statusStyle = contact.status ? STATUS_STYLES[contact.status] : null;
  const statusLabel = contact.status ? t(STATUS_TKEYS[contact.status]) : null;

  return (
    <Link href={`/contacts/${contact.id}`} className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm transition-colors hover:bg-neutral">
      <ContactAvatar contact={contact} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-heading text-sm font-bold text-text">{contact.name}</p>
          {statusStyle && statusLabel && (
            <span className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text}`}>
              {statusLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-text-secondary">
          {contact.position}
          {contact.company ? ` ${t("contacts.at")} ${contact.company}` : ""}
        </p>
        {contact.notes && (
          <p className="mt-1 truncate text-[11px] italic text-text-light">{contact.notes}</p>
        )}
      </div>
    </Link>
  );
}
