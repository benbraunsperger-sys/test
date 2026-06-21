"use client";

import { useMemo, useState } from "react";
import type { CalcKv } from "@/lib/calcData";
import { vorrueckungTimeline, isKnownAmount } from "@/lib/calc";
import { formatEUR, formatDate } from "@/lib/format";
import { Field, Select, NumberInput, ResultBox, SENTINEL_NOTE } from "./ui";

export function VorrueckungRechner({ kvs, initialSlug }: { kvs: CalcKv[]; initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug && kvs.some((k) => k.slug === initialSlug) ? initialSlug : kvs[0]?.slug ?? "");
  const kv = kvs.find((k) => k.slug === slug);
  const [groupCode, setGroupCode] = useState(kv?.groups[0]?.code ?? "");
  const group = kv?.groups.find((g) => g.code === groupCode) ?? kv?.groups[0];
  const [startDate, setStartDate] = useState("2026-01-01");
  const [startYears, setStartYears] = useState("0");

  const steps = group?.steps ?? [];
  const hasYears = steps.some((s) => s.afterYears != null);
  const timeline = useMemo(
    () => vorrueckungTimeline(steps, startDate, Number(startYears) || 0),
    [steps, startDate, startYears],
  );
  const amountsKnown = steps.some((s) => isKnownAmount(s.minSalaryEUR));

  function onKv(s: string) {
    setSlug(s);
    setGroupCode(kvs.find((x) => x.slug === s)?.groups[0]?.code ?? "");
  }

  return (
    <div className="grid gap-4 sm:max-w-xl">
      <Field label="Kollektivvertrag">
        <Select value={slug} onChange={(e) => onKv(e.target.value)}>
          {kvs.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.shortName ?? k.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Gruppe">
        <Select value={groupCode} onChange={(e) => setGroupCode(e.target.value)}>
          {kv?.groups.map((g) => (
            <option key={g.code} value={g.code}>
              {g.code}
              {g.name ? ` – ${g.name}` : ""}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eintrittsdatum in die Gruppe">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-surface-border px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Bereits anrechenbare Jahre">
          <NumberInput value={startYears} onChange={(e) => setStartYears(e.target.value)} min={0} step={1} />
        </Field>
      </div>

      {!amountsKnown && <ResultBox tone="warn">{SENTINEL_NOTE}</ResultBox>}

      {hasYears ? (
        timeline.length > 0 ? (
          <div>
            <h3 className="mb-2 text-sm font-semibold">Künftige Vorrückungen</h3>
            <ol className="space-y-2">
              {timeline.map((e) => (
                <li key={e.afterYears} className="flex items-center justify-between rounded-md border border-surface-border bg-surface p-3 text-sm">
                  <span>
                    {formatDate(e.reachedOn)} · {e.stepLabel}
                  </span>
                  <span className="font-mono">{isKnownAmount(e.minSalaryEUR) ? formatEUR(e.minSalaryEUR) : "wird geprüft"}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ResultBox>Keine weitere Vorrückung in dieser Gruppe ab den angegebenen Jahren.</ResultBox>
        )
      ) : (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Stufenleiter (ohne hinterlegte Jahresgrenzen)</h3>
          <p className="mb-2 text-xs text-ink-muted">
            Für diesen KV sind die Jahresgrenzen je Stufe noch nicht strukturiert erfasst. Die Reihenfolge der Stufen:
          </p>
          <ol className="space-y-2">
            {steps.map((s) => (
              <li key={s.stepLabel} className="flex items-center justify-between rounded-md border border-surface-border bg-surface p-3 text-sm">
                <span>{s.stepLabel}</span>
                <span className="font-mono">{isKnownAmount(s.minSalaryEUR) ? formatEUR(s.minSalaryEUR) : "wird geprüft"}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
