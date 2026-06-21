import type { Metadata } from "next";
import { ToolStub } from "@/components/ToolStub";

export const metadata: Metadata = {
  title: "KV-Erhöhungs-Rechner",
  description: "Aktuelles Bruttogehalt eingeben, KV und Jahr wählen — die KV/IST-Erhöhung (inkl. Deckelung) anwenden und das neue Gehalt sehen.",
};

export default function Page() {
  return (
    <ToolStub
      slug="kv-erhoehung"
      title="KV-Erhöhungs-Rechner"
      desc="Aktuelles Bruttogehalt eingeben, KV und Jahr wählen und die KV- bzw. IST-Erhöhung (mit etwaiger Deckelung) auf dein Gehalt anwenden."
    />
  );
}
