/**
 * Emits an indexability build report: indexable vs noindex counts by page
 * family, plus title/meta uniqueness checks. Writes public/build-report.json
 * and prints a human-readable summary.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAndValidate } from "./lib";
import { getIndexability } from "../src/lib/indexability";

function main() {
  const { records, errors } = loadAndValidate();
  if (errors.length > 0) {
    console.error("Daten ungültig — zuerst `npm run data:validate` reparieren.");
    process.exit(1);
  }

  const kvFamily = records.map((kv) => ({
    id: kv.id,
    slug: kv.slug,
    confidence: kv.confidence,
    ...getIndexability(kv),
  }));

  const indexable = kvFamily.filter((k) => k.indexable);
  const noindex = kvFamily.filter((k) => !k.indexable);

  // Title/meta uniqueness across records.
  const titles = new Map<string, string[]>();
  const metas = new Map<string, string[]>();
  for (const kv of records) {
    titles.set(kv.seo.title, [...(titles.get(kv.seo.title) ?? []), kv.id]);
    metas.set(kv.seo.metaDescription, [...(metas.get(kv.seo.metaDescription) ?? []), kv.id]);
  }
  const dupeTitles = [...titles.entries()].filter(([, ids]) => ids.length > 1);
  const dupeMetas = [...metas.entries()].filter(([, ids]) => ids.length > 1);

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      kvRecords: records.length,
      kvIndexable: indexable.length,
      kvNoindex: noindex.length,
    },
    duplicateTitles: dupeTitles.map(([t, ids]) => ({ title: t, ids })),
    duplicateMetas: dupeMetas.map(([m, ids]) => ({ meta: m, ids })),
    noindexDetail: noindex.map((k) => ({ id: k.id, reasons: k.reasons })),
  };

  fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
  fs.writeFileSync(
    path.join(process.cwd(), "public", "build-report.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("── KV-Radar Build-Report ─────────────────────────");
  console.log(`KV-Datensätze gesamt : ${records.length}`);
  console.log(`  indexierbar        : ${indexable.length}`);
  console.log(`  noindex            : ${noindex.length}`);
  if (dupeTitles.length) console.log(`⚠ Doppelte Titel: ${dupeTitles.length}`);
  if (dupeMetas.length) console.log(`⚠ Doppelte Meta-Descriptions: ${dupeMetas.length}`);
  if (noindex.length) {
    console.log("\nNoindex-Gründe:");
    for (const k of noindex) console.log(`  • ${k.id}: ${k.reasons.join("; ")}`);
  }
  console.log("──────────────────────────────────────────────────");

  if (dupeTitles.length || dupeMetas.length) {
    console.error("✖ Doppelte SEO-Felder gefunden.");
    process.exit(1);
  }
}

main();
