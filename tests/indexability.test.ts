import { describe, it, expect } from "vitest";
import { getIndexability } from "@/lib/indexability";
import { verifiedKv } from "./fixtures";

describe("getIndexability quality gate", () => {
  it("passes a fully verified record", () => {
    expect(getIndexability(verifiedKv()).indexable).toBe(true);
  });

  it("blocks needs-review records without manualReview", () => {
    const r = getIndexability(verifiedKv({ confidence: "needs-review", manualReview: false }));
    expect(r.indexable).toBe(false);
    expect(r.reasons.join(" ")).toMatch(/needs-review/);
  });

  it("allows needs-review once manualReview passed", () => {
    const r = getIndexability(verifiedKv({ confidence: "needs-review", manualReview: true }));
    expect(r.indexable).toBe(true);
  });

  it("blocks stale records (lastChecked > 365 days)", () => {
    const r = getIndexability(verifiedKv({ lastChecked: "2000-01-01" }));
    expect(r.indexable).toBe(false);
    expect(r.reasons.join(" ")).toMatch(/lastChecked/);
  });

  it("blocks records with no populated salary table", () => {
    const r = getIndexability(verifiedKv({ groups: [] }));
    expect(r.indexable).toBe(false);
    expect(r.reasons.join(" ")).toMatch(/Gehaltstabelle/);
  });

  it("blocks prohibited advice wording", () => {
    const r = getIndexability(
      verifiedKv({ classificationNotes: "Dies ist eine verbindliche Zusage auf das Gehalt." }),
    );
    expect(r.indexable).toBe(false);
  });

  it("blocks inactive records", () => {
    expect(getIndexability(verifiedKv({ active: false })).indexable).toBe(false);
  });
});
