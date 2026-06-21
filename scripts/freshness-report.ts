/** Flags records whose lastChecked is older than the freshness threshold. */
import { loadAndValidate } from "./lib";
import { daysSince } from "../src/lib/format";

const WARN_DAYS = 300; // warn well before the 365-day index cutoff.

function main() {
  const { records } = loadAndValidate();
  const stale = records
    .map((kv) => ({ id: kv.id, age: daysSince(kv.lastChecked), lastChecked: kv.lastChecked }))
    .filter((r) => r.age > WARN_DAYS)
    .sort((a, b) => b.age - a.age);

  console.log(`Freshness-Report (Schwelle ${WARN_DAYS} Tage):`);
  if (stale.length === 0) {
    console.log("  ✓ Alle Datensätze aktuell.");
    return;
  }
  for (const r of stale) {
    console.log(`  ⚠ ${r.id}: zuletzt geprüft ${r.lastChecked} (${r.age} Tage)`);
  }
  // Report-only; does not fail the build.
}

main();
