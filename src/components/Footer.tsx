export default function Footer() {
  return (
    <footer className="bg-neutral-dark/40 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Brand */}
        <a href="/" className="font-heading text-lg font-bold text-primary">
          Kinship Ledger
        </a>
        <p className="mt-3 text-xs uppercase tracking-wide text-text-light">
          &copy; {new Date().getFullYear()} Kinship Ledger. The Digital Atrium
          for meaningful connections.
        </p>

        {/* Links */}
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href="#"
            className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary"
          >
            Philosophy
          </a>
          <a
            href="#"
            className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary"
          >
            Security
          </a>
          <a
            href="#"
            className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs uppercase tracking-wide text-text-light transition-colors hover:text-primary"
          >
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
