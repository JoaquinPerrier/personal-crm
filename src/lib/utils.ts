export function getTimeAgo(dateStr?: string): string {
  if (!dateStr) return "Never";
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 1) return "This week";
  if (weeks === 1) return "1w ago";
  return `${weeks}w ago`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysSince(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}
