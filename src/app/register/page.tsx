"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useAuth, ApiClientError } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("You must accept the terms to continue");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-primary">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M14 8l-5 3v6l5 3 5-3v-6l-5-3Z" fill="currentColor" opacity="0.3" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
          </svg>
          <span className="font-heading text-lg font-bold text-primary">Kinship Ledger</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:text-secondary">
          Login
        </Link>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-12">
        <div className="pt-6 pb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Start the Journey</span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
            Curation for<br />your<br />
            <span className="italic text-secondary">Meaningful</span><br />Circles.
          </h1>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-text-secondary">
            Step into the Digital Atrium. A private space designed for depth, not data points.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm">
          <h2 className="text-center font-heading text-xl font-bold text-text">Create your account</h2>
          <p className="mt-2 text-center text-sm text-text-secondary">Join the community of intentional connectors.</p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Evelyn Thorne"
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="evelyn@atrium.com"
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-secondary">Secret Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-dark accent-primary"
              />
              <span className="text-sm leading-snug text-text-secondary">
                I agree to the Terms of Service and Privacy Philosophy.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary transition-colors hover:text-secondary">Log in</Link>
          </p>
        </div>
      </main>

      <footer className="bg-neutral-dark/40 px-6 py-8">
        <Link href="/" className="font-heading text-base font-bold text-primary">Kinship Ledger</Link>
      </footer>
    </div>
  );
}
