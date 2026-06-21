"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CalcKv } from "@/lib/calcData";
import { isKnownAmount } from "@/lib/calc";
import { formatEUR } from "@/lib/format";
import { Field, Select, NumberInput, ResultBox, SENTINEL_NOTE } from "./ui";

const LEVELS = [
  { value: 0, label: "Einfache Tätigkeit (kurze Einschulung)" },
  { value: 1, label: "Angelernte Tätigkeit" },
  { value: 2, label: "Qualifiziert (einschlägige Ausbildung)" },
  { value: 3, label: "Anspruchsvoll / eigenverantwortlich" },
];

/**
 * Heuristic suggestion only. Maps a self-assessed qualification level to a
 * group (by ordinal position) and the years to a step. Always framed as a
 * "Vorschlag, im KV prüfen" — never a binding classification.
 */
export function EinstufungAssistent({ kvs, initialSlug }: { kvs: CalcKv[]; initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug && kvs.some((k) => k.slug === initialSlug) ? initialSlug : kvs[0]?.slug ?? "");
  const kv = kvs.find((k) => k.slug === slug);
  const [level, setLevel] = useState(2);
  const [years, setYears] = useState("0");

  const suggestion = useMemo(() => {
    if (!kv || kv.groups.length === 0) return null;
    const idx = Math.round((level / 3) * (kv.groups.length - 1));
    const group = kv.groups[Math.min(idx, kv.groups.length - 1)];
    const y = Number(years) || 0;
    const dated = group.steps.filter((s) => s.afterYears != null);
    const step =
      dated.length > 0
        ? [...dated].sort((a, b) => (b.afterYears! - a.afterYears!)).find((s) => s.afterYears! <= y) ?? group.steps[0]
        : group.steps[0];
    return { group, step };
  }, [kv, level, years]);

  return (
    <div className="grid gap-4 sm:max-w-xl">
      <Field label="Kollektivvertrag">
        <Select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {kvs.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.shortName ?? k.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Wie würdest du deine Tätigkeit einordnen?">
        <Select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Anrechenbare Jahre (inkl. Vordienstzeiten)">
        <NumberInput value={years} onChange={(e) => setYears(e.target.value)} min={0} step={1} />
      </Field>

      {suggestion && (
        <ResultBox tone="ok">
          <p>
            <strong>Vorschlag:</strong> Gruppe {suggestion.group.code}
            {suggestion.group.name ? ` (${suggestion.group.name})` : ""}, Stufe „{suggestion.step.stepLabel}“.
          </p>
          <p className="mt-1">
            Mindestgehalt:{" "}
            <strong>
              {isKnownAmount(suggestion.step.minSalaryEUR) ? formatEUR(suggestion.step.minSalaryEUR) : "wird geprüft"}
            </strong>
            .
          </p>
          <p className="mt-2 text-xs">
            Nur ein Vorschlag auf Basis deiner Angaben — die verbindliche Einstufung richtet sich nach
            den Tätigkeitsmerkmalen des offiziellen KV.{" "}
            {kv && (
              <Link href={`/kv/${kv.slug}`} className="underline">
                Zur KV-Seite
              </Link>
            )}
          </p>
        </ResultBox>
      )}

      {kv && !kv.groups.some((g) => g.steps.some((s) => isKnownAmount(s.minSalaryEUR))) && (
        <ResultBox tone="warn">{SENTINEL_NOTE}</ResultBox>
      )}
    </div>
  );
}
