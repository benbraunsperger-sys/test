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

## Status

Siehe `docs/seed-provenance.md` für den Verifikationsstand jedes Datensatzes.
Aktueller Seed: Rahmendaten verifiziert; **Gehaltsbeträge werden noch aus den
offiziellen Gehaltsordnungen übertragen** und sind bis dahin `needs-review`/`noindex`.
