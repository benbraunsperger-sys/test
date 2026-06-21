import "server-only";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { collectiveAgreementSchema, type CollectiveAgreement } from "./schema";
import { getIndexability } from "./indexability";
import { sectorSlug } from "./vocab";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "kv");

/**
 * Load + validate every KV record once per build. Throws (fails the build) if
 * any record is invalid — the same validation the standalone validator runs.
 */
let cache: CollectiveAgreement[] | null = null;

export function loadAllKvs(): CollectiveAgreement[] {
  if (cache) return cache;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

  const records: CollectiveAgreement[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const parsed = yaml.load(raw);
    const result = collectiveAgreementSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `Ungültiger KV-Datensatz in ${file}:\n${JSON.stringify(result.error.format(), null, 2)}`,
      );
    }
    const kv = result.data;
    if (seenIds.has(kv.id)) throw new Error(`Doppelte id: ${kv.id} (${file})`);
    if (seenSlugs.has(kv.slug)) throw new Error(`Doppelter slug: ${kv.slug} (${file})`);
    seenIds.add(kv.id);
    seenSlugs.add(kv.slug);
    records.push(kv);
  }

  records.sort((a, b) => a.name.localeCompare(b.name, "de-AT"));
  cache = records;
  return records;
}

export function getKvBySlug(slug: string): CollectiveAgreement | undefined {
  return loadAllKvs().find((kv) => kv.slug === slug);
}

export function getKvById(id: string): CollectiveAgreement | undefined {
  return loadAllKvs().find((kv) => kv.id === id);
}

export function getIndexableKvs(): CollectiveAgreement[] {
  return loadAllKvs().filter((kv) => getIndexability(kv).indexable);
}

export interface SectorGroup {
  sector: string;
  slug: string;
  kvs: CollectiveAgreement[];
}

export function getSectors(): SectorGroup[] {
  const map = new Map<string, CollectiveAgreement[]>();
  for (const kv of loadAllKvs()) {
    const list = map.get(kv.sector) ?? [];
    list.push(kv);
    map.set(kv.sector, list);
  }
  return [...map.entries()]
    .map(([sector, kvs]) => ({ sector, slug: sectorSlug(sector), kvs }))
    .sort((a, b) => a.sector.localeCompare(b.sector, "de-AT"));
}

export function getSectorBySlug(slug: string): SectorGroup | undefined {
  return getSectors().find((s) => s.slug === slug);
}

/** The validity period that should be shown "above the fold": current > announced > latest expired. */
export function getCurrentPeriod(kv: CollectiveAgreement) {
  const byStart = [...kv.validityPeriods].sort((a, b) =>
    b.validFrom.localeCompare(a.validFrom),
  );
  return (
    byStart.find((p) => p.status === "gültig") ??
    byStart.find((p) => p.status === "angekündigt") ??
    byStart[0]
  );
}

/**
 * Comparable KV pairs only — NOT the cartesian product. Two KVs are comparable
 * when they share employeeType AND (same sector OR are explicitly related).
 * Returns canonical, de-duplicated, order-independent pairs.
 */
export function getComparablePairs(): [CollectiveAgreement, CollectiveAgreement][] {
  const all = loadAllKvs();
  const seen = new Set<string>();
  const pairs: [CollectiveAgreement, CollectiveAgreement][] = [];

  const add = (a: CollectiveAgreement, b: CollectiveAgreement) => {
    if (a.id === b.id) return;
    const key = [a.slug, b.slug].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    const [first, second] = a.slug < b.slug ? [a, b] : [b, a];
    pairs.push([first, second]);
  };

  for (const a of all) {
    for (const b of all) {
      if (a.id === b.id || a.employeeType !== b.employeeType) continue;
      const related = (a.relatedKvIds ?? []).includes(b.id) || (b.relatedKvIds ?? []).includes(a.id);
      if (a.sector === b.sector || related) add(a, b);
    }
  }
  return pairs;
}

export function getRelatedKvs(kv: CollectiveAgreement): CollectiveAgreement[] {
  const all = loadAllKvs();
  const explicit = (kv.relatedKvIds ?? [])
    .map((id) => all.find((k) => k.id === id))
    .filter((k): k is CollectiveAgreement => Boolean(k));
  if (explicit.length > 0) return explicit;
  // Fallback: same sector, same employeeType, different record.
  return all.filter(
    (k) => k.id !== kv.id && k.sector === kv.sector && k.employeeType === kv.employeeType,
  );
}
