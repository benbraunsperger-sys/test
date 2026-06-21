import type { CollectiveAgreement } from "@/lib/schema";

/** A fully-verified, gate-passing record used to exercise the positive path. */
export function verifiedKv(overrides: Partial<CollectiveAgreement> = {}): CollectiveAgreement {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "kv-test",
    slug: "kv-test",
    name: "Kollektivvertrag Test",
    sector: "Handel",
    employeeType: "Angestellte",
    country: "AT",
    parties: { employer: ["WKO"], unions: ["GPA"] },
    validityPeriods: [
      {
        id: "vp-1",
        validFrom: "2026-01-01",
        status: "gültig",
        sourceUrl: "https://www.wko.at/kollektivvertrag/test",
      },
    ],
    groups: [
      {
        code: "A",
        criteriaSummary: "Eigene Zusammenfassung der Tätigkeit.",
        steps: [{ stepLabel: "1. Jahr", validFrom: "2026-01-01", minSalaryEUR: 2000, basis: "Monat" }],
      },
    ],
    classificationNotes: "Eigene Worte zur Einstufung.",
    sourceUrls: ["https://www.wko.at/kollektivvertrag/test"],
    lastChecked: today,
    confidence: "verified",
    manualReview: false,
    active: true,
    relatedKvIds: [],
    seo: {
      title: "KV Test 2026 – Gehaltstabelle und Einstufung",
      metaDescription:
        "Mindestgehälter und Einstufung im Test-Kollektivvertrag 2026 mit offizieller Quelle und Stand-Datum für die Prüfung.",
      h1: "Kollektivvertrag Test",
    },
    ...overrides,
  };
}
