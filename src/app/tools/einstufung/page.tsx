import type { Metadata } from "next";
import { ToolStub } from "@/components/ToolStub";

export const metadata: Metadata = {
  title: "Einstufungs-Assistent",
  description: "Tätigkeit, Ausbildung und Vordienstzeiten angeben — Vorschlag für die wahrscheinliche Verwendungsgruppe und Stufe. Im KV prüfen.",
};

export default function Page() {
  return (
    <ToolStub
      slug="einstufung"
      title="Einstufungs-Assistent"
      desc="Ein paar Fragen zu Tätigkeit, Ausbildung und Vordienstzeiten beantworten und einen Vorschlag für Verwendungsgruppe, Stufe und das resultierende Mindestgehalt erhalten."
    />
  );
}
