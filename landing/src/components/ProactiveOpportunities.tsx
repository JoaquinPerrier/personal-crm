export default function ProactiveOpportunities() {
  return (
    <section id="features" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Large image placeholder */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-primary/90 via-primary/70 to-primary-light/60">
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-1/3 left-1/4 h-48 w-48 rounded-full bg-tertiary blur-3xl" />
              <div className="absolute right-1/4 bottom-1/4 h-36 w-36 rounded-full bg-secondary blur-3xl" />
            </div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 64 64"
              fill="none"
              className="relative z-10 text-white/25"
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

        {/* Title */}
        <h2 className="mt-10 font-heading text-3xl font-bold text-primary md:text-4xl">
          Proactive
          <br />
          Opportunities
        </h2>

        {/* Features */}
        <div className="mt-10 space-y-8">
          {/* Relationship Pulse */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path
                  d="M12 2v4M12 18v4M2 12h4M18 12h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-text">
                Relationship Pulse
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Our unique &ldquo;Pulse&rdquo; component visualizes connection warmth
                through organic light effects, alerting you when it&rsquo;s time to
                reach out.
              </p>
            </div>
          </div>

          {/* Curated Gift Suggestions */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/50">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-secondary"
              >
                <rect
                  x="3"
                  y="8"
                  width="18"
                  height="14"
                  rx="2"
                  fill="currentColor"
                  opacity="0.2"
                />
                <path
                  d="M12 8V3M12 3C12 3 9 3 8 5s1 3 4 3M12 3c0 0 3 0 4 2s-1 3-4 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-text">
                Curated Gift Suggestions
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Leverage deep interest data to suggest meaningful gestures that
                transcend traditional corporate gifting.
              </p>
            </div>
          </div>
        </div>

        {/* CTA link */}
        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary transition-colors hover:text-secondary"
        >
          Explore All Features
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
