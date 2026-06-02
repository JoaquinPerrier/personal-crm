"use client";

import { useState, useEffect } from "react";
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
  const [imgError, setImgError] = useState(false);

  const photoSrc = contact.photoUrl
    ? `${contact.photoUrl}${contact.photoUrl.includes("?") ? "&" : "?"}t=${new Date(contact.updatedAt).getTime()}`
    : null;

  useEffect(() => {
    setImgError(false);
  }, [contact.photoUrl, contact.updatedAt]);

  if (photoSrc && !imgError) {
    return (
      <img
        src={photoSrc}
        alt=""
        className={`${box} shrink-0 rounded-full object-cover ${className}`}
        onError={() => setImgError(true)}
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
