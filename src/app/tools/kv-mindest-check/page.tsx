import type { Metadata } from "next";
import { ToolStub } from "@/components/ToolStub";

export const metadata: Metadata = {
  title: "KV-Mindest-Check",
  description: "Prüfe, ob dein Bruttogehalt über dem KV-Mindestgehalt deiner Gruppe und Stufe liegt. Schätzung, keine Beratung.",
};

export default function Page() {
  return (
    <ToolStub
      slug="kv-mindest-check"
      title="KV-Mindest-Check"
      desc="KV, Gruppe und Stufe wählen, Bruttogehalt eingeben — und sehen, ob du über oder unter dem KV-Mindestgehalt liegst."
    />
  );
}
