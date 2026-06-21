"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { KvIndexItem } from "@/lib/searchIndex";
import { Badge, StatusBadge, ConfidenceBadge } from "@/components/Badge";
import { formatDate, formatPercent } from "@/lib/format";

/**
 * Faceted directory: client-side fuzzy search (Fuse.js) over a prebuilt index +
 * Branche / Typ / Status facets. No network, no personal data. The full list is
 * server-rendered for SEO; this only filters it.
 */
export function DirectoryExplorer({
  items,
  initialQuery = "",
}: {
  items: KvIndexItem[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sectors, setSectors] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Set<string>>(new Set());

  const allSectors = useMemo(() => [...new Set(items.map((i) => i.sector))].sort(), [items]);
  const allTypes = useMemo(() => [...new Set(items.map((i) => i.employeeType))].sort(), [items]);
  const allStatuses = useMemo(() => [...new Set(items.map((i) => i.status))].sort(), [items]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["name", "shortName", "sector", "employeeType"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [items],
  );

  const results = useMemo(() => {
    let base = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : items;
    if (sectors.size) base = base.filter((i) => sectors.has(i.sector));
    if (types.size) base = base.filter((i) => types.has(i.employeeType));
    if (statuses.size) base = base.filter((i) => statuses.has(i.status));
    return base;
  }, [query, fuse, items, sectors, types, statuses]);

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  }

  const Facet = ({
    legend,
    values,
    selected,
    onToggle,
  }: {
    legend: string;
    values: string[];
    selected: Set<string>;
    onToggle: (v: string) => void;
  }) => (
    <fieldset className="space-y-1">
      <legend className="text-sm font-semibold text-ink">{legend}</legend>
      {values.map((v) => (
        <label key={v} className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={selected.has(v)}
            onChange={() => onToggle(v)}
            className="rounded border-surface-border"
          />
          {v}
        </label>
      ))}
    </fieldset>
  );

  return (
    <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
      <aside className="space-y-5">
        <label className="block">
          <span className="sr-only">Suche</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen…"
            className="w-full rounded-md border border-surface-border px-3 py-2 text-sm"
          />
        </label>
        <Facet legend="Branche" values={allSectors} selected={sectors} onToggle={(v) => toggle(sectors, setSectors, v)} />
        <Facet legend="Typ" values={allTypes} selected={types} onToggle={(v) => toggle(types, setTypes, v)} />
        <Facet legend="Status" values={allStatuses} selected={statuses} onToggle={(v) => toggle(statuses, setStatuses, v)} />
        {(sectors.size > 0 || types.size > 0 || statuses.size > 0 || query.length > 0) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSectors(new Set());
              setTypes(new Set());
              setStatuses(new Set());
            }}
            className="text-sm text-brand-600 hover:underline"
          >
            Filter zurücksetzen
          </button>
        )}
      </aside>

      <div>
        <p className="mb-3 text-sm text-ink-muted">
          {results.length} {results.length === 1 ? "Treffer" : "Treffer"}
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.map((kv) => (
            <li key={kv.id}>
              <Link
                href={`/kv/${kv.slug}`}
                className="block h-full rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={kv.status} />
                  <ConfidenceBadge confidence={kv.confidence} />
                  {kv.increaseKVPercent != null && (
                    <Badge tone="brand">+{formatPercent(kv.increaseKVPercent)} KV</Badge>
                  )}
                </div>
                <h3 className="font-semibold leading-snug text-ink">{kv.shortName ?? kv.name}</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  {kv.sector} · {kv.employeeType} · geprüft {formatDate(kv.lastChecked)}
                </p>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="text-ink-muted">Keine Kollektivverträge für diese Auswahl.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
