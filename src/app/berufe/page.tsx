import type { Metadata } from "next";
import Link from "next/link";
import { loadAllBerufe, getBerufIndexability } from "@/lib/berufe";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/Badge";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Berufe & Gehälter nach Kollektivvertrag",
  description:
    "Was verdient mein Beruf laut KV? Berufe von Einzelhandelskaufmann bis Mechatroniker — mit KV-Mindestgehalt, Einstufung und offizieller Quelle.",
  alternates: { canonical: absoluteUrl("/berufe") },
};

export const revalidate = 86400;

export default function BerufeIndex() {
  const berufe = loadAllBerufe();
  const bySector = new Map<string, typeof berufe>();
  for (const b of berufe) {
    bySector.set(b.sector, [...(bySector.get(b.sector) ?? []), b]);
  }

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Berufe nach Kollektivvertrag",
    numberOfItems: berufe.length,
    itemListElement: berufe.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/beruf/${b.slug}`),
      name: b.name,
    })),
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Berufe", href: "/berufe" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Berufe &amp; Gehälter</h1>
        <p className="text-ink-soft">
          So findest du vom Beruf zum passenden Kollektivvertrag und KV-Mindestgehalt.
        </p>
      </header>

      {[...bySector.entries()].map(([sector, list]) => (
        <section key={sector} className="space-y-3">
          <h2 className="text-xl font-semibold">{sector}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => {
              const idx = getBerufIndexability(b).indexable;
              return (
                <li key={b.id}>
                  <Link href={`/beruf/${b.slug}`} className="block h-full rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500">
                    <div className="mb-1 flex items-center gap-2">
                      {!idx && <Badge tone="warn">in Prüfung</Badge>}
                    </div>
                    <h3 className="font-semibold leading-snug text-ink">{b.name}</h3>
                    {b.synonyms.length > 0 && (
                      <p className="mt-1 text-xs text-ink-muted">{b.synonyms.slice(0, 3).join(" · ")}</p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <JsonLd data={itemList} />
    </div>
  );
}
