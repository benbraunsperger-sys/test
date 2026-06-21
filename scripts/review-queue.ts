/**
 * Generates docs/REVIEW-QUEUE.md — the ONLY manual artifact. For each record
 * pending human verification (verified-pending-human, or any with a
 * verifyChecklist), renders a tiny tick-box list: each checklist item plus two
 * auto-picked spot-checks (lowest + highest known amount in the table).
 */
import fs from "node:fs";
import path from "node:path";
import { loadAndValidate } from "./lib";
import { isKnownAmount } from "../src/lib/calc";
import { formatEUR } from "../src/lib/format";

interface Cell {
  groupCode: string;
  stepLabel: string;
  amount: number;
  sourceUrl?: string;
}

function allCells(kvGroups: { code: string; steps: { stepLabel: string; minSalaryEUR: number; sourceUrl?: string }[] }[]): Cell[] {
  const cells: Cell[] = [];
  for (const g of kvGroups) {
    for (const s of g.steps) {
      if (isKnownAmount(s.minSalaryEUR)) {
        cells.push({ groupCode: g.code, stepLabel: s.stepLabel, amount: s.minSalaryEUR, sourceUrl: s.sourceUrl });
      }
    }
  }
  return cells;
}

function main() {
  const { records } = loadAndValidate();
  const pending = records.filter(
    (kv) => kv.confidence === "verified-pending-human" || (kv.verifyChecklist?.length ?? 0) > 0,
  );

  const lines = [
    "# Review-Queue — dein 5-Minuten-Check pro KV",
    "",
    "Öffne je KV die offizielle Quelle, bestätige die Zahlen, hak ab. Wenn alles passt:",
    "`npm run verify:promote -- <kv-id>` → die Seite wird öffentlich indexierbar.",
    "",
    "Vorschau vor dem Freischalten: `/vorschau/kv/<slug>` (noindex).",
    "",
  ];

  if (pending.length === 0) {
    lines.push("_Aktuell keine Datensätze in der Warteschlange._");
  }

  for (const kv of pending) {
    lines.push(`## ${kv.name}`);
    lines.push("");
    lines.push(`- **id:** \`${kv.id}\` · **confidence:** ${kv.confidence}`);
    lines.push(`- **Quelle(n):** ${kv.sourceUrls.map((u) => `<${u}>`).join(", ")}`);
    lines.push(`- **Vorschau:** \`/vorschau/kv/${kv.slug}\``);
    lines.push("");

    const checklist = kv.verifyChecklist ?? [];
    if (checklist.length > 0) {
      lines.push("**Aus dem Gemini-Export:**");
      for (const v of checklist) {
        const amt = v.expectedAmountEUR != null ? ` → ${formatEUR(v.expectedAmountEUR)}` : "";
        const src = v.sourceUrl ? ` ([Quelle](${v.sourceUrl}))` : "";
        lines.push(`- [${v.checked ? "x" : " "}] ${v.label}${amt}${src}`);
      }
    }

    // Auto spot-checks: lowest + highest known amount.
    const cells = allCells(kv.groups);
    if (cells.length > 0) {
      const lo = cells.reduce((a, b) => (b.amount < a.amount ? b : a));
      const hi = cells.reduce((a, b) => (b.amount > a.amount ? b : a));
      lines.push("");
      lines.push("**Automatische Stichproben (niedrigster / höchster Wert):**");
      for (const c of [lo, hi]) {
        const src = c.sourceUrl ? ` ([Quelle](${c.sourceUrl}))` : "";
        lines.push(`- [ ] Gruppe ${c.groupCode} / „${c.stepLabel}" → ${formatEUR(c.amount)}${src}`);
      }
    } else {
      lines.push("_Noch keine befüllten Beträge — zuerst Gemini-Daten ingestieren._");
    }
    lines.push("");
    lines.push(`→ **Freischalten:** \`npm run verify:promote -- ${kv.id}\``);
    lines.push("");
  }

  fs.writeFileSync(path.join(process.cwd(), "docs", "REVIEW-QUEUE.md"), lines.join("\n") + "\n");
  console.log(`Review-Queue: ${pending.length} Datensatz/Datensätze → docs/REVIEW-QUEUE.md`);
}

main();
