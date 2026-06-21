import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RATGEBER } from "@/content/ratgeber";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: "Kompakt erklärt: Kollektivvertrag, Einstufung, Verwendungsgruppen, Vorrückung, KV- vs. IST-Gehalt, Lehrlingseinkommen.",
  alternates: { canonical: absoluteUrl("/ratgeber") },
};

export default function RatgeberIndex() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Ratgeber", href: "/ratgeber" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ratgeber</h1>
        <p className="text-ink-soft">Die wichtigsten Grundlagen rund um Kollektivverträge — kompakt und in eigenen Worten.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {RATGEBER.map((a) => (
          <li key={a.slug}>
            <Link href={`/ratgeber/${a.slug}`} className="block h-full rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500">
              <h2 className="font-semibold text-ink">{a.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
