"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { api, ApiClientError } from "@/lib/api-client";
import { getInitials } from "@/lib/utils";
import { validatePhotoFile } from "@/lib/photo-utils";
import type { Contact } from "@/lib/types";

interface ContactPhotoProps {
  contact: Contact;
  onUpdated: (contact: Contact) => void;
  size?: "md" | "lg";
}

export default function ContactPhoto({
  contact,
  onUpdated,
  size = "lg",
}: ContactPhotoProps) {
  const { t } = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  const dimensions = size === "lg" ? "h-28 w-28" : "h-12 w-12";
  const textSize = size === "lg" ? "text-3xl" : "text-sm";
  const photoSrc = contact.photoUrl
    ? `${contact.photoUrl}${contact.photoUrl.includes("?") ? "&" : "?"}t=${new Date(contact.updatedAt).getTime()}`
    : null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validatePhotoFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setError("");
    setUploading(true);
    try {
      const { contact: updated } = await api.uploadContactPhoto(contact.id, file);
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemove() {
    if (!contact.photoUrl) return;
    setError("");
    setRemoving(true);
    try {
      const { contact: updated } = await api.removeContactPhoto(contact.id);
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t("common.error"));
    } finally {
      setRemoving(false);
    }
  }

  const busy = uploading || removing;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          disabled={busy}
          className={`group relative overflow-hidden rounded-2xl bg-tertiary shadow-lg transition-opacity ${dimensions} ${busy ? "opacity-60" : "hover:ring-2 hover:ring-primary/40"}`}
          aria-label={t("detail.changePhoto")}
        >
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={contact.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={`flex h-full w-full items-center justify-center font-heading font-bold text-primary ${textSize}`}>
              {getInitials(contact.name)}
            </span>
          )}

          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            {!busy && (
              <svg
                width={size === "lg" ? 24 : 16}
                height={size === "lg" ? 24 : 16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </span>

          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </span>
          )}
        </button>

        {!busy && (
          <span
            className="pointer-events-none absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-md"
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="mt-3 text-xs text-text-light">{t("detail.photoHint")}</p>

      {contact.photoUrl && !busy && (
        <button
          type="button"
          onClick={handleRemove}
          className="mt-2 text-xs font-semibold text-text-secondary transition-colors hover:text-red-600"
        >
          {t("detail.removePhoto")}
        </button>
      )}

      {error && (
        <p className="mt-2 max-w-xs text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
