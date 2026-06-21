# Datenmodell

Single Source of Truth ist `src/lib/schema.ts` (Zod). Jede KV-Datei in
`src/content/kv/*.yaml` wird dagegen validiert; ein ungültiger Datensatz **bricht
den Build ab**.

## `CollectiveAgreement`

| Feld | Typ | Pflicht | Hinweis |
| --- | --- | --- | --- |
| `id` | string | ✓ | stabil, eindeutig, z. B. `kv-metallgewerbe-angestellte` |
| `slug` | kebab-case | ✓ | URL unter `/kv/[slug]` |
| `name` | string | ✓ | voller KV-Name |
| `shortName` | string | – | Kurzname für Karten/Badges |
| `sector` | Enum | ✓ | kontrolliertes Vokabular (`src/lib/vocab.ts`) |
| `employeeType` | Enum | ✓ | `Angestellte` \| `Arbeiter` \| `Beide` \| `Lehrlinge` |
| `country` | Enum | ✓ | `AT` (DE/CH vorbereitet) |
| `region` | string | – | „Österreich" oder Bundesland |
| `parties` | `{ employer[], unions[] }` | ✓ | Vertragsparteien |
| `validityPeriods[]` | s. u. | ✓ (≥1) | Geltungszeiträume |
| `groups[]` | s. u. | ✓ | Verwendungs-/Lohn-/Beschäftigungsgruppen |
| `apprenticePay[]` | `{ year, validFrom, amountEUR }` | – | Lehrlingseinkommen |
| `allowances[]` | `{ name, amountEUR, basis, validFrom }` | – | wichtige Zulagen |
| `classificationNotes` | string | ✓ | **eigene Worte**: Einstufung & Vorrückung |
| `sourceUrls[]` | URL[] | ✓ (≥1) | nur offizielle Quellen |
| `lastChecked` | ISO-Datum | ✓ | Stand der letzten Prüfung |
| `confidence` | Enum | ✓ | `verified` \| `likely` \| `needs-review` |
| `manualReview` | boolean | ✓ | manuelle Prüfung bestanden? |
| `active` | boolean | ✓ | |
| `relatedKvIds[]` | string[] | – | vergleichbare KVs |
| `seo` | `{ title, metaDescription, h1 }` | ✓ | eindeutig pro Seite |

### `validityPeriods[]`
`id`, `validFrom`, `validTo?`, `status` (`gültig`\|`angekündigt`\|`ausgelaufen`),
`increaseKVPercent?`, `increaseISTPercent?`, `capEUR?`, `sourceUrl`, `notes?`.

Gestaffelte Abschlüsse („ab 1.1.2026 bzw. 1.1.2027") werden als **zwei**
Zeiträume modelliert (einer `gültig`, einer `angekündigt`).

### `groups[]`
`code` (z. B. `III`), `name?`, `criteriaSummary` (**eigene Worte** aus den
Tätigkeitsmerkmalen), `steps[]`.

### `steps[]`
`stepLabel` (Verwendungsgruppenjahr/Stufe), `validFrom`, `minSalaryEUR`,
`basis` (`Monat`\|`Stunde`).

> **Sentinel:** Solange ein Betrag noch nicht aus der offiziellen Quelle
> übertragen wurde, steht `minSalaryEUR: 0`. Die UI zeigt dafür „wird geprüft",
> und der Datensatz bleibt `needs-review`/`noindex`. Es werden **nie** geschätzte
> Zahlen als Fakt dargestellt.

## Kontrollierte Vokabulare

`src/lib/vocab.ts`: `SECTORS`, `EMPLOYEE_TYPES`, `COUNTRIES`, `VALIDITY_STATUS`,
`CONFIDENCE`, `SALARY_BASIS`. Neue Werte sind eine bewusste Erweiterung.
