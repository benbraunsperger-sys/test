import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Prose } from "@/components/Prose";
import { JsonLd } from "@/components/JsonLd";
import { RATGEBER, getRatgeber } from "@/content/ratgeber";
import { absoluteUrl, SITE } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const revalidate = 86400;

export function generateStaticParams() {
  return RATGEBER.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getRatgeber(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: absoluteUrl(`/ratgeber/${a.slug}`) },
    openGraph: { title: a.title, description: a.description, type: "article" },
  };
}

export default async function RatgeberArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getRatgeber(slug);
  if (!a) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.h1,
    description: a.description,
    inLanguage: "de-AT",
    datePublished: a.updated,
    dateModified: a.updated,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <>
      <Prose
        title={a.h1}
        intro={a.description}
        crumbs={[
          { name: "Start", href: "/" },
          { name: "Ratgeber", href: "/ratgeber" },
          { name: a.title, href: `/ratgeber/${a.slug}` },
        ]}
      >
        {a.sections.map((s) => (
          <section key={s.h2}>
            <h2>{s.h2}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        {a.relatedTools && a.relatedTools.length > 0 && (
          <section>
            <h2>Passend dazu</h2>
            <ul>
              {a.relatedTools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href}>{t.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-ink-muted">
          Zuletzt aktualisiert: {formatDate(a.updated)}. Informationscharakter, keine Beratung —
          maßgeblich ist der offizielle Kollektivvertrag.
        </p>
      </Prose>
      <JsonLd data={articleLd} />
    </>
  );
}
