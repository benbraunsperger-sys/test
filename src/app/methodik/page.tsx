import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Methodik – wie wir KV-Daten erfassen",
  description: `Wie ${SITE.name} Kollektivvertrags-Daten erfasst: Fakten-Politik, keine Volltext-Wiedergabe, jährliche Aktualisierung, Quellenangabe, „ohne Gewähr".`,
};

export default function MethodikPage() {
  return (
    <Prose
      title="Methodik"
      intro="Wie wir Kollektivvertrags-Daten erfassen, prüfen und veröffentlichen."
      crumbs={[{ name: "Start", href: "/" }, { name: "Methodik", href: "/methodik" }]}
    >
      <h2>Nur Fakten</h2>
      <p>
        Wir erfassen ausschließlich Tatsachen: KV-Name, Branche, Vertragsparteien, Geltungszeiträume,
        Verwendungs-/Beschäftigungsgruppen, Stufen, die Mindestgehalts-Beträge, Lehrlingseinkommen und
        wesentliche Zulagen. Einstufungskriterien (Tätigkeitsmerkmale) fassen wir in
        <strong> eigenen Worten</strong> zusammen.
      </p>

      <h2>Keine Volltext-Wiedergabe</h2>
      <p>
        Wir geben den Volltext eines Kollektivvertrags niemals wörtlich wieder. Für den verbindlichen
        Wortlaut verlinken wir die offizielle Quelle.
      </p>

      <h2>Quellen &amp; Stand</h2>
      <p>
        Jede KV-Seite verlinkt mindestens eine offizielle Quelle (WKO, Gewerkschaft oder das
        Sozialpartner-Portal kollektivvertrag.at) und zeigt ein „zuletzt geprüft“-Datum. Die KV-Daten
        werden überwiegend jährlich angepasst; wir prüfen unsere Datensätze in diesem Rhythmus.
      </p>

      <h2>Qualitäts-Gate</h2>
      <p>
        Eine Seite wird nur dann für Suchmaschinen freigegeben (indexiert), wenn sie eine befüllte
        Gehaltstabelle, eine gültige offizielle Quelle, ein aktuelles Prüfdatum und eine bestätigte
        Datenqualität hat. Datensätze in Prüfung („needs-review“) bleiben auf <code>noindex</code>,
        bis sie verifiziert wurden — Genauigkeit geht vor Reichweite.
      </p>

      <h2>Datenerfassung &amp; Quellenrespekt</h2>
      <p>
        Wir übertragen die Zahlen strukturiert und manuell aus offiziellen, frei zugänglichen
        Veröffentlichungen. Wir respektieren <code>robots.txt</code> und Nutzungsbedingungen, lesen
        keine login- oder botgeschützten Seiten aus und umgehen keinen Schutz. Inhalte hinter
        Bezahlschranken geben wir nicht wieder.
      </p>

      <h2>Verifikations-Workflow</h2>
      <p>
        Neue Zahlen durchlaufen einen mehrstufigen Prozess: strukturierte Übernahme aus der
        offiziellen Quelle → automatische Plausibilitätsprüfung (Monotonie der Stufen,
        Jahresvergleich) → menschliche Stichprobe gegen das Original-PDF → Freischaltung. Erst
        nach der menschlichen Bestätigung wird eine Seite öffentlich indexiert; davor ist sie nur
        in einer internen, nicht indexierten Vorschau sichtbar.
      </p>

      <h2>Vom Beruf zum KV</h2>
      <p>
        Unsere Berufsseiten (z. B. „Einzelhandelskaufmann Gehalt“) ordnen einen Beruf dem
        zuständigen Kollektivvertrag und der wahrscheinlichen Verwendungsgruppe zu. Der angezeigte
        Betrag wird stets live aus dem geprüften KV-Datensatz gezogen — Berufsseiten speichern
        keine eigenen Gehaltszahlen. Eine Berufsseite wird nur veröffentlicht, wenn ihr KV geprüft
        ist; sonst bleibt sie auf <code>noindex</code>.
      </p>

      <h2>Korrekturen</h2>
      <p>
        Fehler? Über <a href="/korrektur-melden">Korrektur melden</a> kannst du einen falschen Wert
        melden. Wir prüfen Hinweise gegen die offizielle Quelle und korrigieren zeitnah.
      </p>

      <h2>Ohne Gewähr</h2>
      <p>
        Trotz sorgfältiger Bearbeitung erfolgen alle Angaben ohne Gewähr. {SITE.name} bietet
        Information, keine Beratung; maßgeblich ist der offizielle Kollektivvertrag.
      </p>
    </Prose>
  );
}
