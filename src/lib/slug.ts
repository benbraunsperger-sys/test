/** Deterministic, German-aware slug generation (shared by KVs and pairs). */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "-und-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Canonical, order-independent comparison slug for a KV pair so that
 * /vergleich/a-vs-b and /vergleich/b-vs-a resolve to one canonical URL.
 */
export function comparisonSlug(slugA: string, slugB: string): string {
  return [slugA, slugB].sort().join("-vs-");
}

export function parseComparisonSlug(slug: string): [string, string] | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}
