import Link from "next/link";

export default function KinshipLogo({ size = 24 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
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
  );
}
