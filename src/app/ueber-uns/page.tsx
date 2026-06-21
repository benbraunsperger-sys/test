import type { Metadata } from "next";
import { Prose, Todo } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Warum es ${SITE.name} gibt: klare, kostenlose, strukturierte KV-Gehaltsdaten mit ehrlicher Quellenangabe.`,
};

export default function UeberUnsPage() {
  return (
    <Prose
      title="Über uns"
      intro={`${SITE.name} macht österreichische Kollektivvertrags-Mindestgehälter endlich übersichtlich.`}
      crumbs={[{ name: "Start", href: "/" }, { name: "Über uns", href: "/ueber-uns" }]}
    >
      <h2>Warum es uns gibt</h2>
      <p>
        Kollektivvertragliche Mindestgehälter sind offiziell, aber über hunderte WKO- und
        Gewerkschaftsseiten und PDFs verstreut und werden jährlich zu unterschiedlichen Terminen
        angepasst. Wir bündeln diese Fakten an einem Ort: strukturiert, schnell, vergleichbar,
        mit Rechnern und stets mit Link zur offiziellen Quelle.
      </p>

      <h2>Was uns wichtig ist</h2>
      <ul>
        <li>Genauigkeit vor Reichweite — lieber wenige, geprüfte Seiten.</li>
        <li>Ehrliche Quellenangabe und ein sichtbares Prüfdatum.</li>
        <li>Information statt Beratung — maßgeblich ist der offizielle KV.</li>
        <li>Datenschutz by design — keine personenbezogenen Daten in der Datenbank.</li>
      </ul>

      <h2>Wer dahintersteht</h2>
      <p>
        <Todo>Kurzvorstellung des Teams / der betreibenden Person.</Todo>
      </p>
    </Prose>
  );
}
