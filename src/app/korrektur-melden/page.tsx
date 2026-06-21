import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Korrektur melden",
  description: `Einen falschen Wert in einer Gehaltstabelle melden — ${SITE.name} prüft jeden Hinweis gegen die offizielle Quelle.`,
};

// TODO(owner): wire this mailto to a real inbox or a serverless handler.
const CORRECTION_EMAIL = "korrektur@kv-radar.example";

export default function KorrekturPage() {
  const subject = encodeURIComponent("Korrektur-Hinweis");
  const body = encodeURIComponent(
    "KV / Seite:\nBetroffene Gruppe/Stufe:\nFalscher Wert:\nKorrekter Wert (laut offizieller Quelle):\nQuelle (URL):\n",
  );

  return (
    <Prose
      title="Korrektur melden"
      intro="Hast du einen falschen Wert entdeckt? Melde ihn uns — wir prüfen jeden Hinweis gegen die offizielle Quelle und korrigieren zeitnah."
      crumbs={[{ name: "Start", href: "/" }, { name: "Korrektur melden", href: "/korrektur-melden" }]}
    >
      <p>
        Am schnellsten per E-Mail mit Link zur offiziellen Quelle und dem korrekten Wert:
      </p>
      <p>
        <a
          href={`mailto:${CORRECTION_EMAIL}?subject=${subject}&body=${body}`}
          className="inline-block rounded-md bg-brand-600 px-4 py-2 font-medium text-white no-underline hover:bg-brand-700"
        >
          Korrektur per E-Mail senden
        </a>
      </p>
      <p className="text-sm">
        Bitte gib an: betroffener KV/Seite, Gruppe und Stufe, der falsche und der korrekte Wert
        sowie die offizielle Quelle. Wir verarbeiten ausschließlich die von dir übermittelten
        Angaben zur Bearbeitung des Hinweises.
      </p>
      <p className="text-xs text-ink-muted">
        Hinweis: Ein komfortables Formular mit Direktversand folgt; aktuell läuft die Meldung über
        deinen E-Mail-Client. {SITE.name} bietet Information, keine Beratung.
      </p>
    </Prose>
  );
}
