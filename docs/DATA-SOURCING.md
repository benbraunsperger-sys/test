# Datenbeschaffung & Quellen-Leitplanken

## Grundsätze

1. **Nur Fakten.** KV-Name, Branche, Parteien, Geltungszeiträume, Gruppen, Stufen,
   Mindestbeträge, Lehrlingseinkommen, Schlüssel-Zulagen, Einstufungskriterien
   **in eigenen Worten**. Der KV-Volltext wird nie wörtlich wiedergegeben.
2. **Immer offizielle Quelle + `lastChecked`.** Jede KV-Seite verlinkt die Quelle
   und zeigt das Prüfdatum sowie „Angaben ohne Gewähr".
3. **robots.txt & Nutzungsbedingungen respektieren.** Keine login-/botgeschützten
   Seiten auslesen, keinen Schutz umgehen, keine Bezahlschranken wiedergeben.
4. **Manuelle, strukturierte Transkription** der Zahlen aus frei zugänglichen,
   offiziellen Veröffentlichungen ist der Standardweg für den Seed.
5. **Genauigkeit vor Reichweite.** Nicht verifizierbare Werte → `needs-review` → `noindex`.

## Erlaubte Primärquellen

| Quelle | URL | Status (Stand 2026-06) |
| --- | --- | --- |
| WKO Kollektivverträge | wko.at/kollektivvertrag/* | Öffentlich. **Antwortet automatisierten Clients mit HTTP 403 (Bot-Schutz).** Nicht auslesen; manuell transkribieren. |
| Sozialpartner-Portal | kollektivvertrag.at | Öffentlich. Ebenfalls 403 für Bots beobachtet. Manuell. |
| GPA | gpa.at/kollektivvertrag/* | Öffentliche PDFs; 403 für Bots beobachtet. Manuell. |
| PRO-GE | proge.at/kollektivvertrag/* | Öffentliche PDFs. Manuell. |
| ÖGB | oegb.at | Öffentlich. |

> **Wichtig:** In der Build-/CI-Umgebung liefern WKO, kollektivvertrag.at und GPA
> `403` an automatisierte Aufrufe. Das ist **kein toter Link**, sondern Bot-Schutz.
> Der Dead-Link-Checker (`scripts/deadlink-check.ts`) klassifiziert `401/403/429`
> separat und wertet sie nicht als Fehler. Wir umgehen diesen Schutz nicht.

## Importer (optional, später)

Falls ein Importer gebaut wird:
- Nur Seiten abrufen, die es erlauben (robots.txt prüfen, Terms beachten).
- Pro Quelle robots-/Terms-Status protokollieren.
- Re-Import muss **idempotent und diff-bar** sein.
- Ungültige Datensätze müssen den Build zum **Scheitern** bringen.

## Verifikations-Workflow je Datensatz

1. Offizielle Gehaltsordnung/-tafel öffnen (Quelle aus `sourceUrls`).
2. Gruppen × Stufen → Beträge manuell in die YAML übertragen (`minSalaryEUR`).
3. `lastChecked` auf das heutige Datum setzen.
4. Kriterien/Einstufung in **eigenen Worten** zusammenfassen.
5. `confidence` ehrlich setzen; bei Erstprüfung `manualReview` erst nach Kontrolle auf `true`.
6. `npm run data:validate && npm run data:report` ausführen.
