import type { Metadata } from "next";
import { Prose, Todo } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${SITE.name} — DSGVO-konform, cookielose Analyse, keine Weitergabe an Dritte.`,
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <Prose
      title="Datenschutzerklärung"
      intro="Datenschutz ist bei uns Teil der Architektur: Die Gehaltsdatenbank enthält keine personenbezogenen Daten, und wir erheben so wenig wie möglich."
      crumbs={[{ name: "Start", href: "/" }, { name: "Datenschutz", href: "/datenschutz" }]}
    >
      <h2>Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der DSGVO ist der im <a href="/impressum">Impressum</a> genannte
        Medieninhaber. Kontakt: <Todo>Datenschutz-Kontakt-E-Mail</Todo>.
      </p>

      <h2>Grundsatz: Datensparsamkeit</h2>
      <p>
        Der Datenbestand von {SITE.name} (Kollektivverträge, Gehaltstabellen) enthält
        <strong> keinerlei personenbezogene Daten</strong>. Unsere Rechner verarbeiten Eingaben
        ausschließlich lokal in deinem Browser; es werden keine Gehaltsangaben an unseren Server
        gesendet oder gespeichert.
      </p>

      <h2>Webanalyse (cookielos)</h2>
      <p>
        Wir verwenden eine datenschutzfreundliche, cookielose Reichweitenmessung ohne
        Wiedererkennung einzelner Personen und ohne Übermittlung in Drittländer.{" "}
        <Todo>konkretes Tool benennen (z. B. selbstgehostetes Plausible/Umami) und Rechtsgrundlage bestätigen</Todo>.
        Es werden keine Profile gebildet und keine Daten an Dritte verkauft.
      </p>

      <h2>Server-Logs</h2>
      <p>
        Beim Abruf der Seiten verarbeitet unser Hosting-Provider technisch notwendige Daten
        (z. B. gekürzte IP, Zeitpunkt, abgerufene URL) zur Auslieferung und Sicherheit auf Basis
        des berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Hosting:{" "}
        <Todo>Hosting-Anbieter &amp; Auftragsverarbeitungsvertrag bestätigen (z. B. Vercel)</Todo>.
      </p>

      <h2>E-Mail-Benachrichtigungen (optional, Double-Opt-in)</h2>
      <p>
        Wer sich für Update-Benachrichtigungen zu einem KV einträgt, gibt freiwillig eine
        E-Mail-Adresse an. Die Anmeldung erfolgt im <strong>Double-Opt-in-Verfahren</strong>
        (Bestätigungslink). Rechtsgrundlage ist die Einwilligung (Art. 6 Abs. 1 lit. a DSGVO),
        jederzeit widerrufbar über den Abmeldelink. Die Adresse wird ausschließlich für diese
        Benachrichtigungen genutzt und nicht weitergegeben. <em>Hinweis: Diese Funktion ist im
        MVP noch nicht aktiv.</em>
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit
        und Widerspruch sowie ein Beschwerderecht bei der österreichischen Datenschutzbehörde
        (dsb.gv.at).
      </p>

      <h2>Stand</h2>
      <p>
        Diese Erklärung wird bei Änderungen aktualisiert. <Todo>Vor Launch von einer
        Datenschutz-Fachperson prüfen lassen.</Todo>
      </p>
    </Prose>
  );
}
