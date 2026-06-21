/**
 * Dead-link checker for official sourceUrls. Network-aware: many official
 * portals (WKO, GPA) return 403 to automated clients — that is NOT a dead link,
 * it is bot protection, so we classify it separately and never fail on it
 * (respecting site terms; we do not retry to bypass protection).
 */
import { loadAndValidate } from "./lib";

async function head(url: string): Promise<number | "error"> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.status;
  } catch {
    return "error";
  }
}

async function main() {
  const { records } = loadAndValidate();
  const urls = new Set<string>();
  for (const kv of records) {
    kv.sourceUrls.forEach((u) => urls.add(u));
    kv.validityPeriods.forEach((p) => urls.add(p.sourceUrl));
  }

  const dead: string[] = [];
  for (const url of urls) {
    const status = await head(url);
    if (status === "error") {
      console.log(`  ✖ ${url} — nicht erreichbar (Netzwerkfehler)`);
      dead.push(url);
    } else if (status === 403 || status === 401 || status === 429) {
      console.log(`  🔒 ${url} — ${status} (Bot-Schutz/Terms, kein toter Link)`);
    } else if (status >= 400) {
      console.log(`  ✖ ${url} — HTTP ${status}`);
      dead.push(url);
    } else {
      console.log(`  ✓ ${url} — ${status}`);
    }
  }

  if (dead.length > 0) {
    console.error(`\n✖ ${dead.length} tote Links gefunden.`);
    process.exit(1);
  }
  console.log("\n✓ Keine toten Links (Bot-geschützte Quellen ausgenommen).");
}

main();
