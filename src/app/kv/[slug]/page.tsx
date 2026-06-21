import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadAllKvs, getKvBySlug } from "@/lib/data";
import { getIndexability } from "@/lib/indexability";
import { absoluteUrl } from "@/lib/site";
import { KvArticle } from "@/components/KvArticle";

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
    openGraph: { title: kv.seo.title, description: kv.seo.metaDescription, url: canonical, type: "article" },
  };
}

export default async function KvPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kv = getKvBySlug(slug);
  if (!kv) notFound();
  return <KvArticle kv={kv} />;
}
