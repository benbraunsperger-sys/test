# Rechtliches – was die Betreiberin/der Betreiber noch prüfen muss

Diese Datei listet alle Punkte, die echte Fakten oder eine juristische Prüfung
brauchen. Im Code sind sie als `TODO`-Marker sichtbar (Komponente `Todo`).

## Impressum (`/impressum`)
- [ ] Name/Firma des Medieninhabers
- [ ] Anschrift (AT)
- [ ] Rechtsform, ggf. Firmenbuchnummer + -gericht
- [ ] UID-Nummer (falls vorhanden)
- [ ] Kontakt-E-Mail (und ggf. Telefon)
- [ ] WKO-Mitgliedschaft / Gewerbeordnung / Aufsichtsbehörde, falls zutreffend
- [ ] Gegencheck § 5 ECG und § 25 Mediengesetz

## Datenschutz (`/datenschutz`)
- [ ] Konkretes Analyse-Tool benennen (cookielos, EU-gehostet) + Rechtsgrundlage
- [ ] Hosting-Anbieter + Auftragsverarbeitungsvertrag (z. B. Vercel)
- [ ] Datenschutz-Kontakt
- [ ] Double-Opt-in-Flow für E-Mail-Alerts vor Aktivierung prüfen
- [ ] Gesamte Erklärung von Datenschutz-Fachperson freigeben

## Korrektur melden (`/korrektur-melden`)
- [ ] Echte Korrektur-Inbox oder Serverless-Handler statt Platzhalter-Mailto

## Inhaltliche Leitplanken (bereits umgesetzt, bitte gegenprüfen)
- Disclaimer „Information, keine Beratung" auf jeder KV-Seite und jedem Tool.
- „Angaben ohne Gewähr" global im Footer und je KV-Seite.
- Keine Wiedergabe des KV-Volltextes; nur Fakten + eigene Zusammenfassungen.
- Quellenlink + „zuletzt geprüft" je KV-Seite.

## Berufsseiten / Einstufungs-Hinweise
- [ ] Stichprobe der Beruf→Verwendungsgruppe-Zuordnungen durch eine fachkundige
      Person bestätigen lassen (insb. die `needs-review`-Berufe). Falsche
      Einstufungen bleiben sonst dauerhaft `noindex`, aber eine Sichtprüfung
      erhöht das Vertrauen.

## Marke / Assets
- [ ] Name „KV-Radar" ist Arbeitstitel – Marken-/Domainprüfung vor Launch.
- [ ] Logo/OG-Bilder ersetzen Platzhalter (Phase 4).
