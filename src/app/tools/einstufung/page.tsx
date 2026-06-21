import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCalcData } from "@/lib/calcData";
import { EinstufungAssistent } from "@/components/calc/EinstufungAssistent";

export const metadata: Metadata = {
  title: "Einstufungs-Assistent",
  description: "Tätigkeit, Ausbildung und Vordienstzeiten angeben — Vorschlag für die wahrscheinliche Verwendungsgruppe und Stufe. Im KV prüfen.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ kv?: string }> }) {
  const { kv } = await searchParams;
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Tools", href: "/tools/kv-mindest-check" }, { name: "Einstufungs-Assistent", href: "/tools/einstufung" }]} />
      <h1 className="text-3xl font-bold tracking-tight">Einstufungs-Assistent</h1>
      <p className="max-w-prose text-ink-soft">
        Ein paar Fragen beantworten und einen Vorschlag für Verwendungsgruppe, Stufe und das
        resultierende Mindestgehalt erhalten — als Orientierung, nicht als verbindliche Einstufung.
      </p>
      <EinstufungAssistent kvs={getCalcData()} initialSlug={kv} />
    </div>
  );
}
