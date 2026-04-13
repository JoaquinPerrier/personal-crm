export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-16 md:pt-24">
      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-block rounded-full bg-tertiary/60 px-5 py-2 font-heading text-xs font-semibold tracking-widest text-primary uppercase">
            Introducing the Digital Atrium
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-8 max-w-lg text-center font-heading text-4xl font-bold leading-tight text-primary md:text-5xl md:leading-tight">
          Turn your network into a{" "}
          <span className="italic text-secondary">gold mine</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-md text-center text-base leading-relaxed text-text-secondary md:text-lg">
          Beyond contacts and CRM. Kinship Ledger is a curated space for
          meaningful personal and professional connections, prioritizing quality
          over quantity.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="w-full rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-xl sm:w-auto"
          >
            Get Started
          </a>
          <a
            href="#philosophy"
            className="w-full rounded-full border-2 border-primary px-8 py-3.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:w-auto"
          >
            Our Philosophy
          </a>
        </div>

        {/* Hero image placeholder */}
        <div className="relative mx-auto mt-14 max-w-md overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 md:max-w-lg">
          <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary-light">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-tertiary blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-secondary blur-3xl" />
            </div>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              className="relative z-10 text-white/30"
            >
              <rect
                x="8"
                y="16"
                width="48"
                height="36"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="24" cy="28" r="5" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 44l12-10 8 6 16-14 12 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
