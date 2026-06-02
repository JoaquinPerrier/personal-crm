"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import { getTimeAgo } from "@/lib/utils";
import ContactAvatar from "@/components/ContactAvatar";
import type { Contact } from "@/lib/types";

export default function DashboardPage() {
  const { t } = useT();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { contacts: data } = await api.getContacts();
        setContacts(data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : t("common.error"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  const priorityContacts = contacts.filter((c) => c.isFavorite);
  const totalCircles = contacts.length;
  const newContacts = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="mx-auto w-full max-w-lg">
      <AppHeader />

      <div className="px-5 pb-8">
        <div className="mt-2 flex items-center gap-2">
          <h2 className="font-heading text-xl font-bold text-primary">{t("dashboard.relationshipPulse")}</h2>
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
        </div>

        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {error && (
          <p className="mt-8 text-center text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-4 rounded-3xl bg-primary p-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-tertiary">{t("dashboard.networkHealth")}</p>
              <p className="mt-1 font-heading text-4xl font-bold text-white">
                {totalCircles > 0 ? t("dashboard.thriving") : "—"}
              </p>
              <div className="mt-6 flex gap-8">
                <div>
                  <p className="font-heading text-2xl font-bold text-tertiary">{totalCircles}</p>
                  <p className="whitespace-pre-line text-[10px] font-semibold uppercase tracking-wide text-text-light">{t("dashboard.totalCircles")}</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-tertiary">{newContacts}</p>
                  <p className="whitespace-pre-line text-[10px] font-semibold uppercase tracking-wide text-text-light">{t("dashboard.dueToday")}</p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-tertiary">
                    {totalCircles > 0 ? `${Math.round(((totalCircles - newContacts) / totalCircles) * 100)}%` : "—"}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-light">{t("dashboard.pulseRate")}</p>
                </div>
              </div>
            </div>

            {totalCircles === 0 ? (
              <div className="mt-8 rounded-2xl bg-surface p-8 text-center shadow-sm">
                <p className="text-sm text-text-secondary">{t("contacts.emptyDesc")}</p>
                <Link href="/contacts/new" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
                  {t("contacts.addFirst")}
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 flex items-start justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-primary">{t("dashboard.priorityContacts")}</h2>
                    <p className="text-sm text-text-secondary">{t("dashboard.priorityDesc")}</p>
                  </div>
                  <Link href="/contacts" className="mt-1 text-sm font-semibold text-text">{t("dashboard.seeAll")}</Link>
                </div>

                <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                  {(priorityContacts.length > 0 ? priorityContacts : contacts.slice(0, 4)).map((contact) => (
                    <Link
                      key={contact.id}
                      href={`/contacts/${contact.id}`}
                      className="flex w-40 shrink-0 flex-col items-center rounded-2xl bg-surface p-4 shadow-sm"
                    >
                      <ContactAvatar contact={contact} size="md" />
                      <p className="mt-3 text-sm font-bold text-text">{contact.name}</p>
                      <p className="text-[11px] text-text-light">
                        {t("dashboard.lastMet")} {getTimeAgo(contact.lastMet || contact.updatedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <Link
          href="/contacts/new"
          className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
