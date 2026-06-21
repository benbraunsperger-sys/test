import { SITE } from "@/lib/site";

/**
 * Global disclaimer — INFORMATION, NOT ADVICE guardrail. Rendered on every KV
 * page and every tool. Mirrors the official "Angaben ohne Gewähr".
 */
export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <aside
      role="note"
      className={`rounded-lg border border-surface-border bg-surface-subtle p-4 text-sm text-ink-soft ${className}`}
    >
      <p>
        <strong>Hinweis:</strong> {SITE.defaultDisclaimerShort} Die Mindestgehälter werden
        jährlich aktualisiert; das angezeigte „zuletzt geprüft“-Datum gibt den Stand unserer
        letzten Kontrolle an.
      </p>
    </aside>
  );
}

/** Compact inline variant for calculator outputs. */
export function ToolDisclaimer() {
  return (
    <p className="mt-3 text-xs text-ink-muted">
      Ergebnis ist eine Schätzung zu Informationszwecken — keine Rechts-, Steuer- oder
      Gehaltsberatung. Bitte im offiziellen Kollektivvertrag prüfen.
    </p>
  );
}
