import Script from "next/script";

/**
 * Cookieless, privacy-friendly analytics. Self-hosted-friendly (Plausible/Umami
 * style): renders nothing unless NEXT_PUBLIC_ANALYTICS_SRC is set, so the MVP
 * ships zero tracking by default. No cookies, no cross-site identifiers.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!src) return null;
  return (
    <Script
      src={src}
      data-domain={domain}
      strategy="afterInteractive"
      // Most cookieless trackers read data-domain; defer + no cookies by design.
    />
  );
}
