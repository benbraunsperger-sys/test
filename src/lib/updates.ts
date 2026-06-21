import { loadAllKvs, getCurrentPeriod } from "./data";

export interface UpdateItem {
  title: string;
  href: string;
  date: string; // ISO
  summary: string;
}

/** Recently checked/updated KVs, newest first — feeds RSS + /aktualisierungen. */
export function getUpdates(limit = 50): UpdateItem[] {
  return loadAllKvs()
    .map((kv) => {
      const p = getCurrentPeriod(kv);
      const pct = p.increaseKVPercent != null ? `, KV +${p.increaseKVPercent} %` : "";
      return {
        title: `${kv.shortName ?? kv.name} — Stand ${kv.lastChecked}`,
        href: `/kv/${kv.slug}`,
        date: kv.lastChecked,
        summary: `${kv.sector} · ${kv.employeeType} · gültig ab ${p.validFrom}${pct}. Status: ${kv.confidence}.`,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
