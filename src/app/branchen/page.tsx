import type { Metadata } from "next";
import Link from "next/link";
import { getSectors } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Branchen",
  description: "Kollektivverträge nach Branche: Metallgewerbe, Handel, Information & Consulting und mehr.",
};

export const revalidate = 86400;

export default function BranchenIndexPage() {
  const sectors = getSectors();
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Branchen", href: "/branchen" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Branchen</h1>
        <p className="text-ink-soft">Kollektivverträge nach Wirtschaftsbereich.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/branchen/${s.slug}`}
              className="flex items-center justify-between rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500"
            >
              <span className="font-medium">{s.sector}</span>
              <span className="text-sm text-ink-muted">{s.kvs.length} KV</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
