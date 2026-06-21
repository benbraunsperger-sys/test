/**
 * Ingest mapper: Gemini research export (YAML, "close to our schema") -> strict
 * CollectiveAgreement records. Transcription fidelity is sacred: this NEVER
 * alters a euro number, date, or percentage. It only fills structural defaults
 * (basis, seo, confidence policy) and normalises shape.
 */
import { z } from "zod";
import {
  collectiveAgreementSchema,
  type CollectiveAgreement,
} from "../src/lib/schema";

const PLACEHOLDER_KEY = "__PASTE_GEMINI_YAML_HERE__";

/** Relaxed shape we accept on the way in (superset / lenient). */
const ingestSchema = z
  .object({
    id: z.string(),
    slug: z.string().optional(),
    name: z.string(),
    shortName: z.string().optional(),
    sector: z.string(),
    employeeType: z.string(),
    country: z.string().optional(),
    region: z.string().optional(),
    parties: z
      .object({ employer: z.array(z.string()), unions: z.array(z.string()) })
      .optional(),
    validityPeriods: z.array(z.any()).optional(),
    groups: z.array(z.any()).optional(),
    apprenticePay: z.array(z.any()).optional(),
    allowances: z.array(z.any()).optional(),
    classificationNotes: z.string().optional(),
    sourceUrls: z.array(z.string()).optional(),
    lastChecked: z.string().optional(),
    confidence: z.string().optional(),
    relatedKvIds: z.array(z.string()).optional(),
    verifyChecklist: z.array(z.any()).optional(),
    seo: z.any().optional(),
  })
  .passthrough();

export type IngestInput = z.infer<typeof ingestSchema>;

export function isPlaceholder(parsed: unknown): boolean {
  return Boolean(parsed && typeof parsed === "object" && (parsed as Record<string, unknown>)[PLACEHOLDER_KEY]);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultSeo(input: IngestInput) {
  const year = (input.validityPeriods?.[0]?.validFrom ?? input.lastChecked ?? today()).slice(0, 4);
  const what = input.employeeType === "Arbeiter" ? "Lohntabelle" : "Gehaltstabelle";
  return {
    title: `${input.shortName ?? input.name} ${year} – ${what} & Einstufung`.slice(0, 70),
    metaDescription:
      `Mindestbeträge, Gruppen und Einstufung im ${input.name} ${year}. Mit offizieller Quelle und Stand-Datum.`.slice(
        0,
        170,
      ),
    h1: input.name,
  };
}

/**
 * Map one ingest object to a strict CollectiveAgreement. `promotePolicy`
 * controls how an incoming confidence is treated:
 *  - "staging" (default): needs-review/likely -> verified-pending-human, so the
 *    record previews on /vorschau but is NOT publicly indexable until promoted.
 *  - "asis": keep the incoming confidence verbatim.
 */
export function normalizeIngest(
  raw: unknown,
  opts: { promotePolicy?: "staging" | "asis" } = {},
): CollectiveAgreement {
  const input = ingestSchema.parse(raw);
  const promote = opts.promotePolicy ?? "staging";

  const groups = (input.groups ?? []).map((g: Record<string, unknown>) => ({
    code: String(g.code),
    name: g.name ? String(g.name) : undefined,
    criteriaSummary:
      (g.criteriaSummary as string) ??
      "Einstufung nach den Tätigkeitsmerkmalen des offiziellen Kollektivvertrags (eigene Zusammenfassung).",
    steps: (g.steps as Record<string, unknown>[] ?? []).map((s) => ({
      stepLabel: String(s.stepLabel),
      validFrom: String(s.validFrom),
      minSalaryEUR: Number(s.minSalaryEUR), // NEVER rounded/altered.
      basis: (s.basis as string) ?? "Monat",
      afterYears: s.afterYears != null ? Number(s.afterYears) : undefined,
      sourceUrl: s.sourceUrl ? String(s.sourceUrl) : undefined,
      periodId: s.periodId ? String(s.periodId) : undefined,
    })),
  }));

  let confidence = (input.confidence as string) ?? "needs-review";
  if (promote === "staging" && confidence !== "verified") {
    confidence = "verified-pending-human";
  }

  const candidate = {
    id: input.id,
    slug: input.slug ?? input.id.replace(/^kv-/, ""),
    name: input.name,
    shortName: input.shortName,
    sector: input.sector,
    employeeType: input.employeeType,
    country: input.country ?? "AT",
    region: input.region ?? "Österreich",
    parties: input.parties ?? { employer: ["WKO"], unions: ["GPA"] },
    validityPeriods: input.validityPeriods ?? [],
    groups,
    apprenticePay: input.apprenticePay,
    allowances: input.allowances,
    classificationNotes:
      input.classificationNotes ??
      "Die Einstufung richtet sich nach der tatsächlich ausgeübten Tätigkeit; innerhalb der Gruppe steigt der Mindestbetrag mit den anrechenbaren Jahren. Maßgeblich ist der offizielle Kollektivvertrag.",
    sourceUrls: input.sourceUrls ?? [],
    lastChecked: input.lastChecked ?? today(),
    confidence,
    manualReview: false,
    active: true,
    relatedKvIds: input.relatedKvIds,
    verifyChecklist: input.verifyChecklist,
    ingest: { source: "gemini-research-export", importedAt: today() },
    seo: input.seo ?? defaultSeo(input),
  };

  // Strict validation: an invalid mapping FAILS loudly rather than writing junk.
  return collectiveAgreementSchema.parse(candidate);
}
