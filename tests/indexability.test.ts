import { describe, it, expect } from "vitest";
import { getIndexability, isStagingPreviewable } from "@/lib/indexability";
import { verifiedKv } from "./fixtures";

describe("getIndexability quality gate", () => {
  it("passes a fully verified record", () => {
    expect(getIndexability(verifiedKv()).indexable).toBe(true);
  });

  it("blocks needs-review records from the public index", () => {
    const r = getIndexability(verifiedKv({ confidence: "needs-review" }));
    expect(r.indexable).toBe(false);
    expect(r.reasons.join(" ")).toMatch(/confidence=needs-review/);
  });

  it("keeps verified-pending-human OUT of the public index", () => {
    const r = getIndexability(verifiedKv({ confidence: "verified-pending-human" }));
    expect(r.indexable).toBe(false);
  });

  it("previews verified-pending-human on staging but not needs-review", () => {
    expect(isStagingPreviewable(verifiedKv({ confidence: "verified-pending-human" }))).toBe(true);
    expect(isStagingPreviewable(verifiedKv({ confidence: "verified" }))).toBe(true);
    expect(isStagingPreviewable(verifiedKv({ confidence: "needs-review" }))).toBe(false);
  });

  it("does not stage a pending record that fails a structural check", () => {
    expect(isStagingPreviewable(verifiedKv({ confidence: "verified-pending-human", groups: [] }))).toBe(false);
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
