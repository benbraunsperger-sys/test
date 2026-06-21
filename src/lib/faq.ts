import type { CollectiveAgreement } from "./schema";
import { getCurrentPeriod } from "./data";
import { formatDate, formatEUR, formatPercent } from "./format";
import { isKnownAmount } from "./calc";

export interface Faq {
  q: string;
  a: string;
}

/**
 * Build FAQ entries from STRUCTURED FACTS only (never invented prose). Only
 * questions whose answer is fully backed by data are emitted — so FAQPage
 * JSON-LD stays truthful.
 */
export function buildKvFaqs(kv: CollectiveAgreement): Faq[] {
  const faqs: Faq[] = [];
  const period = getCurrentPeriod(kv);

  if (period.increaseKVPercent != null) {
    faqs.push({
      q: `Um wie viel steigen die KV-Mindestgehälter im ${kv.shortName ?? kv.name}?`,
      a: `Die kollektivvertraglichen Mindestbeträge steigen um ${formatPercent(period.increaseKVPercent)} ab ${formatDate(period.validFrom)}.${
        period.capEUR != null ? ` Für die IST-Erhöhung gilt eine Deckelung von ${formatEUR(period.capEUR)}.` : ""
      }`,
    });
  }

  // Lowest known entry minimum across the table.
  const knownAmounts = kv.groups
    .flatMap((g) => g.steps)
    .filter((s) => isKnownAmount(s.minSalaryEUR))
    .map((s) => s.minSalaryEUR);
  if (knownAmounts.length > 0) {
    faqs.push({
      q: `Wie hoch ist das niedrigste KV-Mindestgehalt?`,
      a: `Das niedrigste erfasste Mindestgehalt beträgt ${formatEUR(Math.min(...knownAmounts))} (Stand ${formatDate(kv.lastChecked)}). Die genauen Beträge je Gruppe und Stufe stehen in der Gehaltstabelle.`,
    });
  }

  if (kv.apprenticePay && kv.apprenticePay.length > 0) {
    const first = kv.apprenticePay.find((a) => a.year === 1) ?? kv.apprenticePay[0];
    faqs.push({
      q: `Wie viel verdienen Lehrlinge im ${kv.shortName ?? kv.name}?`,
      a: `Das Lehrlingseinkommen im ${first.year}. Lehrjahr beträgt ${formatEUR(first.amountEUR)} pro Monat (ab ${formatDate(first.validFrom)}). Die weiteren Lehrjahre sind in der Tabelle aufgeführt.`,
    });
  }

  faqs.push({
    q: `Wonach richtet sich die Einstufung?`,
    a: `Die Einstufung richtet sich nach der tatsächlich ausgeübten Tätigkeit, nicht nach der Berufsbezeichnung. Maßgeblich sind die Tätigkeitsmerkmale des offiziellen Kollektivvertrags.`,
  });

  return faqs;
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
