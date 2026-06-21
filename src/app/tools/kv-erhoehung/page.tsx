import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCalcData } from "@/lib/calcData";
import { KvErhoehungRechner } from "@/components/calc/KvErhoehungRechner";

export const metadata: Metadata = {
  title: "KV-Erhöhungs-Rechner",
  description: "Aktuelles Bruttogehalt eingeben, KV und Jahr wählen — die KV/IST-Erhöhung (inkl. Deckelung) anwenden und das neue Gehalt sehen.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ kv?: string }> }) {
  const { kv } = await searchParams;
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Tools", href: "/tools/kv-mindest-check" }, { name: "KV-Erhöhungs-Rechner", href: "/tools/kv-erhoehung" }]} />
      <h1 className="text-3xl font-bold tracking-tight">KV-Erhöhungs-Rechner</h1>
      <p className="max-w-prose text-ink-soft">
        Aktuelles Bruttogehalt eingeben, KV und Zeitraum wählen und die KV- bzw. IST-Erhöhung (mit
        etwaiger Deckelung) anwenden. Schätzung zur Orientierung.
      </p>
      <KvErhoehungRechner kvs={getCalcData()} initialSlug={kv} />
    </div>
  );
}
