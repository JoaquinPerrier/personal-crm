"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { siteImageUrl } from "@/lib/site-images";

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
  const [resolvedSrc, setResolvedSrc] = useState(() => siteImageUrl(src));

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    // En dev, forzar recarga al cambiar el archivo (mismo nombre)
    if (process.env.NODE_ENV === "development") {
      setResolvedSrc(`${siteImageUrl(src)}&t=${Date.now()}`);
    } else {
      setResolvedSrc(siteImageUrl(src));
    }
  }, [src]);

  if (failed) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={className}>
      {!loaded && fallback}
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        className={`${imageClassName} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
