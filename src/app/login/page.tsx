"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral">
      {/* Header */}
      <header className="px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-primary"
          >
            <path
              d="M14 2L4 8v12l10 6 10-6V8L14 2Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M14 8l-5 3v6l5 3 5-3v-6l-5-3Z"
              fill="currentColor"
              opacity="0.3"
            />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
          </svg>
          <span className="font-heading text-lg font-bold text-primary">
            Kinship Ledger
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your credentials to access your ledger.
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wide text-text-secondary uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alexander@atrium.com"
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-semibold tracking-wide text-text-secondary uppercase">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-secondary transition-colors hover:text-secondary-light"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border-0 bg-neutral px-4 py-3.5 text-sm text-text placeholder:text-text-light outline-none ring-1 ring-transparent transition-all focus:bg-white focus:ring-primary/30"
              />
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-xl"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-dark" />
            <span className="text-xs text-text-light">Or continue with</span>
            <div className="h-px flex-1 bg-neutral-dark" />
          </div>

          {/* Google */}
          <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-dark bg-surface px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-neutral">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* Create account */}
          <p className="mt-8 text-center text-sm text-text-secondary">
            New to the atrium?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary transition-colors hover:text-secondary"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-dark/40 px-6 py-8">
        <a href="/" className="font-heading text-base font-bold text-primary">
          Kinship Ledger
        </a>
        <p className="mt-2 text-xs uppercase tracking-wide text-text-light">
          &copy; 2025 Kinship Ledger. The Digital Atrium for Meaningful
          Connections.
        </p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary">
            Philosophy
          </a>
          <a href="#" className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary">
            Security
          </a>
          <a href="#" className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary">
            Privacy
          </a>
          <a href="#" className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary">
            Terms
          </a>
        </nav>
      </footer>
    </div>
  );
}
