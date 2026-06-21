import Link from "next/link";
import { loadAllKvs, getSectors } from "@/lib/data";
import { getCurrentPeriod } from "@/lib/data";
import { SITE } from "@/lib/site";
import { Badge, StatusBadge } from "@/components/Badge";
import { formatDate, formatPercent } from "@/lib/format";

export const revalidate = 86400; // daily ISR; validity transitions refresh.

const TRUST = [
  "Strukturierte Fakten statt PDF-Wüste",
  "Immer mit offizieller Quelle",
  "Sichtbares „zuletzt geprüft“-Datum",
  "Kostenlos & ohne Login",
];

const TOOLS = [
  { href: "/tools/einstufung", title: "Einstufungs-Assistent", desc: "Tätigkeit & Jahre → wahrscheinliche Verwendungsgruppe." },
  { href: "/tools/kv-mindest-check", title: "KV-Mindest-Check", desc: "Liegt mein Gehalt über dem KV-Mindestgehalt?" },
  { href: "/tools/vorrueckung", title: "Vorrückungs-Rechner", desc: "Wann steige ich in die nächste Stufe?" },
  { href: "/tools/kv-erhoehung", title: "KV-Erhöhungs-Rechner", desc: "Aktuelle KV/IST-Erhöhung auf dein Gehalt anwenden." },
];

export default function HomePage() {
  const kvs = loadAllKvs();
  const sectors = getSectors();
  const recent = [...kvs]
    .sort((a, b) => b.lastChecked.localeCompare(a.lastChecked))
    .slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Kollektivvertrags-Gehaltstabellen Österreich – klar, strukturiert, mit Quelle
        </h1>
        <p className="max-w-prose text-lg text-ink-soft">{SITE.tagline}</p>
        <form action="/kollektivvertraege" className="flex max-w-xl gap-2">
          <input
            type="search"
            name="q"
            placeholder="KV suchen, z. B. Metallgewerbe, Handel, IT…"
            className="flex-1 rounded-md border border-surface-border px-4 py-2.5"
            aria-label="Kollektivvertrag suchen"
          />
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            Suchen
          </button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {TRUST.map((t) => (
            <li key={t}>
              <Badge tone="neutral">{t}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-h" className="space-y-4">
        <h2 id="recent-h" className="text-xl font-semibold">
          Neue &amp; aktualisierte Abschlüsse
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((kv) => {
            const period = getCurrentPeriod(kv);
            return (
              <li key={kv.id}>
                <Link
                  href={`/kv/${kv.slug}`}
                  className="block h-full rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <StatusBadge status={period.status} />
                    {period.increaseKVPercent != null && (
                      <Badge tone="brand">+{formatPercent(period.increaseKVPercent)} KV</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold leading-snug text-ink">{kv.shortName ?? kv.name}</h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {kv.sector} · {kv.employeeType} · zuletzt geprüft {formatDate(kv.lastChecked)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="sectors-h" className="space-y-4">
        <h2 id="sectors-h" className="text-xl font-semibold">
          Top-Branchen
        </h2>
        <ul className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/branchen/${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm hover:border-brand-500"
              >
                {s.sector}
                <span className="text-ink-muted">{s.kvs.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tools-h" className="space-y-4">
        <h2 id="tools-h" className="text-xl font-semibold">
          Rechner &amp; Assistenten
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="block rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500"
              >
                <h3 className="font-semibold text-ink">{t.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{t.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
