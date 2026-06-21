import type { MetadataRoute } from "next";
import { getIndexableKvs, getSectors, getComparablePairs } from "@/lib/data";
import { getIndexability } from "@/lib/indexability";
import { sectorSlug } from "@/lib/vocab";
import { comparisonSlug } from "@/lib/slug";
import { RATGEBER } from "@/content/ratgeber";
import { absoluteUrl } from "@/lib/site";

/**
 * Sitemap. Only indexable pages (per getIndexability) are listed. Static
 * marketing/legal pages and tools are always included; KV/sector pages only
 * when they pass the quality gate. Entries are grouped by page family via the
 * `priority` field so a later split-by-type sitemap index can read them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/kollektivvertraege",
    "/branchen",
    "/tools/einstufung",
    "/tools/kv-mindest-check",
    "/tools/vorrueckung",
    "/tools/kv-erhoehung",
    "/ratgeber",
    "/methodik",
    "/quellen",
    "/ueber-uns",
    "/korrektur-melden",
    "/impressum",
    "/datenschutz",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.5,
  }));

  const kvPages: MetadataRoute.Sitemap = getIndexableKvs().map((kv) => ({
    url: absoluteUrl(`/kv/${kv.slug}`),
    lastModified: new Date(kv.lastChecked),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Sector pages are indexable only with >= 3 KVs (quality gate rule 1).
  const sectorPages: MetadataRoute.Sitemap = getSectors()
    .filter((s) => s.kvs.length >= 3)
    .map((s) => ({
      url: absoluteUrl(`/branchen/${sectorSlug(s.sector)}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Comparison pages: indexable only when BOTH KVs pass the gate.
  const comparePages: MetadataRoute.Sitemap = getComparablePairs()
    .filter(([a, b]) => getIndexability(a).indexable && getIndexability(b).indexable)
    .map(([a, b]) => ({
      url: absoluteUrl(`/vergleich/${comparisonSlug(a.slug, b.slug)}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // Verwendungsgruppe sub-pages: only for publicly indexable KVs, non-thin groups.
  const groupPages: MetadataRoute.Sitemap = getIndexableKvs().flatMap((kv) =>
    kv.groups
      .filter((g) => g.criteriaSummary.length > 0 && g.steps.length >= 2)
      .map((g) => ({
        url: absoluteUrl(`/kv/${kv.slug}/verwendungsgruppe/${encodeURIComponent(g.code)}`),
        lastModified: new Date(kv.lastChecked),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  );

  const ratgeberPages: MetadataRoute.Sitemap = RATGEBER.map((a) => ({
    url: absoluteUrl(`/ratgeber/${a.slug}`),
    lastModified: new Date(a.updated),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...kvPages, ...sectorPages, ...groupPages, ...comparePages, ...ratgeberPages];
}
