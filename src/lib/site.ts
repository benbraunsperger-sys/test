/** Site-wide constants. TODO: replace with final brand + production domain. */
export const SITE = {
  name: "KV-Radar",
  // TODO(owner): set the real production domain before launch.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kv-radar.example",
  tagline:
    "Strukturierte Datenbank österreichischer Kollektivvertrags-Mindestgehälter — kostenlos, schnell, mit Quellenangabe.",
  locale: "de-AT",
  defaultDisclaimerShort:
    "Informationscharakter, keine Rechts-, Steuer- oder Gehaltsberatung. Maßgeblich ist der offizielle Kollektivvertrag. Angaben ohne Gewähr.",
} as const;

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE.url).toString();
}
