"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

interface SiteImageProps {
  src: string;
  alt: string;
  fallback: ReactNode;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export default function SiteImage({
  src,
  alt,
  fallback,
  className = "relative",
  imageClassName = "object-cover",
  priority,
  sizes = "100vw",
}: SiteImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={className}>
      {!loaded && fallback}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`${imageClassName} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
