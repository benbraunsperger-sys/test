/**
 * Automated transcription sanity layer (does NOT replace the human PDF check).
 * Catches likely transcription errors and writes docs/DATA-SANITY.md.
 *   - Monotonicity: minimum increases (or holds) across step ladder within a group.
 *   - Year-over-year: where a KV has 2026 + 2027 periods, KV minimums should be
 *     ~ +2.0% (flag any cell deviating > 0.3 percentage points from expected).
 * Never alters a number — flags only.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAndValidate } from "./lib";
import { isKnownAmount } from "../src/lib/calc";

const EXPECTED_YOY: Record<string, number> = {
  "kv-metallgewerbe-angestellte": 2.0, // 2027 ≈ 2026 × 1.02 (override per record as needed)
};
const YOY_TOLERANCE_PP = 0.3;

interface Finding {
  kvId: string;
  kind: "monotonic" | "yoy" | "info";
  message: string;
}

function main() {
  const { records } = loadAndValidate();
  const findings: Finding[] = [];

  for (const kv of records) {
    // Monotonic ladder within group & period.
    for (const g of kv.groups) {
      const byPeriod = new Map<string, { label: string; amt: number; afterYears?: number }[]>();
      for (const s of g.steps) {
        if (!isKnownAmount(s.minSalaryEUR)) continue;
        const key = s.periodId ?? s.validFrom;
        const arr = byPeriod.get(key) ?? [];
        arr.push({ label: s.stepLabel, amt: s.minSalaryEUR, afterYears: s.afterYears });
        byPeriod.set(key, arr);
      }
      for (const [key, arr] of byPeriod) {
        const ordered = [...arr].sort((a, b) => (a.afterYears ?? 0) - (b.afterYears ?? 0));
        for (let i = 1; i < ordered.length; i++) {
          if (ordered[i].amt < ordered[i - 1].amt) {
            findings.push({
              kvId: kv.id,
              kind: "monotonic",
              message: `Gruppe ${g.code} (${key}): „${ordered[i].label}" (${ordered[i].amt}) < „${ordered[i - 1].label}" (${ordered[i - 1].amt}) — Stufe fällt, bitte prüfen.`,
            });
          }
        }
      }
    }

    // Year-over-year for multi-period KVs.
    const expectedPct = EXPECTED_YOY[kv.id];
    if (expectedPct != null) {
      for (const g of kv.groups) {
        const map = new Map<string, number>(); // `${label}|${year}` -> amt
        for (const s of g.steps) {
          if (!isKnownAmount(s.minSalaryEUR)) continue;
          map.set(`${s.stepLabel}|${s.validFrom.slice(0, 4)}`, s.minSalaryEUR);
        }
        for (const key of map.keys()) {
          if (!key.endsWith("|2026")) continue;
          const label = key.slice(0, -5);
          const a = map.get(`${label}|2026`);
          const b = map.get(`${label}|2027`);
          if (a && b) {
            const pct = ((b - a) / a) * 100;
            if (Math.abs(pct - expectedPct) > YOY_TOLERANCE_PP) {
              findings.push({
                kvId: kv.id,
                kind: "yoy",
                message: `Gruppe ${g.code} „${label}": 2026 ${a} → 2027 ${b} = ${pct.toFixed(2)}% (erwartet ~${expectedPct}% ±${YOY_TOLERANCE_PP}pp) — bitte prüfen.`,
              });
            }
          }
        }
      }
    }
  }

  const lines = [
    "# Daten-Sanity (automatisch)",
    "",
    "Automatische Plausibilitätsprüfung — **ersetzt nicht** die menschliche PDF-Kontrolle.",
    "Es werden nur Auffälligkeiten markiert; keine Zahl wird verändert.",
    "",
    `Generiert: ${new Date().toISOString()}`,
    "",
  ];
  if (findings.length === 0) {
    lines.push("✓ Keine Auffälligkeiten in den befüllten Tabellen gefunden.");
  } else {
    for (const f of findings) lines.push(`- **${f.kvId}** [${f.kind}]: ${f.message}`);
  }
  fs.writeFileSync(path.join(process.cwd(), "docs", "DATA-SANITY.md"), lines.join("\n") + "\n");
  console.log(`Sanity-Report: ${findings.length} Auffälligkeit(en) → docs/DATA-SANITY.md`);
}

main();
