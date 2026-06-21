import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: "Kompakt erklärt: Kollektivvertrag, Einstufung, Verwendungsgruppen, Vorrückung, KV- vs. IST-Gehalt, Lehrlingseinkommen.",
};

// Phase 4 fills this small hub (max ~8 articles). Listed here so navigation resolves.
const PLANNED = [
  "Was ist ein Kollektivvertrag?",
  "Einstufung erklärt",
  "Verwendungsgruppen verstehen",
  "Vorrückung",
  "KV-Mindestgehalt vs. IST-Gehalt",
  "Lehrlingseinkommen",
];

export default function RatgeberPage() {
  return (
    <Prose
      title="Ratgeber"
      intro="Ein kleiner, sorgfältig gepflegter Hub mit den wichtigsten Grundlagen rund um Kollektivverträge."
      crumbs={[{ name: "Start", href: "/" }, { name: "Ratgeber", href: "/ratgeber" }]}
    >
      <p>Die folgenden Beiträge folgen in Phase 4:</p>
      <ul>
        {PLANNED.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </Prose>
  );
}
