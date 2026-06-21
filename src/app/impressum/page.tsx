import type { Metadata } from "next";
import { Prose, Todo } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Offenlegung von ${SITE.name} gemäß § 5 ECG und § 25 Mediengesetz.`,
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <Prose
      title="Impressum"
      intro="Offenlegung gemäß § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz."
      crumbs={[{ name: "Start", href: "/" }, { name: "Impressum", href: "/impressum" }]}
    >
      <h2>Medieninhaber &amp; Diensteanbieter</h2>
      <p>
        <Todo>Name / Firma des Medieninhabers</Todo>
        <br />
        <Todo>Anschrift (Straße, PLZ, Ort, Österreich)</Todo>
        <br />
        <Todo>Rechtsform &amp; ggf. Firmenbuchnummer / Firmenbuchgericht</Todo>
        <br />
        <Todo>UID-Nummer (falls vorhanden)</Todo>
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <Todo>Kontakt-E-Mail-Adresse</Todo>
        <br />
        Telefon: <Todo>optional</Todo>
      </p>

      <h2>Unternehmensgegenstand</h2>
      <p>
        Bereitstellung einer kostenlosen, strukturierten Informationsdatenbank zu österreichischen
        Kollektivvertrags-Mindestgehältern.
      </p>

      <h2>Mitglied / Behörde / Aufsicht</h2>
      <p>
        <Todo>WKO-Mitgliedschaft, zuständige Aufsichtsbehörde bzw. Gewerbeordnung, sofern zutreffend</Todo>
      </p>

      <h2>Haftungs- und Inhaltshinweis</h2>
      <p>
        {SITE.name} stellt ausschließlich Informationen bereit und bietet keine Rechts-, Steuer-
        oder Gehaltsberatung. Maßgeblich ist stets der offizielle Kollektivvertrag. Alle Angaben
        ohne Gewähr; trotz sorgfältiger Bearbeitung kann keine Haftung für Richtigkeit,
        Vollständigkeit und Aktualität übernommen werden.
      </p>

      <h2>Urheberrecht &amp; Quellen</h2>
      <p>
        Wir geben ausschließlich Fakten (z. B. Mindestbeträge, Geltungszeiträume) wieder und
        verlinken die offiziellen Quellen. Der Volltext der Kollektivverträge wird nicht
        wiedergegeben; Rechte an den Originaltexten verbleiben bei den jeweiligen Kollektivvertrags-
        parteien.
      </p>
    </Prose>
  );
}
