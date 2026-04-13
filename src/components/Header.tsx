"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-neutral/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
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
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-primary transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-primary transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-primary transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#philosophy"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
          >
            Philosophy
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
          >
            Features
          </a>
          <a
            href="#"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Get Started
          </a>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-neutral-dark px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#philosophy"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Philosophy
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#"
              className="inline-block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
