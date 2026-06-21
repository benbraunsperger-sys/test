/**
 * `npm run data:ingest` — reads every YAML in data/ingest/, maps it to a strict
 * CollectiveAgreement and writes src/content/kv/<id>.yaml. Idempotent and
 * diff-able. Placeholder stubs (awaiting your paste) are skipped with a notice.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { normalizeIngest, isPlaceholder } from "./ingestLib";

const INGEST_DIR = path.join(process.cwd(), "data", "ingest");
const OUT_DIR = path.join(process.cwd(), "src", "content", "kv");

function main() {
  if (!fs.existsSync(INGEST_DIR)) {
    console.log("Kein data/ingest/ Verzeichnis — nichts zu tun.");
    return;
  }
  const files = fs.readdirSync(INGEST_DIR).filter((f) => /\.ya?ml$/.test(f));
  let written = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(INGEST_DIR, file), "utf8");
    const parsed = yaml.load(raw);
    if (parsed == null || isPlaceholder(parsed)) {
      console.log(`⏭  ${file}: Platzhalter — warte auf Gemini-Daten (übersprungen).`);
      skipped++;
      continue;
    }
    try {
      const record = normalizeIngest(parsed);
      const outPath = path.join(OUT_DIR, `${record.id}.yaml`);
      const header =
        `# AUTO-INGESTED from data/ingest/${file} via \`npm run data:ingest\`.\n` +
        `# Numbers transcribed verbatim from the Gemini export — do not hand-edit amounts here.\n` +
        `# confidence "verified-pending-human": previews on /vorschau, NOT public until verify:promote.\n`;
      fs.writeFileSync(outPath, header + yaml.dump(record, { lineWidth: 100, noRefs: true }));
      console.log(`✓ ${file} → src/content/kv/${record.id}.yaml (${record.confidence})`);
      written++;
    } catch (e) {
      console.error(`✖ ${file}: Mapping/Validierung fehlgeschlagen:\n${(e as Error).message}`);
      failed++;
    }
  }

  console.log(`\nIngest fertig: ${written} geschrieben, ${skipped} Platzhalter, ${failed} Fehler.`);
  if (failed > 0) process.exit(1);
}

main();
