/**
 * Build-time data validator. Exits non-zero (FAILS the build) on any invalid
 * record or table-integrity problem. Idempotent and re-runnable.
 */
import { loadAndValidate, checkTableIntegrity } from "./lib";

function main() {
  const { records, errors } = loadAndValidate();

  let failed = errors.length > 0;
  for (const e of errors) {
    console.error(`\n❌ ${e.file}:\n${e.message}`);
  }

  for (const kv of records) {
    const problems = checkTableIntegrity(kv);
    if (problems.length > 0) {
      failed = true;
      console.error(`\n❌ ${kv.id} – Tabellen-Integrität:`);
      for (const p of problems) console.error(`  - ${p}`);
    }
  }

  if (failed) {
    console.error(`\n✖ Validierung fehlgeschlagen (${records.length} Datensätze geprüft).`);
    process.exit(1);
  }

  console.log(`✓ ${records.length} KV-Datensätze valide.`);
}

main();
