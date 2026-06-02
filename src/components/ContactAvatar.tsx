import { getInitials } from "@/lib/utils";
import type { Contact } from "@/lib/types";

const SIZE_CLASSES = {
  sm: { box: "h-12 w-12", text: "text-sm" },
  md: { box: "h-14 w-14", text: "text-lg" },
} as const;

interface ContactAvatarProps {
  contact: Pick<Contact, "name" | "photoUrl" | "updatedAt">;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export default function ContactAvatar({
  contact,
  size = "sm",
  className = "",
}: ContactAvatarProps) {
  const { box, text } = SIZE_CLASSES[size];
  const photoSrc = contact.photoUrl
    ? `${contact.photoUrl}${contact.photoUrl.includes("?") ? "&" : "?"}t=${new Date(contact.updatedAt).getTime()}`
    : null;

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt={contact.name}
        className={`${box} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-tertiary font-heading font-bold text-primary ${text} ${className}`}
    >
      {getInitials(contact.name)}
    </div>
  );
}
