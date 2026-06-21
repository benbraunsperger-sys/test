"use client";

import { useMemo, useState } from "react";
import type { Group } from "@/lib/schema";
import { formatEUR } from "@/lib/format";

/**
 * Interactive salary table: groups × steps. Client-side search/highlight only —
 * no network, no personal data. Steps whose amount is the "not yet transcribed"
 * sentinel (0) on an unverified record are shown as „wird geprüft" rather than
 * a misleading „0,00 €".
 */
export function KvTable({
  groups,
  unverified,
}: {
  groups: Group[];
  unverified: boolean;
}) {
  const [query, setQuery] = useState("");

  // Distinct step labels become columns; groups become rows.
  const stepLabels = useMemo(() => {
    const set = new Set<string>();
    for (const g of groups) for (const s of g.steps) set.add(s.stepLabel);
    return [...set];
  }, [groups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.code.toLowerCase().includes(q) ||
        (g.name ?? "").toLowerCase().includes(q) ||
        g.criteriaSummary.toLowerCase().includes(q),
    );
  }, [groups, query]);

  function cell(group: Group, label: string) {
    const step = group.steps.find((s) => s.stepLabel === label);
    if (!step) return <span className="text-ink-muted">–</span>;
    if (unverified && step.minSalaryEUR === 0) {
      return <span className="text-warn">wird geprüft</span>;
    }
    return formatEUR(step.minSalaryEUR);
  }

  return (
    <div>
      <label className="mb-3 block">
        <span className="sr-only">Verwendungsgruppe suchen</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Gruppe oder Tätigkeit filtern…"
          className="w-full max-w-sm rounded-md border border-surface-border px-3 py-2 text-sm"
        />
      </label>
      <div className="overflow-x-auto">
        <table className="kv-table">
          <caption className="sr-only">Mindestgehälter nach Gruppe und Stufe</caption>
          <thead>
            <tr>
              <th scope="col">Gruppe</th>
              {stepLabels.map((l) => (
                <th key={l} scope="col">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.code}>
                <th scope="row" className="font-semibold">
                  <span className="block">{g.code}</span>
                  {g.name && <span className="block text-xs font-normal text-ink-muted">{g.name}</span>}
                </th>
                {stepLabels.map((l) => (
                  <td key={l} className="num">
                    {cell(g, l)}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={stepLabels.length + 1} className="text-center text-ink-muted">
                  Keine Gruppe gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
