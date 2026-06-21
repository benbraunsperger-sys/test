/**
 * `npm run verify:promote -- <kv-id>` — flips a record to confidence: verified
 * and lastChecked: today, after a human has ticked its REVIEW-QUEUE items. The
 * quality gate then makes it publicly indexable. No code edits required.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { collectiveAgreementSchema } from "../src/lib/schema";

const OUT_DIR = path.join(process.cwd(), "src", "content", "kv");

function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Aufruf: npm run verify:promote -- <kv-id>");
    process.exit(1);
  }
  const file = path.join(OUT_DIR, `${id}.yaml`);
  if (!fs.existsSync(file)) {
    console.error(`Nicht gefunden: ${file}`);
    process.exit(1);
  }
  const data = yaml.load(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  const today = new Date().toISOString().slice(0, 10);

  data.confidence = "verified";
  data.manualReview = true;
  data.lastChecked = today;
  if (Array.isArray(data.verifyChecklist)) {
    data.verifyChecklist = (data.verifyChecklist as Record<string, unknown>[]).map((v) => ({
      ...v,
      checked: true,
    }));
  }

  const parsed = collectiveAgreementSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`Promotion würde ungültigen Datensatz erzeugen:\n${JSON.stringify(parsed.error.format(), null, 2)}`);
    process.exit(1);
  }

  fs.writeFileSync(file, yaml.dump(parsed.data, { lineWidth: 100, noRefs: true }));
  console.log(`✓ ${id} → confidence: verified, lastChecked: ${today}. Jetzt öffentlich indexierbar (sofern alle Struktur-Checks bestehen).`);
}

main();
