/** Node-side (no "server-only") loader shared by the CLI scripts. */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { collectiveAgreementSchema, type CollectiveAgreement } from "../src/lib/schema";
import { berufSchema, type Beruf } from "../src/lib/berufSchema";

export const CONTENT_DIR = path.join(process.cwd(), "src", "content", "kv");
export const BERUF_DIR = path.join(process.cwd(), "data", "berufe");

export interface LoadResult {
  records: CollectiveAgreement[];
  errors: { file: string; message: string }[];
}

export function loadAndValidate(): LoadResult {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

  const records: CollectiveAgreement[] = [];
  const errors: { file: string; message: string }[] = [];
  const seenIds = new Map<string, string>();
  const seenSlugs = new Map<string, string>();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    let parsed: unknown;
    try {
      parsed = yaml.load(raw);
    } catch (e) {
      errors.push({ file, message: `YAML-Parsefehler: ${(e as Error).message}` });
      continue;
    }
    const result = collectiveAgreementSchema.safeParse(parsed);
    if (!result.success) {
      errors.push({
        file,
        message: result.error.issues
          .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n"),
      });
      continue;
    }
    const kv = result.data;
    if (seenIds.has(kv.id)) {
      errors.push({ file, message: `Doppelte id "${kv.id}" (auch in ${seenIds.get(kv.id)})` });
    }
    if (seenSlugs.has(kv.slug)) {
      errors.push({ file, message: `Doppelter slug "${kv.slug}" (auch in ${seenSlugs.get(kv.slug)})` });
    }
    seenIds.set(kv.id, file);
    seenSlugs.set(kv.slug, file);
    records.push(kv);
  }
  return { records, errors };
}

export interface BerufLoadResult {
  berufe: Beruf[];
  errors: { file: string; message: string }[];
}

/** Load + validate berufe and check referential integrity against the KVs. */
export function loadBerufe(records: CollectiveAgreement[]): BerufLoadResult {
  const berufe: Beruf[] = [];
  const errors: { file: string; message: string }[] = [];
  if (!fs.existsSync(BERUF_DIR)) return { berufe, errors };

  const kvById = new Map(records.map((k) => [k.id, k]));
  const seen = new Set<string>();
  for (const file of fs.readdirSync(BERUF_DIR).filter((f) => /\.ya?ml$/.test(f))) {
    let parsed: unknown;
    try {
      parsed = yaml.load(fs.readFileSync(path.join(BERUF_DIR, file), "utf8"));
    } catch (e) {
      errors.push({ file, message: `YAML-Parsefehler: ${(e as Error).message}` });
      continue;
    }
    const res = berufSchema.safeParse(parsed);
    if (!res.success) {
      errors.push({
        file,
        message: res.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n"),
      });
      continue;
    }
    const b = res.data;
    if (seen.has(b.slug)) errors.push({ file, message: `Doppelter slug "${b.slug}"` });
    seen.add(b.slug);

    // Referential integrity: every referenced KV + group must exist.
    if (!kvById.has(b.primaryKvId)) errors.push({ file, message: `primaryKvId "${b.primaryKvId}" existiert nicht` });
    for (const tg of b.typicalGroups) {
      const kv = kvById.get(tg.kvId);
      if (!kv) errors.push({ file, message: `kvId "${tg.kvId}" existiert nicht` });
      else if (!kv.groups.some((g) => g.code === tg.groupCode))
        errors.push({ file, message: `Gruppe "${tg.groupCode}" in "${tg.kvId}" existiert nicht` });
    }
    berufe.push(b);
  }
  return { berufe, errors };
}

/** Table integrity: every group has steps, every step has a number + validFrom. */
export function checkTableIntegrity(kv: CollectiveAgreement): string[] {
  const problems: string[] = [];
  for (const g of kv.groups) {
    if (g.steps.length === 0) problems.push(`Gruppe ${g.code} hat keine Stufen`);
    for (const s of g.steps) {
      if (!Number.isFinite(s.minSalaryEUR)) {
        problems.push(`Gruppe ${g.code} / "${s.stepLabel}": Betrag fehlt`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.validFrom)) {
        problems.push(`Gruppe ${g.code} / "${s.stepLabel}": validFrom fehlt`);
      }
    }
  }
  return problems;
}
