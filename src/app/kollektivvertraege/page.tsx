import type { Metadata } from "next";
import { buildKvIndex } from "@/lib/searchIndex";
import { loadAllKvs } from "@/lib/data";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alle Kollektivverträge",
  description:
    "Verzeichnis österreichischer Kollektivverträge mit Mindestgehältern, Einstufung und Quellen. Nach Branche, Angestellte/Arbeiter und Status filterbar.",
  alternates: { canonical: absoluteUrl("/kollektivvertraege") },
};

export const revalidate = 86400;

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const index = buildKvIndex();

  // ItemList JSON-LD over the full directory (server-rendered set).
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kollektivverträge",
    numberOfItems: index.length,
    itemListElement: loadAllKvs().map((kv, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/kv/${kv.slug}`),
      name: kv.name,
    })),
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ name: "Start", href: "/" }, { name: "Kollektivverträge", href: "/kollektivvertraege" }]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kollektivverträge</h1>
        <p className="text-ink-soft">
          {index.length} erfasste Kollektivverträge — nach Branche, Typ und Status filterbar.
        </p>
      </header>

      <DirectoryExplorer items={index} initialQuery={q ?? ""} />

      <JsonLd data={itemList} />
    </div>
  );
}
