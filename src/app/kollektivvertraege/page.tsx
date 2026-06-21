import type { Metadata } from "next";
import { loadAllKvs } from "@/lib/data";
import { KvCard } from "@/components/KvCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Alle Kollektivverträge",
  description:
    "Verzeichnis österreichischer Kollektivverträge mit Mindestgehältern, Einstufung und Quellen. Nach Branche, Angestellte/Arbeiter und Status filterbar.",
};

export const revalidate = 86400;

/** Phase 1: simple directory. Phase 2 adds facets (Branche, Typ, Status, Bundesland). */
export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const all = loadAllKvs();
  const query = (q ?? "").trim().toLowerCase();
  const kvs = query
    ? all.filter((kv) =>
        [kv.name, kv.shortName, kv.sector, kv.employeeType]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : all;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ name: "Start", href: "/" }, { name: "Kollektivverträge", href: "/kollektivvertraege" }]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Kollektivverträge</h1>
        <p className="text-ink-soft">
          {kvs.length} {kvs.length === 1 ? "Kollektivvertrag" : "Kollektivverträge"}
          {query ? ` für „${q}"` : ""}.
        </p>
      </header>

      <form action="/kollektivvertraege" className="flex max-w-xl gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Filtern: Branche, KV-Name…"
          className="flex-1 rounded-md border border-surface-border px-4 py-2"
          aria-label="Kollektivvertrag filtern"
        />
        <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700">
          Filtern
        </button>
      </form>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kvs.map((kv) => (
          <li key={kv.id}>
            <KvCard kv={kv} />
          </li>
        ))}
      </ul>
    </div>
  );
}
