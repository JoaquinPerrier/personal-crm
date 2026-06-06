# Imágenes del sitio

Colocá acá los archivos estáticos de la app. Next.js los sirve en `/images/...`.

## Estructura

```
public/images/
├── home/          → Landing (/)
└── common/        → Logo, íconos, etc. (futuro)
```

## Home (`public/images/home/`)

| Archivo | Dónde aparece | Proporción sugerida |
|---------|---------------|---------------------|
| `hero.jpg` | Sección principal (Hero) | 4:3 (~800×600) |
| `atrium-deep-details.jpg` | Tarjeta "Deep Details" | ~16:11 (~640×440) |
| `opportunities.jpg` | Banner "Proactive Opportunities" | 16:10 (~1280×800) |

Podés usar `.webp` o `.png` si preferís — actualizá la extensión en `src/lib/site-images.ts`.

## Cómo agregar una imagen

1. Copiá el archivo a la carpeta correspondiente con el nombre de la tabla.
2. Guardá. En dev, recargá la página; no hace falta reiniciar el servidor.
3. Si el archivo no existe, se muestra el placeholder de gradiente.
4. **Si reemplazás una imagen con el mismo nombre** y ves la vieja:
   - En dev: recargá la página (Ctrl+Shift+R si hace falta).
   - En producción: subí `cacheVersion` en `src/lib/site-images.ts` (ej. `"1"` → `"2"`).

## Tips

- Comprimí imágenes grandes (TinyPNG, Squoosh) para que la home cargue rápido.
- En producción (Vercel), estos archivos se despliegan con el repo.
