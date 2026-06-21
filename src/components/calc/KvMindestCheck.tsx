"use client";

import { useMemo, useState } from "react";
import type { CalcKv } from "@/lib/calcData";
import { checkMinimum, isKnownAmount } from "@/lib/calc";
import { formatEUR, formatPercent } from "@/lib/format";
import { Field, Select, NumberInput, ResultBox, SENTINEL_NOTE } from "./ui";

export function KvMindestCheck({ kvs, initialSlug }: { kvs: CalcKv[]; initialSlug?: string }) {
  const [slug, setSlug] = useState(initialSlug && kvs.some((k) => k.slug === initialSlug) ? initialSlug : kvs[0]?.slug ?? "");
  const kv = kvs.find((k) => k.slug === slug);
  const [groupCode, setGroupCode] = useState(kv?.groups[0]?.code ?? "");
  const group = kv?.groups.find((g) => g.code === groupCode) ?? kv?.groups[0];
  const [stepLabel, setStepLabel] = useState(group?.steps[0]?.stepLabel ?? "");
  const step = group?.steps.find((s) => s.stepLabel === stepLabel) ?? group?.steps[0];
  const [gross, setGross] = useState("");

  const minimum = step?.minSalaryEUR ?? 0;
  const known = isKnownAmount(minimum);
  const grossNum = Number(gross.replace(",", "."));
  const result = useMemo(
    () => (known && gross !== "" && Number.isFinite(grossNum) ? checkMinimum(grossNum, minimum) : null),
    [known, gross, grossNum, minimum],
  );

  function onKv(s: string) {
    setSlug(s);
    const k = kvs.find((x) => x.slug === s);
    const g = k?.groups[0];
    setGroupCode(g?.code ?? "");
    setStepLabel(g?.steps[0]?.stepLabel ?? "");
  }
  function onGroup(code: string) {
    setGroupCode(code);
    const g = kv?.groups.find((x) => x.code === code);
    setStepLabel(g?.steps[0]?.stepLabel ?? "");
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

      {kv && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gruppe">
            <Select value={groupCode} onChange={(e) => onGroup(e.target.value)}>
              {kv.groups.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.code}
                  {g.name ? ` – ${g.name}` : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Stufe">
            <Select value={stepLabel} onChange={(e) => setStepLabel(e.target.value)}>
              {group?.steps.map((s) => (
                <option key={s.stepLabel} value={s.stepLabel}>
                  {s.stepLabel}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      )}

      <Field label="Dein Bruttogehalt (EUR / Monat)">
        <NumberInput value={gross} onChange={(e) => setGross(e.target.value)} placeholder="z. B. 2500" min={0} />
      </Field>

      {!known && <ResultBox tone="warn">{SENTINEL_NOTE}</ResultBox>}

      {known && (
        <ResultBox>
          KV-Mindestgehalt für {groupCode} / {stepLabel}: <strong>{formatEUR(minimum)}</strong>
        </ResultBox>
      )}

      {result && (
        <ResultBox tone={result.isAboveMinimum ? "ok" : "warn"}>
          {result.isAboveMinimum ? (
            <>
              Dein Gehalt liegt <strong>{formatEUR(result.differenceEUR)}</strong> über dem
              KV-Mindestgehalt ({formatPercent(result.ratio * 100)} darüber).
            </>
          ) : (
            <>
              Dein Gehalt liegt <strong>{formatEUR(Math.abs(result.differenceEUR))}</strong> unter dem
              KV-Mindestgehalt. Bitte im offiziellen KV prüfen — Mindestgehälter sind verbindlich.
            </>
          )}
        </ResultBox>
      )}
    </div>
  );
}
