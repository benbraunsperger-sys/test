import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  loadAllKvs,
  getKvBySlug,
  getCurrentPeriod,
  getRelatedKvs,
} from "@/lib/data";
import { getIndexability } from "@/lib/indexability";
import { sectorSlug } from "@/lib/vocab";
import { comparisonSlug } from "@/lib/slug";
import { absoluteUrl, SITE } from "@/lib/site";
import { formatDate, formatEUR, formatPercent } from "@/lib/format";
import { Badge, StatusBadge, ConfidenceBadge } from "@/components/Badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { KvTable } from "@/components/KvTable";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

export function generateStaticParams() {
  return loadAllKvs().map((kv) => ({ slug: kv.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const kv = getKvBySlug(slug);
  if (!kv) return {};
  const indexable = getIndexability(kv).indexable;
  const canonical = absoluteUrl(`/kv/${kv.slug}`);
  return {
    title: kv.seo.title,
    description: kv.seo.metaDescription,
    alternates: { canonical },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: kv.seo.title,
      description: kv.seo.metaDescription,
      url: canonical,
      type: "article",
    },
  };
}

export default async function KvPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kv = getKvBySlug(slug);
  if (!kv) notFound();

  const period = getCurrentPeriod(kv);
  const related = getRelatedKvs(kv);
  const { indexable, reasons } = getIndexability(kv);
  const unverified = kv.confidence === "needs-review";
  const history = [...kv.validityPeriods].sort((a, b) => b.validFrom.localeCompare(a.validFrom));

  // JSON-LD: Dataset describing the salary table + breadcrumb is in <Breadcrumbs>.
  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: kv.seo.h1,
    description: kv.seo.metaDescription,
    inLanguage: "de-AT",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: SITE.name },
    dateModified: kv.lastChecked,
    license: "https://www.wko.at",
    url: absoluteUrl(`/kv/${kv.slug}`),
    keywords: [kv.sector, kv.employeeType, "Kollektivvertrag", "Mindestgehalt"],
  };

  return (
    <article className="space-y-10">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: "Kollektivverträge", href: "/kollektivvertraege" },
          { name: kv.sector, href: `/branchen/${sectorSlug(kv.sector)}` },
          { name: kv.shortName ?? kv.name, href: `/kv/${kv.slug}` },
        ]}
      />

      {/* Above the fold */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{kv.sector}</Badge>
          <Badge tone="neutral">{kv.employeeType}</Badge>
          <StatusBadge status={period.status} />
          <ConfidenceBadge confidence={kv.confidence} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{kv.seo.h1}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-soft">
          <span>
            Aktueller Zeitraum: <strong>ab {formatDate(period.validFrom)}</strong>
            {period.validTo ? ` bis ${formatDate(period.validTo)}` : ""}
          </span>
          {period.increaseKVPercent != null && (
            <span>KV-Erhöhung: <strong>{formatPercent(period.increaseKVPercent)}</strong></span>
          )}
          {period.increaseISTPercent != null && (
            <span>IST-Erhöhung: <strong>{formatPercent(period.increaseISTPercent)}</strong></span>
          )}
          <span>zuletzt geprüft: <strong>{formatDate(kv.lastChecked)}</strong></span>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={kv.sourceUrls[0]}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Zum offiziellen KV ↗
          </a>
          <Link
            href={`/tools/kv-mindest-check?kv=${kv.slug}`}
            className="rounded-md border border-surface-border px-4 py-2 text-sm font-medium hover:border-brand-500"
          >
            Gehalt prüfen
          </Link>
        </div>
      </header>

      {unverified && (
        <div role="alert" className="rounded-lg border border-warn/40 bg-warn-soft p-4 text-sm text-warn">
          <strong>Dieser Datensatz wird gerade geprüft.</strong> Rahmendaten (Zeiträume,
          Abschluss-Prozente, Quellen) sind verifiziert; die genauen Gehaltsbeträge werden noch
          aus der offiziellen Gehaltsordnung übertragen und sind als „wird geprüft“ markiert.
          Diese Seite ist daher noch nicht indexiert.{" "}
          <Link href="/korrektur-melden" className="underline">
            Fehler melden
          </Link>
          .
        </div>
      )}

      {/* Kurzüberblick */}
      <section aria-labelledby="ueberblick" className="space-y-3">
        <h2 id="ueberblick" className="text-xl font-semibold">Kurzüberblick</h2>
        <p className="max-w-prose text-ink-soft">{kv.classificationNotes}</p>
        <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-ink">Arbeitgeberseite</dt>
            <dd className="text-ink-soft">{kv.parties.employer.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Arbeitnehmerseite</dt>
            <dd className="text-ink-soft">{kv.parties.unions.join(", ")}</dd>
          </div>
          {kv.region && (
            <div>
              <dt className="font-medium text-ink">Geltungsbereich</dt>
              <dd className="text-ink-soft">{kv.region}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Gehaltstabelle */}
      <section aria-labelledby="tabelle" className="space-y-3">
        <h2 id="tabelle" className="text-xl font-semibold">Aktuelle Gehaltstabelle</h2>
        <p className="text-sm text-ink-muted">
          Mindestgehälter nach Verwendungsgruppe und Stufe, gültig ab {formatDate(period.validFrom)}.
          Beträge in EUR pro Monat, sofern nicht anders angegeben.
        </p>
        <KvTable groups={kv.groups} unverified={unverified} />
      </section>

      {/* Verwendungsgruppen & Einstufung */}
      <section aria-labelledby="einstufung" className="space-y-3">
        <h2 id="einstufung" className="text-xl font-semibold">Verwendungsgruppen &amp; Einstufung</h2>
        <ul className="space-y-3">
          {kv.groups.map((g) => (
            <li key={g.code} className="rounded-lg border border-surface-border bg-surface p-4">
              <h3 className="font-semibold">
                {g.code}
                {g.name ? ` – ${g.name}` : ""}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{g.criteriaSummary}</p>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          <Link href="/ratgeber/einstufung-erklaert" className="text-brand-600 hover:underline">
            Wie funktioniert die Einstufung? →
          </Link>
        </p>
      </section>

      {/* Vorrückung */}
      <section aria-labelledby="vorrueckung" className="space-y-3">
        <h2 id="vorrueckung" className="text-xl font-semibold">Vorrückung</h2>
        <p className="max-w-prose text-ink-soft">
          Innerhalb einer Gruppe steigt das Mindestgehalt mit den Verwendungsgruppen- bzw.
          Berufsjahren. Den genauen Zeitpunkt der nächsten Stufe berechnet der{" "}
          <Link href={`/tools/vorrueckung?kv=${kv.slug}`} className="text-brand-600 hover:underline">
            Vorrückungs-Rechner
          </Link>
          .
        </p>
      </section>

      {/* Lehrlingseinkommen */}
      {kv.apprenticePay && kv.apprenticePay.length > 0 && (
        <section aria-labelledby="lehrlinge" className="space-y-3">
          <h2 id="lehrlinge" className="text-xl font-semibold">Lehrlingseinkommen</h2>
          <table className="kv-table max-w-md">
            <thead>
              <tr>
                <th scope="col">Lehrjahr</th>
                <th scope="col">Betrag / Monat</th>
                <th scope="col">gültig ab</th>
              </tr>
            </thead>
            <tbody>
              {kv.apprenticePay.map((a) => (
                <tr key={a.year}>
                  <th scope="row">{a.year}. Lehrjahr</th>
                  <td className="num">{formatEUR(a.amountEUR)}</td>
                  <td>{formatDate(a.validFrom)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Zulagen */}
      {kv.allowances && kv.allowances.length > 0 && (
        <section aria-labelledby="zulagen" className="space-y-3">
          <h2 id="zulagen" className="text-xl font-semibold">Wichtige Zulagen</h2>
          <ul className="space-y-1 text-sm text-ink-soft">
            {kv.allowances.map((z) => (
              <li key={z.name}>
                {z.name}: <strong>{formatEUR(z.amountEUR)}</strong> / {z.basis} (ab{" "}
                {formatDate(z.validFrom)})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Verlauf */}
      <section aria-labelledby="verlauf" className="space-y-3">
        <h2 id="verlauf" className="text-xl font-semibold">Verlauf</h2>
        <ul className="space-y-2 text-sm">
          {history.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-2">
              <StatusBadge status={p.status} />
              <span>
                ab {formatDate(p.validFrom)}
                {p.validTo ? ` – ${formatDate(p.validTo)}` : ""}
              </span>
              {p.increaseKVPercent != null && (
                <span className="text-ink-muted">(+{formatPercent(p.increaseKVPercent)} KV)</span>
              )}
              <a
                href={p.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand-600 hover:underline"
              >
                Quelle ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Ähnliche KVs */}
      {related.length > 0 && (
        <section aria-labelledby="aehnliche" className="space-y-3">
          <h2 id="aehnliche" className="text-xl font-semibold">Ähnliche Kollektivverträge</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href={`/kv/${r.slug}`}
                  className="inline-block rounded-full border border-surface-border bg-surface px-3 py-1.5 hover:border-brand-500"
                >
                  {r.shortName ?? r.name}
                </Link>
                {r.employeeType === kv.employeeType && (
                  <Link
                    href={`/vergleich/${comparisonSlug(kv.slug, r.slug)}`}
                    className="text-brand-600 hover:underline"
                  >
                    vergleichen →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Quellen */}
      <section aria-labelledby="quellen" className="space-y-3">
        <h2 id="quellen" className="text-xl font-semibold">Quellen</h2>
        <ul className="space-y-1 text-sm">
          {kv.sourceUrls.map((u) => (
            <li key={u}>
              <a
                href={u}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-brand-600 hover:underline"
              >
                {u}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-ink-muted">Stand / zuletzt geprüft: {formatDate(kv.lastChecked)}</p>
      </section>

      <Disclaimer />

      {/* Build-time transparency: only rendered in dev to aid QA. */}
      {process.env.NODE_ENV !== "production" && !indexable && (
        <p className="text-xs text-ink-muted">
          Debug (nur dev): noindex – {reasons.join("; ")}
        </p>
      )}

      <JsonLd data={datasetLd} />
    </article>
  );
}
