# Seed-Provenienz

Mapping jedes Seed-Datensatzes auf die offizielle Quelle, das Abrufdatum und den
**Verifikationsstand**. Ehrlichkeit über den Datenstand ist Teil des Produkts.

> **Build-Umgebungs-Hinweis:** WKO, kollektivvertrag.at und GPA antworten
> automatisierten Aufrufen mit HTTP 403 (Bot-Schutz). Die **Rahmendaten** unten
> (Geltungszeiträume, Abschluss-Prozente, Parteien, Lehrlingseinkommen) wurden
> über öffentliche Such-Snippets der offiziellen Abschluss-Informationen
> verifiziert. Die **vollständigen Gehaltstabellen (Beträge je Gruppe/Stufe)**
> erfordern manuelle Transkription aus der jeweiligen offiziellen Gehaltsordnung
> und stehen derzeit auf dem Sentinel `0` („wird geprüft"). Alle Seed-Datensätze
> sind daher `confidence: needs-review` und `noindex`, bis ein Mensch die Beträge
> überträgt und `confidence: verified` setzt.

Abrufdatum aller Einträge: **2026-06-21**.

## kv-metallgewerbe-angestellte
- **Quelle:** wko.at/kollektivvertrag/gehaltsordnung-metallgewerbe-angestellte-2026-27; gpa.at (Metallgewerbe 2026/2027)
- **Verifiziert:** Zweijahresabschluss 2026/2027; KV-Erhöhung **2,2 %** ab 1.1.2026; Deckelung **95,00 €** (VG V, VI, Meister); zweite Stufe ab 1.1.2027.
- **Offen (needs-review):** Beträge je Verwendungsgruppe/Stufe (Sentinel 0).

## kv-handel-angestellte
- **Quelle:** wko.at/kollektivvertrag/gehaltstafeln-angestellte-handel-2026; gpa.at (Handelsangestellte)
- **Verifiziert:** Gehaltstafel **+2,55 %** ab 1.1.2026; Aufrundung auf vollen Euro; **Lehrlingseinkommen** 1.026 / 1.200 / 1.518 / 1.580 € (1.–4. Lehrjahr).
- **Offen (needs-review):** Beträge der Beschäftigungsgruppen A–H (Sentinel 0).

## kv-information-consulting-angestellte
- **Quelle:** wko.at/kollektivvertrag/gehaltsordnung-information-consulting-angestellte-2026; wko.at/kollektivvertrag/kollektivvertrag-information-und-consulting-2026
- **Verifiziert:** Mindestgehälter **+2,85 %**, Lehrlingseinkommen **+3,5 %** ab 1.1.2026; § 10 (Reisekosten) neu; Diäten 30,00 € Tag / 17,00 € Nacht, Kilometergeld 0,50 €.
- **Offen (needs-review):** Beträge je Verwendungsgruppe/Stufe (Sentinel 0). Hinweis: eigenständiger IT-KV (IT-KV, Abschluss 10.3.2026, +2,7 %–3,1 % sozial gestaffelt) ist separat zu erfassen.

## Verifikations-Schritte zum Freischalten (pro Datensatz)
1. Offizielle Gehaltsordnung/-tafel öffnen.
2. Beträge je Gruppe/Stufe in die YAML übertragen (Sentinel 0 ersetzen).
3. `lastChecked` aktualisieren, `confidence: verified`, ggf. `manualReview: true`.
4. `npm run data:validate && npm run data:report` – Datensatz wird indexierbar.
