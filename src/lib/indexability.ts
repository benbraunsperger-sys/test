import type { CollectiveAgreement } from "./schema";
import { PROHIBITED_ADVICE_PATTERNS } from "./schema";
import { daysSince } from "./format";

/**
 * PROGRAMMATIC SEO QUALITY GATE.
 *
 * Single source of truth for whether a page may be indexed. Used by BOTH the
 * sitemap (exclude noindex pages) and the <meta robots> tag on the page. If a
 * page fails any check it gets `noindex` and is excluded from the sitemap.
 */

export const MAX_LASTCHECKED_AGE_DAYS = 365; // KV data cadence is yearly.

export interface IndexabilityResult {
  indexable: boolean;
  reasons: string[]; // why it is NOT indexable (empty when indexable)
}

function hasPopulatedTable(kv: CollectiveAgreement): boolean {
  return kv.groups.some(
    (g) => g.steps.length > 0 && g.steps.every((s) => Number.isFinite(s.minSalaryEUR)),
  );
}

function containsProhibitedAdvice(kv: CollectiveAgreement): boolean {
  const corpus = [
    kv.classificationNotes,
    ...kv.groups.map((g) => g.criteriaSummary),
    kv.seo.title,
    kv.seo.metaDescription,
  ].join("\n");
  return PROHIBITED_ADVICE_PATTERNS.some((re) => re.test(corpus));
}

/**
 * Count the internal links a KV page is guaranteed to emit: its sector, each
 * related KV, plus the always-present tool + guide links rendered by the
 * template. We require >= 3.
 */
function guaranteedInternalLinks(kv: CollectiveAgreement): number {
  const sectorLink = 1;
  const relatedLinks = kv.relatedKvIds?.length ?? 0;
  const toolAndGuideLinks = 2; // KV-Mindest-Check + a relevant Ratgeber, always rendered.
  return sectorLink + relatedLinks + toolAndGuideLinks;
}

export function getIndexability(kv: CollectiveAgreement): IndexabilityResult {
  const reasons: string[] = [];

  // (1) maps to a real KV.
  if (!kv.active) reasons.push("KV ist nicht aktiv (active=false)");

  // (2) >= 1 validity period with a populated salary table.
  if (kv.validityPeriods.length < 1) reasons.push("Kein Gültigkeitszeitraum");
  if (!hasPopulatedTable(kv)) {
    reasons.push("Keine befüllte Gehaltstabelle (Gruppe + Stufe + Zahl)");
  }

  // (3) >= 1 official sourceUrl + lastChecked within 365 days.
  if (kv.sourceUrls.length < 1) reasons.push("Keine offizielle Quelle");
  if (daysSince(kv.lastChecked) > MAX_LASTCHECKED_AGE_DAYS) {
    reasons.push(`lastChecked älter als ${MAX_LASTCHECKED_AGE_DAYS} Tage`);
  }

  // (5) unique title/meta — presence checked here, cross-record uniqueness in
  // the build report. Empty SEO fields are caught by Zod, so just guard length.
  if (!kv.seo.title || !kv.seo.metaDescription) reasons.push("SEO-Felder fehlen");

  // (6) >= 3 internal links.
  if (guaranteedInternalLinks(kv) < 3) reasons.push("Weniger als 3 interne Links");

  // (7) confidence != needs-review OR manualReview passed.
  if (kv.confidence === "needs-review" && !kv.manualReview) {
    reasons.push("confidence=needs-review und manualReview nicht bestanden");
  }

  // (8) no prohibited advice wording.
  if (containsProhibitedAdvice(kv)) reasons.push("Unzulässige Beratungsformulierung gefunden");

  return { indexable: reasons.length === 0, reasons };
}

/** Convenience boolean for templates. */
export function isIndexable(kv: CollectiveAgreement): boolean {
  return getIndexability(kv).indexable;
}
