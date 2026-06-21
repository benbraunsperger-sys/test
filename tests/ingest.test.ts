import { describe, it, expect } from "vitest";
import { normalizeIngest } from "../scripts/ingestLib";

// A minimal Gemini-shaped export (close to schema, confidence needs-review).
const gemini = {
  id: "kv-handel-angestellte",
  name: "Kollektivvertrag für Angestellte im Handel",
  shortName: "Handel Angestellte",
  sector: "Handel",
  employeeType: "Angestellte",
  validityPeriods: [
    {
      id: "vp-2026",
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      status: "gültig",
      increaseKVPercent: 2.55,
      sourceUrl: "https://www.wko.at/kollektivvertrag/gehaltstafeln-angestellte-handel-2026",
    },
  ],
  groups: [
    {
      code: "A",
      name: "Beschäftigungsgruppe A",
      steps: [
        // Note: no `basis` provided → ingester defaults to Monat. Number preserved.
        { stepLabel: "1.-2. Berufsjahr", validFrom: "2026-01-01", minSalaryEUR: 2145.67 },
      ],
    },
  ],
  sourceUrls: ["https://www.wko.at/kollektivvertrag/gehaltstafeln-angestellte-handel-2026"],
  lastChecked: "2026-06-21",
  confidence: "needs-review",
  verifyChecklist: [
    { label: "Gruppe A, 1.-2. Jahr", groupCode: "A", stepLabel: "1.-2. Berufsjahr", expectedAmountEUR: 2145.67 },
  ],
};

describe("normalizeIngest (Gemini -> schema)", () => {
  const rec = normalizeIngest(gemini);

  it("preserves euro numbers verbatim", () => {
    expect(rec.groups[0].steps[0].minSalaryEUR).toBe(2145.67);
  });

  it("defaults basis to Monat when absent", () => {
    expect(rec.groups[0].steps[0].basis).toBe("Monat");
  });

  it("promotes needs-review to verified-pending-human (staging policy)", () => {
    expect(rec.confidence).toBe("verified-pending-human");
  });

  it("keeps incoming confidence with asis policy", () => {
    expect(normalizeIngest(gemini, { promotePolicy: "asis" }).confidence).toBe("needs-review");
  });

  it("carries the verifyChecklist through", () => {
    expect(rec.verifyChecklist?.[0].expectedAmountEUR).toBe(2145.67);
  });

  it("auto-generates SEO + ingest provenance", () => {
    expect(rec.seo.title.length).toBeGreaterThanOrEqual(10);
    expect(rec.ingest?.source).toBe("gemini-research-export");
  });
});
