import { notFound } from "next/navigation";
import { loadAllKvs, getKvBySlug } from "@/lib/data";
import { isStagingPreviewable } from "@/lib/indexability";
import { KvArticle } from "@/components/KvArticle";

export const dynamic = "force-static";

export function generateStaticParams() {
  // Pre-render previews for records that are at least pending-verified.
  return loadAllKvs()
    .filter((kv) => isStagingPreviewable(kv))
    .map((kv) => ({ slug: kv.slug }));
}

export default async function VorschauKvPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kv = getKvBySlug(slug);
  // Allow preview for any existing record so you can eyeball even sentinels.
  if (!kv) notFound();
  return <KvArticle kv={kv} preview />;
}
