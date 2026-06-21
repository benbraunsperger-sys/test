# SEO: Quality-Gate & URL-Map

## Quality-Gate (`src/lib/indexability.ts`)

`getIndexability(kv)` ist die **einzige** Quelle dafür, ob eine Seite indexiert
werden darf. Sie wird sowohl von der Sitemap (Ausschluss) als auch vom
`<meta robots>`-Tag genutzt. Eine KV-Seite ist nur indexierbar, wenn **alle**
Bedingungen erfüllt sind:

1. echter KV (`active`) – bzw. echtes Vergleichspaar / Branche mit ≥3 KVs
2. ≥1 Geltungszeitraum mit **befüllter** Gehaltstabelle (Gruppe + Stufe + Zahl)
3. ≥1 offizielle `sourceUrl` **und** `lastChecked` ≤ 365 Tage
4. Zusammenfassungen in eigenen Worten (keine kopierte Prosa)
5. eindeutiger Title/Meta
6. ≥3 interne Links (Branche + verwandte KVs + Tool/Ratgeber)
7. `confidence != needs-review` **oder** `manualReview` bestanden
8. keine unzulässige Beratungsformulierung

Fällt eine Bedingung, bekommt die Seite `noindex` und fliegt aus der Sitemap.
`npm run data:report` zählt indexierbar vs. noindex und nennt die Gründe.

## URL-Map

| Pfad | Inhalt | Canonical / Index |
| --- | --- | --- |
| `/` | Startseite | self |
| `/kollektivvertraege` | Verzeichnis (Phase 2: Facetten) | self |
| `/kv/[slug]` | **Kanonische KV-Seite** | self; index nur via Gate |
| `/kv/[slug]/gehaltstabelle/[jahr]` | Jahrestabelle (Phase 2+) | nur solide Jahre indexieren |
| `/kv/[slug]/verwendungsgruppe/[code]` | Gruppendetail (Phase 2+) | canonical → KV-Seite |
| `/branchen` / `/branchen/[branche]` | Branchen-Landing | index nur bei ≥3 KVs |
| `/vergleich/[a]-vs-[b]` | Vergleich (Phase 3) | order-unabhängiger Canonical |
| `/tools/*` | Rechner | self |
| `/ratgeber` / `/ratgeber/[slug]` | Hub (≤8, Phase 4) | self |
| `/impressum`, `/datenschutz` | rechtlich | `noindex` |
| `/methodik`, `/quellen`, `/ueber-uns`, `/korrektur-melden` | Trust | index |

## Technik

- Eindeutiger Title/Meta/H1 je Seite aus `seo`-Feldern.
- Self-referencing Canonicals; Section-Pages kanonisieren korrekt.
- `sitemap.xml` + `robots.txt` über Next.js Metadata-Routes.
- ISR (`revalidate = 86400`): Statuswechsel von Zeiträumen (gültig/ausgelaufen) wird aufgefrischt.
- JSON-LD: `Dataset` (KV-Seite), `BreadcrumbList`, `ItemList` (Branche), `FAQPage` (nur bei echten Q&A).
- OpenGraph/Twitter-Cards im Root-Layout.
- Performance-Budget: LCP < 2,0 s, minimales JS (~109 kB First Load), kein CLS.
- Hreflang vorbereitet für de-DE/de-CH.
