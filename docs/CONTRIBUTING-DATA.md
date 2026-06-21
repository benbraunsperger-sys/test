# Daten sicher pflegen (jährliches Update)

KV-Mindestgehälter ändern sich überwiegend **jährlich** zu gestaffelten Terminen.
So fügst du einen KV hinzu oder aktualisierst ihn, ohne Leitplanken zu verletzen.

## Neuen KV hinzufügen

1. Datei `src/content/kv/<id>.yaml` anlegen (Vorlage: bestehende Datei kopieren).
2. Rahmendaten aus der offiziellen Quelle eintragen: `name`, `sector`, `employeeType`,
   `parties`, `validityPeriods`, `sourceUrls`.
3. Gehaltstabelle aus der offiziellen Gehaltsordnung **manuell** übertragen
   (`groups[].steps[].minSalaryEUR`). Noch nicht übertragene Beträge: `0` lassen.
4. `criteriaSummary` und `classificationNotes` in **eigenen Worten** schreiben.
5. `lastChecked` = heutiges Datum. `confidence` ehrlich setzen.
6. `npm run data:validate` und `npm run data:report` ausführen.

## Jährliches Update eines bestehenden KV

1. Neuen `validityPeriod` ergänzen (Status `gültig`; bisherigen auf `ausgelaufen`
   setzen bzw. `validTo` ergänzen). Gestaffelte Termine = mehrere Zeiträume.
2. `increaseKVPercent` / `increaseISTPercent` / `capEUR` eintragen.
3. Beträge in `groups[].steps[]` für den neuen `validFrom` aktualisieren.
4. `lastChecked` aktualisieren.
5. Erst nach Kontrolle gegen die Quelle `confidence: verified` setzen → Seite wird indexierbar.

## Freigabe-Checkliste (Quality-Gate)

- [ ] Befüllte Tabelle: jede Gruppe hat ≥1 Stufe mit Zahl + `validFrom`.
- [ ] Mind. eine offizielle Quelle, `lastChecked` ≤ 365 Tage.
- [ ] Texte in eigenen Worten (keine kopierte KV-Prosa).
- [ ] Eindeutiger `seo.title` / `seo.metaDescription`.
- [ ] `confidence` korrekt; bei Erstprüfung `manualReview` erst nach Kontrolle `true`.
- [ ] `npm run data:validate && npm run data:report && npm test` grün.

## Niemals

- Geschätzte/erinnerte Zahlen als Fakt eintragen.
- KV-Volltext wörtlich kopieren.
- Bot-Schutz/Bezahlschranken umgehen.
- Personenbezogene Daten aufnehmen.
