import Link from "next/link";
import type { CollectiveAgreement } from "@/lib/schema";
import { getCurrentPeriod } from "@/lib/data";
import { Badge, StatusBadge, ConfidenceBadge } from "@/components/Badge";
import { formatDate, formatPercent } from "@/lib/format";

/** Compact KV summary card used in the directory and sector pages. */
export function KvCard({ kv }: { kv: CollectiveAgreement }) {
  const period = getCurrentPeriod(kv);
  return (
    <Link
      href={`/kv/${kv.slug}`}
      className="block h-full rounded-lg border border-surface-border bg-surface p-4 hover:border-brand-500"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={period.status} />
        <ConfidenceBadge confidence={kv.confidence} />
        {period.increaseKVPercent != null && (
          <Badge tone="brand">+{formatPercent(period.increaseKVPercent)} KV</Badge>
        )}
      </div>
      <h3 className="font-semibold leading-snug text-ink">{kv.shortName ?? kv.name}</h3>
      <p className="mt-1 text-xs text-ink-muted">
        {kv.sector} · {kv.employeeType} · zuletzt geprüft {formatDate(kv.lastChecked)}
      </p>
    </Link>
  );
}
