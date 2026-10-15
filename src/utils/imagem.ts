// src/utils/imagem.ts

/**
 * Converte uma `image_url` devolvida pelo backend numa URL absoluta.
 *
 * - URLs externas (http/https) → devolvidas como estão.
 * - URLs relativas (`/static/...`) → prefixadas com `VITE_API_URL`.
 * - Valor vazio/null → `undefined`.
 */
export function resolveImageUrl(
  imageUrl?: string | null
): string | undefined {
  if (!imageUrl) return undefined
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${base}${path}`
}