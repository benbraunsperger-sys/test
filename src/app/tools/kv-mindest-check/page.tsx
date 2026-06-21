import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCalcData } from "@/lib/calcData";
import { KvMindestCheck } from "@/components/calc/KvMindestCheck";

export const metadata: Metadata = {
  title: "KV-Mindest-Check",
  description: "Prüfe, ob dein Bruttogehalt über dem KV-Mindestgehalt deiner Gruppe und Stufe liegt. Schätzung, keine Beratung.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ kv?: string }> }) {
  const { kv } = await searchParams;
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Tools", href: "/tools/kv-mindest-check" }, { name: "KV-Mindest-Check", href: "/tools/kv-mindest-check" }]} />
      <h1 className="text-3xl font-bold tracking-tight">KV-Mindest-Check</h1>
      <p className="max-w-prose text-ink-soft">
        KV, Gruppe und Stufe wählen, Bruttogehalt eingeben — und sehen, ob du über oder unter dem
        KV-Mindestgehalt liegst. Die Eingaben bleiben lokal in deinem Browser.
      </p>
      <KvMindestCheck kvs={getCalcData()} initialSlug={kv} />
    </div>
  );
}
