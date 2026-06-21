import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getComparablePairs, getKvBySlug, getCurrentPeriod } from "@/lib/data";
import { getIndexability } from "@/lib/indexability";
import { comparisonSlug, parseComparisonSlug } from "@/lib/slug";
import { absoluteUrl } from "@/lib/site";
import { formatDate, formatEUR, formatPercent } from "@/lib/format";
import { isKnownAmount } from "@/lib/calc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { StatusBadge } from "@/components/Badge";

export const revalidate = 86400;

export function generateStaticParams() {
  return getComparablePairs().map(([a, b]) => ({ paar: comparisonSlug(a.slug, b.slug) }));
}

function resolve(paar: string) {
  const parsed = parseComparisonSlug(paar);
  if (!parsed) return null;
  const a = getKvBySlug(parsed[0]);
  const b = getKvBySlug(parsed[1]);
  if (!a || !b) return null;
  // Only comparable pairs are valid routes.
  const valid = getComparablePairs().some(
    ([x, y]) => x.slug === a.slug && y.slug === b.slug,
  );
  return valid ? { a, b } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paar: string }>;
}): Promise<Metadata> {
  const { paar } = await params;
  const pair = resolve(paar);
  if (!pair) return {};
  const canonical = absoluteUrl(`/vergleich/${comparisonSlug(pair.a.slug, pair.b.slug)}`);
  // Indexable only if both KVs are indexable.
  const indexable = getIndexability(pair.a).indexable && getIndexability(pair.b).indexable;
  const aName = pair.a.shortName ?? pair.a.name;
  const bName = pair.b.shortName ?? pair.b.name;
  return {
    title: `${aName} vs. ${bName} – KV-Vergleich`,
    description: `Kollektivverträge im Vergleich: ${aName} und ${bName} — Gültigkeit, Erhöhungen und Einstufung nebeneinander.`,
    alternates: { canonical },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ paar: string }> }) {
  const { paar } = await params;
  const pair = resolve(paar);
  if (!pair) notFound();
  const { a, b } = pair;
  const pa = getCurrentPeriod(a);
  const pb = getCurrentPeriod(b);

  const Row = ({ label, av, bv }: { label: string; av: React.ReactNode; bv: React.ReactNode }) => (
    <tr>
      <th scope="row" className="text-left font-medium">{label}</th>
      <td>{av}</td>
      <td>{bv}</td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: "Kollektivverträge", href: "/kollektivvertraege" },
          { name: "Vergleich", href: `/vergleich/${comparisonSlug(a.slug, b.slug)}` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">
        {a.shortName ?? a.name} <span className="text-ink-muted">vs.</span> {b.shortName ?? b.name}
      </h1>

      <div className="overflow-x-auto">
        <table className="kv-table">
          <thead>
            <tr>
              <th scope="col">Kriterium</th>
              <th scope="col"><Link href={`/kv/${a.slug}`} className="text-brand-600 hover:underline">{a.shortName ?? a.name}</Link></th>
              <th scope="col"><Link href={`/kv/${b.slug}`} className="text-brand-600 hover:underline">{b.shortName ?? b.name}</Link></th>
            </tr>
          </thead>
          <tbody>
            <Row label="Branche" av={a.sector} bv={b.sector} />
            <Row label="Typ" av={a.employeeType} bv={b.employeeType} />
            <Row label="Status" av={<StatusBadge status={pa.status} />} bv={<StatusBadge status={pb.status} />} />
            <Row label="Gültig ab" av={formatDate(pa.validFrom)} bv={formatDate(pb.validFrom)} />
            <Row
              label="KV-Erhöhung"
              av={pa.increaseKVPercent != null ? formatPercent(pa.increaseKVPercent) : "–"}
              bv={pb.increaseKVPercent != null ? formatPercent(pb.increaseKVPercent) : "–"}
            />
            <Row
              label="Deckelung"
              av={pa.capEUR != null ? formatEUR(pa.capEUR) : "–"}
              bv={pb.capEUR != null ? formatEUR(pb.capEUR) : "–"}
            />
            <Row label="Gruppen erfasst" av={a.groups.length} bv={b.groups.length} />
            <Row label="zuletzt geprüft" av={formatDate(a.lastChecked)} bv={formatDate(b.lastChecked)} />
          </tbody>
        </table>
      </div>

      {(!a.groups.some((g) => g.steps.some((s) => isKnownAmount(s.minSalaryEUR))) ||
        !b.groups.some((g) => g.steps.some((s) => isKnownAmount(s.minSalaryEUR)))) && (
        <p className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm text-warn">
          Hinweis: Für mindestens einen der beiden KV sind die genauen Beträge noch in Prüfung. Der
          Vergleich der Rahmendaten ist dennoch verlässlich.
        </p>
      )}

      <Disclaimer />
    </div>
  );
}
