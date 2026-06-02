"use client";

import Link from "next/link";
import { useState, FormEvent, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, ApiClientError } from "@/lib/auth-context";

function LoginForm() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const resetSuccess = searchParams.get("reset") === "success";

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect);
    }
  }, [authLoading, user, router, redirect]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, redirect);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {resetSuccess && (
        <p className="mt-4 rounded-xl bg-secondary/10 px-4 py-3 text-sm text-secondary">
          Password updated successfully. You can now sign in.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wide text-text-secondary uppercase">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alexander@atrium.com"
            className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wide text-text-secondary uppercase">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-secondary transition-colors hover:text-secondary-light"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-xl disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      <header className="px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-primary">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M14 8l-5 3v6l5 3 5-3v-6l-5-3Z" fill="currentColor" opacity="0.3" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
          </svg>
          <span className="font-heading text-lg font-bold text-primary">Kinship Ledger</span>
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-text">Welcome Back</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your credentials to access your ledger.
          </p>

          <Suspense fallback={<p className="mt-8 text-sm text-text-light">Loading...</p>}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-text-secondary">
            New to the atrium?{" "}
            <Link href="/register" className="font-semibold text-primary transition-colors hover:text-secondary">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <footer className="bg-neutral-dark/40 px-6 py-8">
        <Link href="/" className="font-heading text-base font-bold text-primary">
          Kinship Ledger
        </Link>
        <p className="mt-2 text-xs uppercase tracking-wide text-text-light">
          &copy; 2025 Kinship Ledger. The Digital Atrium for Meaningful Connections.
        </p>
      </footer>
    </div>
  );
}
