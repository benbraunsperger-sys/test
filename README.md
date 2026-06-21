# KV-Radar

Schnelle, klare, kostenlose und **strukturierte** Datenbank österreichischer
Kollektivvertrags-Mindestgehälter („Kollektivvertrag-Gehaltstabellen"). Für jeden
Kollektivvertrag (KV): aktuelle und historische Gehaltstabellen nach
Verwendungs-/Lohngruppe und Stufe, Einstufungsregeln, Geltungszeiträume, ein
offizieller Quellenlink – plus Einstufungs-Assistent und „Liegt mein Gehalt über
dem KV-Mindestgehalt?"-Check.

> Arbeitstitel – nichts registriert. Architektur auf AT ausgelegt, vorbereitet für
> DE (Tarifverträge) und CH (GAV).

## Tech-Stack

- **Next.js (App Router) + TypeScript**, React Server Components, SSG/ISR
- **Tailwind CSS** mit zentralen Design-Tokens (`tailwind.config.ts`)
- **Daten:** je KV eine YAML-Datei in `src/content/kv/`, validiert mit **Zod** zur Build-Zeit
- **Suche/Filter:** clientseitig (kein bezahlter Suchdienst)
- **Formatierung:** de-AT, EUR, Komma-Dezimal
- **Deploy:** Vercel (`vercel.json`)

## Befehle

```bash
npm install
npm run dev            # Entwicklungsserver (validiert vorab die Daten)
npm run build          # Daten validieren + Production-Build
npm start              # Production-Server

npm run data:validate  # Zod-Validierung + Tabellen-Integrität (Build bricht bei Fehler ab)
npm run data:report    # Indexierbar-vs-noindex-Report (public/build-report.json)
npm run data:freshness # warnt bei lastChecked > 300 Tagen
npm run data:deadlinks  # prüft Quell-URLs (Bot-Schutz wird nicht als toter Link gewertet)

npm run typecheck
npm test               # Vitest
```

## Projektstruktur

```
src/
  app/                 # Next.js App Router (Seiten, sitemap.ts, robots.ts)
  components/          # UI-Bausteine (KvTable, Disclaimer, Badges, …)
  content/kv/          # je KV eine YAML-Datei = Single Source of Truth
  lib/                 # schema (Zod), data-Loader, indexability-Gate, format, vocab
scripts/               # Validator + Reports (Node/tsx)
tests/                 # Vitest (Gate, Slugs, Rechner)
docs/                  # Datenmodell, Sourcing, SEO, Recht, Provenienz
```

## Leitplanken (Kurzfassung)

1. **Nur Fakten.** Zahlen und Tatsachen; nie KV-Volltext wörtlich. Kriterien in eigenen Worten.
2. **Immer Quelle + „zuletzt geprüft".** Auf jeder KV-Seite, mit „ohne Gewähr".
3. **robots.txt & Terms respektieren.** Kein Auslesen botgeschützter/Login-Seiten, kein Umgehen von Schutz.
4. **DSGVO by design.** Keine personenbezogenen Daten in der Datenbank.
5. **Information, keine Beratung.** Rechner liefern Schätzungen + „im KV prüfen".
6. **Genauigkeit vor Reichweite.** Nicht verifizierte Datensätze sind `noindex`.

Details: siehe `docs/`.

## Funktionsumfang

- **Seiten:** Start, KV-Verzeichnis (Facetten + Fuse-Suche), kanonische KV-Seite,
  **Verwendungsgruppen-Seiten**, **Berufsseiten** (`/beruf/[slug]` → KV → Gruppe →
  Live-Mindestgehalt), Branchen-Landings, Vergleichsseiten (nur vergleichbare
  Paare), 4 Rechner, Ratgeber-Hub, Aktualisierungen + RSS, Legal/Trust-Seiten.
- **Daten-Pipeline:** `data:ingest` (Gemini-Export → Schema, verbatim),
  `data:sanity`, `review:queue`, `verify:promote`. Vorschau unter `/vorschau/...`
  (noindex), bevor `verify:promote` eine Seite öffentlich schaltet.

## Daten-Pipeline (Kurzform)

```bash
# Gemini-Export nach data/ingest/<kv>.yaml legen, dann:
npm run data:ingest        # → verified-pending-human (Zahlen verbatim)
npm run data:sanity        # Plausibilität → docs/DATA-SANITY.md
npm run review:queue       # Stichproben-Liste → docs/REVIEW-QUEUE.md
npm run verify:promote -- kv-handel-angestellte   # → öffentlich indexierbar
```

Siehe `docs/GO-LIVE.md` für die vollständige Minimal-Checkliste.
- **Rechner (lokal, ohne Datenspeicherung):** KV-Mindest-Check, KV-Erhöhungs-Rechner,
  Vorrückungs-Rechner, Einstufungs-Assistent.
- **SEO:** Quality-Gate (Sitemap + `meta robots`), JSON-LD (Dataset, BreadcrumbList,
  ItemList, Article), dynamische OG-Bilder, ISR.
- **QA:** Zod-Validierung (Build-Fail), 22 Unit-Tests, Build-/Freshness-/Dead-Link-
  Reports, Lighthouse-CI-Budgets.

## Status der Daten

Siehe `docs/seed-provenance.md` für den Verifikationsstand jedes der 13 Seed-KVs.
**Rahmendaten verifiziert** (Geltungszeiträume, Abschluss-Prozente, Parteien,
öffentliche Lehrlingseinkommen); die **Gehaltsbeträge je Gruppe/Stufe** stehen auf
dem Sentinel `0` („wird geprüft") und sind `needs-review`/`noindex`, bis sie aus den
offiziellen Gehaltsordnungen übertragen werden. Hintergrund: WKO/GPA/kollektivvertrag.at
blocken automatisierte Zugriffe (403) — wir umgehen das nicht (siehe `docs/DATA-SOURCING.md`).
