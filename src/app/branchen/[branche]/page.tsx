import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSectors, getSectorBySlug } from "@/lib/data";
import { KvCard } from "@/components/KvCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 86400;

export function generateStaticParams() {
  return getSectors().map((s) => ({ branche: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branche: string }>;
}): Promise<Metadata> {
  const { branche } = await params;
  const sector = getSectorBySlug(branche);
  if (!sector) return {};
  // Sector landing is indexable only with >= 3 KVs (quality gate rule 1).
  const indexable = sector.kvs.length >= 3;
  return {
    title: `Kollektivverträge ${sector.sector}`,
    description: `Alle erfassten Kollektivverträge der Branche ${sector.sector} mit Mindestgehältern, Einstufung und offiziellen Quellen.`,
    alternates: { canonical: absoluteUrl(`/branchen/${sector.slug}`) },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ branche: string }>;
}) {
  const { branche } = await params;
  const sector = getSectorBySlug(branche);
  if (!sector) notFound();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Kollektivverträge ${sector.sector}`,
    itemListElement: sector.kvs.map((kv, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/kv/${kv.slug}`),
      name: kv.name,
    })),
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: "Branchen", href: "/branchen" },
          { name: sector.sector, href: `/branchen/${sector.slug}` },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kollektivverträge: {sector.sector}</h1>
        <p className="text-ink-soft">{sector.kvs.length} erfasste Kollektivverträge in dieser Branche.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sector.kvs.map((kv) => (
          <li key={kv.id}>
            <KvCard kv={kv} />
          </li>
        ))}
      </ul>
      <JsonLd data={itemList} />
    </div>
  );
}
