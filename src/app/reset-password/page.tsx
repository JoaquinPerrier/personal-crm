"use client";

import Link from "next/link";
import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api-client";
import { useT } from "@/lib/i18n";

function ResetPasswordForm() {
  const { t } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      router.push("/login?reset=success");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-text-secondary">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-primary">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {t("auth.newPassword")}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text outline-none ring-1 ring-transparent focus:bg-white focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {t("auth.confirmPassword")}
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text outline-none ring-1 ring-transparent focus:bg-white focus:ring-primary/30"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {loading ? t("auth.updating") : t("auth.updatePassword")}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useT();

  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      <header className="px-6 py-5">
        <Link href="/" className="font-heading text-lg font-bold text-primary">Kinship Ledger</Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-text">{t("auth.resetPassword")}</h1>
          <Suspense fallback={<p className="mt-4 text-sm text-text-secondary">{t("common.loading")}</p>}>
            <ResetPasswordForm />
          </Suspense>
          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="font-semibold text-primary">{t("auth.backToLogin")}</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
