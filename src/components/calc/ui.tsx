"use client";

import type { ReactNode } from "react";

/** Shared form primitives for the calculators. */

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

export function Select({
  value,
  onChange,
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-surface-border bg-surface px-3 py-2 text-sm"
      {...rest}
    >
      {children}
    </select>
  );
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className="w-full rounded-md border border-surface-border px-3 py-2 text-sm"
      {...props}
    />
  );
}

export function ResultBox({ tone = "neutral", children }: { tone?: "ok" | "warn" | "neutral"; children: ReactNode }) {
  const cls =
    tone === "ok"
      ? "border-accent/40 bg-accent-soft text-ink"
      : tone === "warn"
        ? "border-warn/40 bg-warn-soft text-warn"
        : "border-surface-border bg-surface-subtle text-ink";
  return <div className={`rounded-lg border p-4 text-sm ${cls}`}>{children}</div>;
}

export const SENTINEL_NOTE =
  "Für diesen KV sind die genauen Beträge noch in Prüfung („wird geprüft“). Sobald sie aus der offiziellen Quelle übertragen sind, rechnet das Tool mit echten Zahlen.";
