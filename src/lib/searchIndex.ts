import { loadAllKvs, getCurrentPeriod } from "./data";
import { sectorSlug } from "./vocab";

/** Lightweight, serialisable index item for the client-side directory/search. */
export interface KvIndexItem {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  sector: string;
  sectorSlug: string;
  employeeType: string;
  status: string;
  region?: string;
  increaseKVPercent?: number;
  lastChecked: string;
  confidence: string;
}

export function buildKvIndex(): KvIndexItem[] {
  return loadAllKvs().map((kv) => {
    const period = getCurrentPeriod(kv);
    return {
      id: kv.id,
      slug: kv.slug,
      name: kv.name,
      shortName: kv.shortName,
      sector: kv.sector,
      sectorSlug: sectorSlug(kv.sector),
      employeeType: kv.employeeType,
      status: period.status,
      region: kv.region,
      increaseKVPercent: period.increaseKVPercent,
      lastChecked: kv.lastChecked,
      confidence: kv.confidence,
    };
  });
}

export function distinct<T>(values: T[]): T[] {
  return [...new Set(values)];
}
