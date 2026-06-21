import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadAllBerufe, getBerufBySlug, resolveBeruf, getBerufIndexability, getRelatedBerufe } from "@/lib/berufe";
import { getCurrentPeriod } from "@/lib/data";
import { absoluteUrl, SITE } from "@/lib/site";
import { formatDate, formatEUR } from "@/lib/format";
import { isKnownAmount } from "@/lib/calc";
import { Badge } from "@/components/Badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

const YEAR = "2026";

export function generateStaticParams() {
  return loadAllBerufe().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const beruf = getBerufBySlug(slug);
  if (!beruf) return {};
  const indexable = getBerufIndexability(beruf).indexable;
  const canonical = absoluteUrl(`/beruf/${beruf.slug}`);
  return {
    title: `${beruf.name} Gehalt Österreich 2026 – KV-Mindestlohn`.slice(0, 70),
    description:
      `Wie viel verdient ein/e ${beruf.name} laut Kollektivvertrag? KV-Mindestgehalt, Einstufung und Verwendungsgruppe — mit offizieller Quelle.`.slice(
        0,
        170,
      ),
    alternates: { canonical },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: { title: `${beruf.name} Gehalt 2026`, description: `KV-Mindestgehalt für ${beruf.name}.`, type: "article" },
  };
}

export default async function BerufPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beruf = getBerufBySlug(slug);
  if (!beruf) notFound();
  const { primaryKv, groups } = resolveBeruf(beruf);
  const related = getRelatedBerufe(beruf);
  const { indexable, reasons } = getBerufIndexability(beruf);

  const knownEntries = groups.map((g) => g.entryEUR).filter((v): v is number => v != null && v > 0);
  const lowestEntry = knownEntries.length ? Math.min(...knownEntries) : undefined;

  const occupationLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: beruf.name,
    description: `Kollektivvertragliche Mindestgehälter für ${beruf.name} in Österreich.`,
    occupationLocation: { "@type": "Country", name: "Österreich" },
  };
  if (lowestEntry != null && primaryKv) {
    occupationLd.estimatedSalary = [
      {
        "@type": "MonetaryAmountDistribution",
        name: "KV-Mindestgehalt (Einstieg)",
        currency: "EUR",
        unitText: "MONTH",
        median: lowestEntry,
      },
    ];
  }

  return (
    <article className="space-y-8">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: "Berufe", href: "/berufe" },
          { name: beruf.name, href: `/beruf/${beruf.slug}` },
        ]}
      />
      <header className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{beruf.sector}</Badge>
          {!indexable && <Badge tone="warn">in Prüfung</Badge>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{beruf.name}: Gehalt in Österreich {YEAR}</h1>
        <p className="max-w-prose text-ink-soft">
          Was ein/e {beruf.name} laut Kollektivvertrag mindestens verdient, richtet sich nach der
          Einstufung im zuständigen KV. Hier die wahrscheinliche Verwendungsgruppe und das daraus
          resultierende KV-Mindestgehalt — als Orientierung, nicht als verbindliche Zusage.
        </p>
      </header>

      {/* Resolution */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">KV-Mindestgehalt &amp; Einstufung</h2>
        {primaryKv ? (
          <p className="text-sm text-ink-soft">
            Zuständiger Kollektivvertrag:{" "}
            <Link href={`/kv/${primaryKv.slug}`} className="text-brand-600 hover:underline">
              {primaryKv.name}
            </Link>{" "}
            · Stand {formatDate(primaryKv.lastChecked)}.
          </p>
        ) : (
          <p className="text-sm text-warn">Zuständiger KV noch nicht zugeordnet.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((rg) => {
            const period = getCurrentPeriod(rg.kv);
            return (
              <div key={`${rg.kv.id}-${rg.group.code}`} className="rounded-lg border border-surface-border bg-surface p-4">
                <h3 className="font-semibold">
                  <Link href={`/kv/${rg.kv.slug}/verwendungsgruppe/${encodeURIComponent(rg.group.code)}`} className="hover:text-brand-600">
                    Gruppe {rg.group.code}
                    {rg.group.name ? ` – ${rg.group.name}` : ""}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-ink-muted">{rg.rationale}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">Einstieg</dt>
                    <dd className="font-mono">{rg.entryEUR && isKnownAmount(rg.entryEUR) ? formatEUR(rg.entryEUR) : "wird geprüft"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">mit Erfahrung</dt>
                    <dd className="font-mono">{rg.experiencedEUR && isKnownAmount(rg.experiencedEUR) ? formatEUR(rg.experiencedEUR) : "wird geprüft"}</dd>
                  </div>
                  <div className="text-xs text-ink-muted">gültig ab {formatDate(period.validFrom)}</div>
                </dl>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {primaryKv && (
            <Link href={`/tools/kv-mindest-check?kv=${primaryKv.slug}`} className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
              Mein Gehalt prüfen
            </Link>
          )}
          {primaryKv && (
            <Link href={`/kv/${primaryKv.slug}`} className="rounded-md border border-surface-border px-4 py-2 text-sm font-medium hover:border-brand-500">
              Vollständige Gehaltstabelle
            </Link>
          )}
        </div>
      </section>

      {beruf.notes && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Gut zu wissen</h2>
          <p className="max-w-prose text-sm text-ink-soft">{beruf.notes}</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Ähnliche Berufe</h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((b) => (
              <li key={b.id}>
                <Link href={`/beruf/${b.slug}`} className="inline-block rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm hover:border-brand-500">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Disclaimer />

      {process.env.NODE_ENV !== "production" && !indexable && (
        <p className="text-xs text-ink-muted">Debug (nur dev): noindex – {reasons.join("; ")}</p>
      )}

      <JsonLd data={occupationLd} />
    </article>
  );
}
