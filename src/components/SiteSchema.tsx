import { JsonLd } from "./JsonLd";
import { SITE, absoluteUrl } from "@/lib/site";

/** Organization + WebSite (with SearchAction) — emitted once in the root layout. */
export function SiteSchema() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.tagline,
    areaServed: { "@type": "Country", name: "Österreich" },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "de-AT",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/kollektivvertraege?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <>
      <JsonLd data={org} />
      <JsonLd data={website} />
    </>
  );
}
