function SparkleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-secondary"
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="currentColor"
      />
      <path
        d="M19 15L19.75 17.25L22 18L19.75 18.75L19 21L18.25 18.75L16 18L18.25 17.25L19 15Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

export default function DigitalAtrium() {
  return (
    <section id="philosophy" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Title & Description */}
        <div className="max-w-lg">
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
            The Digital Atrium
          </h2>
          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            A traditional CRM is a warehouse for data. The Atrium is a sanctuary
            for relationships. We reject the high-velocity noise of social media
            in favor of structural grace and rhythmic connection flow.
          </p>
        </div>

        {/* Feature bullets */}
        <div className="mt-10 space-y-6">
          <div className="flex items-start gap-4">
            <SparkleIcon />
            <div>
              <h3 className="font-heading text-base font-bold text-text">
                Intentional Asymmetry
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Designed to mimic the organic flow of human conversation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <SparkleIcon />
            <div>
              <h3 className="font-heading text-base font-bold text-text">
                Tonal Layering
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                Focus on depth through light and color, not rigid lines.
              </p>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {/* Card 1 - Nutriture Systematically */}
          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="mt-4 font-heading text-sm font-bold leading-snug text-text md:text-base">
              Nutriture Systematically
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Automated reminders that feel personalized, ensuring no meaningful
              connection goes stale.
            </p>
          </div>

          {/* Card 2 - Deep Details */}
          <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
            {/* Image placeholder */}
            <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-secondary/30 to-tertiary/50">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="text-secondary/50"
              >
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M23 21v-2a4 4 0 0 0-3-3.87"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="p-5">
              <h3 className="font-heading text-sm font-bold leading-snug text-text md:text-base">
                Deep Details
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Capture the aspirations, interests, and small nuances that
                define a true bond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
