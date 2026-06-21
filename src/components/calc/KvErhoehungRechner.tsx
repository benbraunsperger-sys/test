"use client";

import { useMemo, useState } from "react";
import type { CalcKv } from "@/lib/calcData";
import { applyIncrease } from "@/lib/calc";
import { formatEUR, formatPercent, formatDate } from "@/lib/format";
import { Field, Select, NumberInput, ResultBox } from "./ui";

export function KvErhoehungRechner({ kvs, initialSlug }: { kvs: CalcKv[]; initialSlug?: string }) {
  const withIncrease = kvs.filter((k) => k.periods.some((p) => p.increaseKVPercent != null));
  const [slug, setSlug] = useState(
    initialSlug && withIncrease.some((k) => k.slug === initialSlug) ? initialSlug : withIncrease[0]?.slug ?? "",
  );
  const kv = withIncrease.find((k) => k.slug === slug);
  const periods = kv?.periods.filter((p) => p.increaseKVPercent != null) ?? [];
  const [periodId, setPeriodId] = useState(periods[0]?.id ?? "");
  const period = periods.find((p) => p.id === periodId) ?? periods[0];
  const [basis, setBasis] = useState<"KV" | "IST">("IST");
  const [gross, setGross] = useState("");

  const grossNum = Number(gross.replace(",", "."));
  const percent = basis === "IST" ? period?.increaseISTPercent ?? period?.increaseKVPercent : period?.increaseKVPercent;
  const cap = basis === "IST" ? period?.capEUR : undefined; // caps apply to IST raises.

  const result = useMemo(
    () =>
      period && percent != null && gross !== "" && Number.isFinite(grossNum)
        ? applyIncrease(grossNum, percent, cap)
        : null,
    [period, percent, cap, gross, grossNum],
  );

  function onKv(s: string) {
    setSlug(s);
    const k = withIncrease.find((x) => x.slug === s);
    setPeriodId(k?.periods.find((p) => p.increaseKVPercent != null)?.id ?? "");
  }

  return (
    <div className="grid gap-4 sm:max-w-xl">
      <Field label="Aktuelles Bruttogehalt (EUR / Monat)">
        <NumberInput value={gross} onChange={(e) => setGross(e.target.value)} placeholder="z. B. 3000" min={0} />
      </Field>
      <Field label="Kollektivvertrag">
        <Select value={slug} onChange={(e) => onKv(e.target.value)}>
          {withIncrease.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.shortName ?? k.name}
            </option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Zeitraum / Stufe">
          <Select value={periodId} onChange={(e) => setPeriodId(e.target.value)}>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                ab {formatDate(p.validFrom)} ({p.status})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Erhöhung anwenden auf">
          <Select value={basis} onChange={(e) => setBasis(e.target.value as "KV" | "IST")}>
            <option value="IST">IST-Gehalt (tatsächlich)</option>
            <option value="KV">KV-Mindestgehalt</option>
          </Select>
        </Field>
      </div>

      {period && percent != null && (
        <ResultBox>
          Angewandter Satz: <strong>{formatPercent(percent)}</strong>
          {cap != null ? ` (Deckelung ${formatEUR(cap)})` : ""}.
          {basis === "IST" && period.increaseISTPercent == null
            ? " Für diesen KV ist kein eigener IST-Satz hinterlegt; es wird der KV-Satz verwendet."
            : ""}
        </ResultBox>
      )}

      {result && (
        <ResultBox tone="ok">
          Neues Bruttogehalt: <strong>{formatEUR(result.newGrossEUR)}</strong> (+
          {formatEUR(result.increaseEUR)}{result.capped ? ", durch Deckelung begrenzt" : ""}).
        </ResultBox>
      )}
    </div>
  );
}
