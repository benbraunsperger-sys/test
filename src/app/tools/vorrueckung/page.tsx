import type { Metadata } from "next";
import { ToolStub } from "@/components/ToolStub";

export const metadata: Metadata = {
  title: "Vorrückungs-Rechner",
  description: "Gruppe, Startstufe und Startdatum eingeben — Zeitleiste der künftigen Stufensprünge und Mindestgehälter. Schätzung, im KV prüfen.",
};

export default function Page() {
  return (
    <ToolStub
      slug="vorrueckung"
      title="Vorrückungs-Rechner"
      desc="Aus Gruppe, Startstufe und Startdatum eine Zeitleiste der künftigen Stufensprünge und der jeweiligen Mindestgehälter berechnen."
    />
  );
}
