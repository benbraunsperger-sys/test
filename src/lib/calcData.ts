import { loadAllKvs } from "./data";

/** Compact, serialisable KV shape handed to the client-side calculators. */
export interface CalcStep {
  stepLabel: string;
  minSalaryEUR: number;
  basis: string;
  afterYears?: number;
}
export interface CalcGroup {
  code: string;
  name?: string;
  steps: CalcStep[];
}
export interface CalcPeriod {
  id: string;
  validFrom: string;
  status: string;
  increaseKVPercent?: number;
  increaseISTPercent?: number;
  capEUR?: number;
}
export interface CalcKv {
  slug: string;
  name: string;
  shortName?: string;
  confidence: string;
  groups: CalcGroup[];
  periods: CalcPeriod[];
}

export function getCalcData(): CalcKv[] {
  return loadAllKvs().map((kv) => ({
    slug: kv.slug,
    name: kv.name,
    shortName: kv.shortName,
    confidence: kv.confidence,
    groups: kv.groups.map((g) => ({
      code: g.code,
      name: g.name,
      steps: g.steps.map((s) => ({
        stepLabel: s.stepLabel,
        minSalaryEUR: s.minSalaryEUR,
        basis: s.basis,
        afterYears: s.afterYears,
      })),
    })),
    periods: kv.validityPeriods.map((p) => ({
      id: p.id,
      validFrom: p.validFrom,
      status: p.status,
      increaseKVPercent: p.increaseKVPercent,
      increaseISTPercent: p.increaseISTPercent,
      capEUR: p.capEUR,
    })),
  }));
}
