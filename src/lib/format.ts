/** Austrian (de-AT) locale formatting helpers. EUR, comma decimals. */

const eurFormatter = new Intl.NumberFormat("de-AT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("de-AT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const percentFormatter = new Intl.NumberFormat("de-AT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function formatEUR(amount: number): string {
  return eurFormatter.format(amount);
}

export function formatDate(iso: string): string {
  // iso is YYYY-MM-DD; construct as UTC to avoid TZ drift.
  const [y, m, d] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)} %`;
}

/** Days between an ISO date and now (positive = in the past). */
export function daysSince(iso: string, now: Date = new Date()): number {
  const [y, m, d] = iso.split("-").map(Number);
  const then = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((today - then) / 86_400_000);
}
