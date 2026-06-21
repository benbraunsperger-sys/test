import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadAllKvs, getKvBySlug, getCurrentPeriod } from "@/lib/data";
import { getIndexability } from "@/lib/indexability";
import { sectorSlug } from "@/lib/vocab";
import { absoluteUrl } from "@/lib/site";
import { formatDate, formatEUR } from "@/lib/format";
import { isKnownAmount } from "@/lib/calc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

export function generateStaticParams() {
  return loadAllKvs().flatMap((kv) =>
    kv.groups.map((g) => ({ slug: kv.slug, code: encodeURIComponent(g.code) })),
  );
}

function resolve(slug: string, code: string) {
  const kv = getKvBySlug(slug);
  if (!kv) return null;
  const group = kv.groups.find((g) => g.code === decodeURIComponent(code));
  return group ? { kv, group } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}): Promise<Metadata> {
  const { slug, code } = await params;
  const r = resolve(slug, code);
  if (!r) return {};
  const { kv, group } = r;
  const canonical = absoluteUrl(`/kv/${kv.slug}/verwendungsgruppe/${encodeURIComponent(group.code)}`);
  // Indexable only if the KV is publicly indexable AND the group is non-thin
  // (its own criteria + >= 2 steps make it a genuinely distinct page).
  const distinct = group.criteriaSummary.length > 0 && group.steps.length >= 2;
  const indexable = getIndexability(kv).indexable && distinct;
  return {
    title: `${kv.shortName ?? kv.name}: Gruppe ${group.code} – Gehalt & Stufen`.slice(0, 70),
    description:
      `Mindestgehälter und Stufen der Verwendungsgruppe ${group.code} im ${kv.name}. Einstufungskriterien und offizielle Quelle.`.slice(
        0,
        170,
      ),
    alternates: { canonical },
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ slug: string; code: string }>;
}) {
  const { slug, code } = await params;
  const r = resolve(slug, code);
  if (!r) notFound();
  const { kv, group } = r;
  const period = getCurrentPeriod(kv);
  const siblings = kv.groups.filter((g) => g.code !== group.code);

  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: kv.sector, href: `/branchen/${sectorSlug(kv.sector)}` },
          { name: kv.shortName ?? kv.name, href: `/kv/${kv.slug}` },
          { name: `Gruppe ${group.code}`, href: `/kv/${kv.slug}/verwendungsgruppe/${encodeURIComponent(group.code)}` },
        ]}
      />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {group.code}
          {group.name ? ` – ${group.name}` : ""}
        </h1>
        <p className="text-sm text-ink-muted">
          Im {kv.name} · gültig ab {formatDate(period.validFrom)} · zuletzt geprüft {formatDate(kv.lastChecked)}
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Einstufungskriterien</h2>
        <p className="max-w-prose text-ink-soft">{group.criteriaSummary}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Stufen &amp; Mindestbeträge</h2>
        <table className="kv-table max-w-lg">
          <thead>
            <tr>
              <th scope="col">Stufe</th>
              <th scope="col">Mindestbetrag</th>
              <th scope="col">gültig ab</th>
            </tr>
          </thead>
          <tbody>
            {group.steps.map((s) => (
              <tr key={`${s.stepLabel}-${s.validFrom}`}>
                <th scope="row">{s.stepLabel}</th>
                <td className="num">{isKnownAmount(s.minSalaryEUR) ? formatEUR(s.minSalaryEUR) : "wird geprüft"}</td>
                <td>{formatDate(s.validFrom)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm">
          <Link href={`/tools/kv-mindest-check?kv=${kv.slug}`} className="text-brand-600 hover:underline">
            Mein Gehalt gegen diese Gruppe prüfen →
          </Link>
        </p>
      </section>

      {siblings.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Weitere Gruppen in diesem KV</h2>
          <ul className="flex flex-wrap gap-2">
            {siblings.map((g) => (
              <li key={g.code}>
                <Link
                  href={`/kv/${kv.slug}/verwendungsgruppe/${encodeURIComponent(g.code)}`}
                  className="inline-block rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm hover:border-brand-500"
                >
                  {g.code}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link href={`/kv/${kv.slug}`} className="text-brand-600 hover:underline">
              Zur vollständigen Gehaltstabelle →
            </Link>
          </p>
        </section>
      )}

      <Disclaimer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [kv.name, `Gruppe ${group.code}`].map((n, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: n,
          })),
        }}
      />
    </article>
  );
}
