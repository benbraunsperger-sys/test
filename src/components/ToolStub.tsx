import { Breadcrumbs } from "@/components/Breadcrumbs";

/** Placeholder for calculators delivered in Phase 3. Carries the disclaimer via the tools layout. */
export function ToolStub({ slug, title, desc }: { slug: string; title: string; desc: string }) {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { name: "Start", href: "/" },
          { name: "Tools", href: "/tools/kv-mindest-check" },
          { name: title, href: `/tools/${slug}` },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-prose text-ink-soft">{desc}</p>
      <p className="rounded-lg border border-surface-border bg-surface-subtle p-4 text-sm text-ink-muted">
        Dieser Rechner wird gerade gebaut (Phase 3). Er arbeitet ausschließlich lokal im Browser,
        speichert keine Eingaben und liefert Schätzwerte zur Orientierung — keine verbindliche Zusage.
      </p>
    </div>
  );
}
