import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCalcData } from "@/lib/calcData";
import { VorrueckungRechner } from "@/components/calc/VorrueckungRechner";

export const metadata: Metadata = {
  title: "Vorrückungs-Rechner",
  description: "Gruppe, Startstufe und Startdatum eingeben — Zeitleiste der künftigen Stufensprünge und Mindestgehälter. Schätzung, im KV prüfen.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ kv?: string }> }) {
  const { kv } = await searchParams;
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Tools", href: "/tools/kv-mindest-check" }, { name: "Vorrückungs-Rechner", href: "/tools/vorrueckung" }]} />
      <h1 className="text-3xl font-bold tracking-tight">Vorrückungs-Rechner</h1>
      <p className="max-w-prose text-ink-soft">
        Aus Gruppe, Eintrittsdatum und bereits anrechenbaren Jahren eine Zeitleiste der künftigen
        Stufensprünge ableiten. Wo Jahresgrenzen noch nicht strukturiert erfasst sind, zeigen wir die
        Stufenleiter.
      </p>
      <VorrueckungRechner kvs={getCalcData()} initialSlug={kv} />
    </div>
  );
}
