"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { api, ApiClientError } from "@/lib/api-client";
import { useT } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl("");
    setLoading(true);
    try {
      const result = await api.forgotPassword(email);
      setMessage(result.message);
      if (result.resetUrl) setDevResetUrl(result.resetUrl);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      <header className="px-6 py-5">
        <Link href="/" className="font-heading text-lg font-bold text-primary">Kinship Ledger</Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-text">{t("auth.resetPassword")}</h1>
          <p className="mt-2 text-sm text-text-secondary">{t("auth.resetPasswordDesc")}</p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}
          {message && (
            <p className="mt-4 rounded-xl bg-secondary/10 px-4 py-3 text-sm text-secondary">{message}</p>
          )}
          {devResetUrl && (
            <div className="mt-4 rounded-xl bg-neutral px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary">{t("auth.devResetLink")}</p>
              <Link href={devResetUrl.replace(/^https?:\/\/[^/]+/, "")} className="mt-1 break-all text-xs text-primary underline">
                {devResetUrl}
              </Link>
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {t("auth.email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text outline-none ring-1 ring-transparent focus:bg-white focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? t("auth.sending") : t("auth.sendResetLink")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="font-semibold text-primary">{t("auth.backToLogin")}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
