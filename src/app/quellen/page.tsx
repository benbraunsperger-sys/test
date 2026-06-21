import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { loadAllKvs } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quellen",
  description: `Offizielle Quellen, die ${SITE.name} für Kollektivvertrags-Daten nutzt und verlinkt.`,
};

export default function QuellenPage() {
  const kvs = loadAllKvs();
  const allSources = Array.from(new Set(kvs.flatMap((kv) => kv.sourceUrls))).sort();

  return (
    <Prose
      title="Quellen"
      intro="Wir verlinken ausschließlich offizielle, frei zugängliche Quellen und umgehen keine Bezahlschranken."
      crumbs={[{ name: "Start", href: "/" }, { name: "Quellen", href: "/quellen" }]}
    >
      <h2>Primärquellen</h2>
      <ul>
        <li>
          <a href="https://www.wko.at/kollektivvertrag" target="_blank" rel="noopener noreferrer nofollow">
            WKO – Kollektivverträge
          </a>
        </li>
        <li>
          <a href="https://www.kollektivvertrag.at" target="_blank" rel="noopener noreferrer nofollow">
            kollektivvertrag.at (Sozialpartner-Portal)
          </a>
        </li>
        <li>
          <a href="https://www.gpa.at/kollektivvertrag" target="_blank" rel="noopener noreferrer nofollow">
            GPA – Kollektivverträge
          </a>
        </li>
        <li>
          <a href="https://www.proge.at/kollektivvertrag" target="_blank" rel="noopener noreferrer nofollow">
            PRO-GE – Kollektivverträge
          </a>
        </li>
        <li>
          <a href="https://www.oegb.at" target="_blank" rel="noopener noreferrer nofollow">
            ÖGB
          </a>
        </li>
      </ul>

      <h2>Direkt verlinkte Quellen in unserer Datenbank</h2>
      <ul>
        {allSources.map((u) => (
          <li key={u}>
            <a href={u} target="_blank" rel="noopener noreferrer nofollow">
              {u}
            </a>
          </li>
        ))}
      </ul>

      <p>
        Sollte eine Quelle nicht mehr erreichbar sein, melde dies bitte über{" "}
        <a href="/korrektur-melden">Korrektur melden</a>.
      </p>
    </Prose>
  );
}
