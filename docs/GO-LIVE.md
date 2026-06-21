# GO-LIVE — die Minimal-Checkliste (in dieser Reihenfolge)

Alles andere ist erledigt. Das hier ist dein Teil.

## 0. Echte Zahlen einspielen (einmalig pro KV)
1. Öffne `data/ingest/handel-angestellte.yaml` bzw. `metallgewerbe-angestellte.yaml`.
2. Füge den Gemini-Export (Gehaltstabelle) anstelle des Platzhalters ein.
3. `npm run data:ingest` → schreibt die Datensätze als `verified-pending-human`.
4. `npm run data:sanity` → prüfe `docs/DATA-SANITY.md` auf Auffälligkeiten.
5. Vorschau live ansehen: `npm run dev`, dann `/vorschau/kv/handel-angestellte`.

## 1. Zahlen abhaken (~5 Min pro KV)
- `npm run review:queue` → öffne `docs/REVIEW-QUEUE.md`.
- Pro KV: offizielle Quelle öffnen, die ~5 markierten Zahlen bestätigen, abhaken.

## 2. Freischalten
```bash
npm run verify:promote -- kv-handel-angestellte
npm run verify:promote -- kv-metallgewerbe-angestellte
```
Die KV-Seiten, ihre Verwendungsgruppen-Seiten und die zugeordneten **Berufsseiten**
werden dadurch automatisch öffentlich indexierbar. Kontrolle: `npm run data:report`.

## 3. Rechtliche Fakten einsetzen
Ersetze die `{{TODO}}`/`TODO:`-Marker (Liste in `docs/LEGAL.md`):
- Impressum: Name, Anschrift, Rechtsform, Kontakt-E-Mail.
- Datenschutz: Analyse-Tool, Hosting-Anbieter, Datenschutz-Kontakt.
- `src/app/korrektur-melden/page.tsx`: echte Korrektur-Inbox.

## 4. ENV-Variablen setzen (Vercel → Project Settings → Environment Variables)
- `NEXT_PUBLIC_SITE_URL` = deine Produktionsdomain (z. B. https://kv-radar.at)
- `NEXT_PUBLIC_GSC_VERIFICATION` = Google-Search-Console-Token (optional)
- `NEXT_PUBLIC_ANALYTICS_SRC` / `NEXT_PUBLIC_ANALYTICS_DOMAIN` = cookielose Analyse (optional)

## 5. Deployen
```bash
npm i -g vercel   # falls nötig
vercel --prod
```

## 6. Bei Google anmelden
- In der Search Console die Property bestätigen und `https://DEINE-DOMAIN/sitemap.xml` einreichen.
- Optional `https://DEINE-DOMAIN/feed.xml` als Quelle.

Fertig. Alles Übrige (Build, Tests, Lighthouse, Schema, interne Verlinkung,
Berufsseiten, Vorschau, Sitemap-Filter) läuft automatisch.

---

### Jährliches Update (später)
Neuer Abschluss → Zahlen in `data/ingest/` aktualisieren → `npm run data:ingest`
→ `npm run review:queue` → abhaken → `npm run verify:promote -- <kv-id>`.
Siehe `docs/CONTRIBUTING-DATA.md`.
