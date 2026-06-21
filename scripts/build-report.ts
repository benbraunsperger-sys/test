/**
 * Build report: indexable vs noindex by page family (KV / Verwendungsgruppe /
 * Beruf / Vergleich), title/meta uniqueness, and a "ready to promote" list —
 * records passing every automated check, awaiting only the human tick.
 * Writes public/build-report.json.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAndValidate, loadBerufe } from "./lib";
import { getIndexability, isStagingPreviewable } from "../src/lib/indexability";

function main() {
  const { records, errors } = loadAndValidate();
  if (errors.length > 0) {
    console.error("Daten ungültig — zuerst `npm run data:validate` reparieren.");
    process.exit(1);
  }
  const { berufe } = loadBerufe(records);
  const kvById = new Map(records.map((k) => [k.id, k]));

  // KV family.
  const kvRows = records.map((kv) => ({ id: kv.id, ...getIndexability(kv) }));
  const kvIndexable = kvRows.filter((k) => k.indexable);
  const kvNoindex = kvRows.filter((k) => !k.indexable);

  // Verwendungsgruppe family (only on indexable KVs, non-thin groups).
  let groupIndexable = 0;
  let groupTotal = 0;
  for (const kv of records) {
    for (const g of kv.groups) {
      groupTotal++;
      if (getIndexability(kv).indexable && g.criteriaSummary.length > 0 && g.steps.length >= 2) groupIndexable++;
    }
  }

  // Beruf family.
  const berufRows = berufe.map((b) => {
    const kv = kvById.get(b.primaryKvId);
    const indexable = b.confidence === "verified" && !!kv && getIndexability(kv).indexable && b.typicalGroups.length > 0;
    return { id: b.id, indexable, confidence: b.confidence, kv: b.primaryKvId };
  });
  const berufIndexable = berufRows.filter((b) => b.indexable);

  // Ready to promote: structurally perfect, only the human tick missing.
  const readyToPromote = records
    .filter((kv) => kv.confidence === "verified-pending-human" && isStagingPreviewable(kv))
    .map((kv) => kv.id);

  // Title/meta uniqueness.
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
    byType: {
      kv: { total: records.length, indexable: kvIndexable.length, noindex: kvNoindex.length },
      verwendungsgruppe: { total: groupTotal, indexable: groupIndexable },
      beruf: { total: berufe.length, indexable: berufIndexable.length },
    },
    readyToPromote,
    noindexDetail: kvNoindex.map((k) => ({ id: k.id, reasons: k.reasons })),
    duplicateTitles: dupeTitles.map(([t, ids]) => ({ title: t, ids })),
    duplicateMetas: dupeMetas.map(([m, ids]) => ({ meta: m, ids })),
  };
  fs.mkdirSync(path.join(process.cwd(), "public"), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), "public", "build-report.json"), JSON.stringify(report, null, 2));

  console.log("── KV-Radar Build-Report ──────────────────────────");
  console.log(`KV               : ${records.length}  (indexierbar ${kvIndexable.length} / noindex ${kvNoindex.length})`);
  console.log(`Verwendungsgruppe: ${groupTotal}  (indexierbar ${groupIndexable})`);
  console.log(`Beruf            : ${berufe.length}  (indexierbar ${berufIndexable.length})`);
  console.log(`\nBereit zum Freischalten (verified-pending-human): ${readyToPromote.length ? readyToPromote.join(", ") : "—"}`);
  if (kvNoindex.length) {
    console.log("\nKV noindex-Gründe:");
    for (const k of kvNoindex) console.log(`  • ${k.id}: ${k.reasons.join("; ")}`);
  }
  console.log("───────────────────────────────────────────────────");

  if (dupeTitles.length || dupeMetas.length) {
    console.error("✖ Doppelte SEO-Felder gefunden.");
    process.exit(1);
  }
}

main();
