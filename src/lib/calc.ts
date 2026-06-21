/**
 * Pure calculator logic — no React, no IO, fully unit-tested. Every function
 * returns ESTIMATES for orientation; the UI always adds the "im KV prüfen"
 * framing. A salary of 0 is the "not yet transcribed" sentinel and is treated
 * as "unbekannt" by callers, never as a real minimum.
 */

export interface IncreaseResult {
  /** Absolute monthly increase applied (after any cap). */
  increaseEUR: number;
  /** Resulting gross. */
  newGrossEUR: number;
  /** Whether the cap limited the increase. */
  capped: boolean;
}

/**
 * Apply a percentage increase to a gross amount, optionally capped at a maximum
 * absolute monthly amount (capEUR). Rounding to cents.
 */
export function applyIncrease(grossEUR: number, percent: number, capEUR?: number): IncreaseResult {
  const raw = (grossEUR * percent) / 100;
  const capped = capEUR != null && raw > capEUR;
  const increaseEUR = round2(capped ? capEUR! : raw);
  return { increaseEUR, newGrossEUR: round2(grossEUR + increaseEUR), capped };
}

export interface MinCheckResult {
  minimumEUR: number;
  grossEUR: number;
  /** gross - minimum; positive = above minimum. */
  differenceEUR: number;
  isAboveMinimum: boolean;
  /** How far above/below as a share of the minimum, e.g. 0.05 = 5% above. */
  ratio: number;
}

/** Compare a user's gross to the KV minimum for their group/step. */
export function checkMinimum(grossEUR: number, minimumEUR: number): MinCheckResult {
  const differenceEUR = round2(grossEUR - minimumEUR);
  return {
    minimumEUR,
    grossEUR,
    differenceEUR,
    isAboveMinimum: differenceEUR >= 0,
    ratio: minimumEUR > 0 ? differenceEUR / minimumEUR : 0,
  };
}

export interface LadderStep {
  stepLabel: string;
  minSalaryEUR: number;
  afterYears?: number;
}

export interface VorrueckungEvent {
  stepLabel: string;
  minSalaryEUR: number;
  afterYears: number;
  /** ISO date when this step is reached, given the start date + start seniority. */
  reachedOn: string;
}

/**
 * Build a Vorrückung timeline. Requires steps to carry `afterYears`. Steps the
 * user has already passed (afterYears <= startYears) are excluded from the
 * future timeline. Returns events sorted by date. If no step has afterYears,
 * returns [] and the UI shows the ladder instead.
 */
export function vorrueckungTimeline(
  steps: LadderStep[],
  startISO: string,
  startYears: number,
): VorrueckungEvent[] {
  const dated = steps.filter((s): s is Required<LadderStep> => s.afterYears != null);
  if (dated.length === 0) return [];
  const [y, m, d] = startISO.split("-").map(Number);
  return dated
    .filter((s) => s.afterYears > startYears)
    .sort((a, b) => a.afterYears - b.afterYears)
    .map((s) => {
      const yearsFromStart = s.afterYears - startYears;
      const dt = new Date(Date.UTC(y + yearsFromStart, m - 1, d));
      return {
        stepLabel: s.stepLabel,
        minSalaryEUR: s.minSalaryEUR,
        afterYears: s.afterYears,
        reachedOn: dt.toISOString().slice(0, 10),
      };
    });
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** A salary value is "known" only if it is a positive number (0 = sentinel). */
export function isKnownAmount(eur: number): boolean {
  return Number.isFinite(eur) && eur > 0;
}
