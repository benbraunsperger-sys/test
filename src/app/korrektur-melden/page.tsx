import type { Metadata } from "next";
import { Prose } from "@/components/Prose";
import { KorrekturForm } from "@/components/KorrekturForm";
import { loadAllKvs } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Korrektur melden",
  description: `Einen falschen Wert in einer Gehaltstabelle melden — ${SITE.name} prüft jeden Hinweis gegen die offizielle Quelle.`,
};

// TODO(owner): wire to a real inbox or a serverless handler.
const CORRECTION_EMAIL = "korrektur@kv-radar.example";

export default function KorrekturPage() {
  const kvs = loadAllKvs().map((k) => ({ slug: k.slug, name: k.shortName ?? k.name }));
  return (
    <Prose
      title="Korrektur melden"
      intro="Hast du einen falschen Wert entdeckt? Melde ihn uns — wir prüfen jeden Hinweis gegen die offizielle Quelle und korrigieren zeitnah."
      crumbs={[{ name: "Start", href: "/" }, { name: "Korrektur melden", href: "/korrektur-melden" }]}
    >
      <KorrekturForm kvs={kvs} email={CORRECTION_EMAIL} />
      <p className="mt-4 text-xs text-ink-muted">
        Hinweis: Der Versand läuft aktuell über deinen E-Mail-Client. {SITE.name} bietet Information,
        keine Beratung.
      </p>
    </Prose>
  );
}
