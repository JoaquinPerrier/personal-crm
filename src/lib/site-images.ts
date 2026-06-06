/** Rutas de imágenes estáticas — archivos en public/images/ */
export const siteImages = {
  /** Subí este número cuando reemplazés una imagen con el mismo nombre (prod/CDN) */
  cacheVersion: "1",
  home: {
    hero: "/images/home/hero.png",
    atriumDeepDetails: "/images/home/atrium-deep-details.jpg",
    opportunities: "/images/home/opportunities.jpg",
  },
} as const;

export function siteImageUrl(path: string): string {
  return `${path}?v=${siteImages.cacheVersion}`;
}
