export type SupportedCountry = {
  slug: string
  name: string
}

// Keep this small and explicit so routing behavior is predictable.
export const SUPPORTED_COUNTRIES: Record<string, SupportedCountry> = {
  thailand: { slug: 'thailand', name: 'Thailand' },
}

export function getSupportedCountry(slug: string): SupportedCountry | null {
  return SUPPORTED_COUNTRIES[slug] ?? null
}

