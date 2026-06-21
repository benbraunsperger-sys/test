import { describe, it, expect } from "vitest";
import {
  applyIncrease,
  checkMinimum,
  vorrueckungTimeline,
  isKnownAmount,
  round2,
} from "@/lib/calc";

describe("applyIncrease", () => {
  it("applies a plain percentage", () => {
    const r = applyIncrease(3000, 2.2);
    expect(r.increaseEUR).toBe(66);
    expect(r.newGrossEUR).toBe(3066);
    expect(r.capped).toBe(false);
  });
  it("respects an absolute cap", () => {
    const r = applyIncrease(5000, 2.2, 95); // raw 110 > cap 95
    expect(r.capped).toBe(true);
    expect(r.increaseEUR).toBe(95);
    expect(r.newGrossEUR).toBe(5095);
  });
  it("does not cap when raw increase is below the cap", () => {
    const r = applyIncrease(3000, 2.2, 95); // raw 66 < 95
    expect(r.capped).toBe(false);
    expect(r.increaseEUR).toBe(66);
  });
  it("rounds to cents", () => {
    expect(applyIncrease(2345.67, 2.55).increaseEUR).toBe(round2(2345.67 * 0.0255));
  });
});

describe("checkMinimum", () => {
  it("flags above minimum", () => {
    const r = checkMinimum(2500, 2200);
    expect(r.isAboveMinimum).toBe(true);
    expect(r.differenceEUR).toBe(300);
    expect(r.ratio).toBeCloseTo(300 / 2200);
  });
  it("flags below minimum", () => {
    const r = checkMinimum(2000, 2200);
    expect(r.isAboveMinimum).toBe(false);
    expect(r.differenceEUR).toBe(-200);
  });
  it("treats exactly-at-minimum as above (no gap)", () => {
    const r = checkMinimum(2200, 2200);
    expect(r.isAboveMinimum).toBe(true);
    expect(r.differenceEUR).toBe(0);
  });
});

describe("vorrueckungTimeline", () => {
  const steps = [
    { stepLabel: "Eintritt", minSalaryEUR: 2000, afterYears: 0 },
    { stepLabel: "nach 2 Jahren", minSalaryEUR: 2100, afterYears: 2 },
    { stepLabel: "nach 4 Jahren", minSalaryEUR: 2200, afterYears: 4 },
  ];
  it("projects future step dates from start date + seniority", () => {
    const t = vorrueckungTimeline(steps, "2026-01-01", 0);
    expect(t.map((e) => e.reachedOn)).toEqual(["2028-01-01", "2030-01-01"]);
    expect(t[0].minSalaryEUR).toBe(2100);
  });
  it("excludes steps already reached", () => {
    const t = vorrueckungTimeline(steps, "2026-01-01", 2);
    expect(t).toHaveLength(1);
    expect(t[0].afterYears).toBe(4);
  });
  it("returns [] when steps lack afterYears (ladder-only)", () => {
    expect(vorrueckungTimeline([{ stepLabel: "x", minSalaryEUR: 2000 }], "2026-01-01", 0)).toEqual([]);
  });
});

describe("isKnownAmount", () => {
  it("treats the 0 sentinel as unknown", () => {
    expect(isKnownAmount(0)).toBe(false);
    expect(isKnownAmount(2000)).toBe(true);
  });
});
