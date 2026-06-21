import "server-only";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { berufSchema, type Beruf } from "./berufSchema";
import {
  loadAllKvs,
  getKvById,
  getCurrentPeriod,
} from "./data";
import { getIndexability } from "./indexability";
import { isKnownAmount } from "./calc";
import type { CollectiveAgreement, Group } from "./schema";

const BERUF_DIR = path.join(process.cwd(), "data", "berufe");

let cache: Beruf[] | null = null;

export function loadAllBerufe(): Beruf[] {
  if (cache) return cache;
  if (!fs.existsSync(BERUF_DIR)) return (cache = []);
  const files = fs.readdirSync(BERUF_DIR).filter((f) => /\.ya?ml$/.test(f));
  const records: Beruf[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    const parsed = yaml.load(fs.readFileSync(path.join(BERUF_DIR, file), "utf8"));
    const res = berufSchema.safeParse(parsed);
    if (!res.success) {
      throw new Error(`Ungültiger Beruf in ${file}:\n${JSON.stringify(res.error.format(), null, 2)}`);
    }
    if (seen.has(res.data.slug)) throw new Error(`Doppelter Beruf-slug: ${res.data.slug}`);
    seen.add(res.data.slug);
    records.push(res.data);
  }
  records.sort((a, b) => a.name.localeCompare(b.name, "de-AT"));
  return (cache = records);
}

export function getBerufBySlug(slug: string): Beruf | undefined {
  return loadAllBerufe().find((b) => b.slug === slug);
}

export interface ResolvedGroup {
  kv: CollectiveAgreement;
  group: Group;
  rationale: string;
  entryEUR?: number;
  experiencedEUR?: number;
}

/** Resolve a beruf's typicalGroups to live KV groups + entry/experienced minimums. */
export function resolveBeruf(beruf: Beruf): {
  primaryKv?: CollectiveAgreement;
  groups: ResolvedGroup[];
} {
  const primaryKv = getKvById(beruf.primaryKvId);
  const groups: ResolvedGroup[] = [];
  for (const tg of beruf.typicalGroups) {
    const kv = getKvById(tg.kvId);
    if (!kv) continue;
    const group = kv.groups.find((g) => g.code === tg.groupCode);
    if (!group) continue;
    const amounts = group.steps.filter((s) => isKnownAmount(s.minSalaryEUR));
    const byYears = [...amounts].sort((a, b) => (a.afterYears ?? 0) - (b.afterYears ?? 0));
    groups.push({
      kv,
      group,
      rationale: tg.rationale,
      entryEUR: byYears[0]?.minSalaryEUR,
      experiencedEUR: byYears.at(-1)?.minSalaryEUR,
    });
  }
  return { primaryKv, groups };
}

/**
 * Beruf indexability: indexable only when the beruf itself is verified AND its
 * mapped primary KV is publicly indexable (so we never show a job page whose
 * salary source is unverified). Reuses the KV gate.
 */
export function getBerufIndexability(beruf: Beruf): { indexable: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (beruf.confidence !== "verified") reasons.push(`beruf confidence=${beruf.confidence}`);
  const kv = getKvById(beruf.primaryKvId);
  if (!kv) reasons.push(`primaryKvId ${beruf.primaryKvId} nicht gefunden`);
  else if (!getIndexability(kv).indexable) reasons.push(`gemappter KV ${kv.slug} nicht indexierbar`);
  if (beruf.typicalGroups.length < 1) reasons.push("keine typicalGroups");
  return { indexable: reasons.length === 0, reasons };
}

export function getIndexableBerufe(): Beruf[] {
  return loadAllBerufe().filter((b) => getBerufIndexability(b).indexable);
}

/** Other berufs sharing the primary KV — "ähnliche Berufe" block + linking. */
export function getRelatedBerufe(beruf: Beruf): Beruf[] {
  return loadAllBerufe().filter(
    (b) => b.id !== beruf.id && (b.primaryKvId === beruf.primaryKvId || b.sector === beruf.sector),
  );
}

export function berufeForKv(kvId: string): Beruf[] {
  return loadAllBerufe().filter(
    (b) => b.primaryKvId === kvId || b.typicalGroups.some((g) => g.kvId === kvId),
  );
}

/** Guard used by the build to ensure every beruf references real KV groups. */
export function validateBerufReferences(): string[] {
  const problems: string[] = [];
  const kvIds = new Set(loadAllKvs().map((k) => k.id));
  for (const b of loadAllBerufe()) {
    if (!kvIds.has(b.primaryKvId)) problems.push(`${b.id}: primaryKvId ${b.primaryKvId} fehlt`);
    for (const tg of b.typicalGroups) {
      const kv = getKvById(tg.kvId);
      if (!kv) problems.push(`${b.id}: kvId ${tg.kvId} fehlt`);
      else if (!kv.groups.some((g) => g.code === tg.groupCode))
        problems.push(`${b.id}: Gruppe ${tg.groupCode} in ${tg.kvId} fehlt`);
    }
  }
  return problems;
}
