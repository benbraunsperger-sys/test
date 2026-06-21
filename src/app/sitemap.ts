import type { MetadataRoute } from "next";
import { getIndexableKvs, getSectors } from "@/lib/data";
import { sectorSlug } from "@/lib/vocab";
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

  return [...staticPages, ...kvPages, ...sectorPages];
}
