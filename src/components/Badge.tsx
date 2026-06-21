import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "accent" | "warn" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-subtle text-ink-soft border-surface-border",
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  accent: "bg-accent-soft text-accent border-accent/30",
  warn: "bg-warn-soft text-warn border-warn/30",
  muted: "bg-surface-subtle text-ink-muted border-surface-border",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/** Maps a validity status to a coloured badge. */
export function StatusBadge({ status }: { status: string }) {
  const tone: Tone = status === "gültig" ? "accent" : status === "angekündigt" ? "brand" : "muted";
  return <Badge tone={tone}>{status}</Badge>;
}

/** Maps data confidence to a badge (transparency about verification state). */
export function ConfidenceBadge({ confidence }: { confidence: string }) {
  if (confidence === "verified") return <Badge tone="accent">geprüft</Badge>;
  if (confidence === "likely") return <Badge tone="brand">plausibel</Badge>;
  return <Badge tone="warn">in Prüfung</Badge>;
}
