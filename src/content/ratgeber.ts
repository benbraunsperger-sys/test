/**
 * Small, curated Ratgeber hub (max ~8). Evergreen explainers in OUR OWN words —
 * general knowledge about how the Austrian KV system works, not KV-specific
 * prose. No advice wording. Each article links to relevant tools/KVs.
 */

export interface RatgeberSection {
  h2: string;
  paragraphs: string[];
}

export interface RatgeberArticle {
  slug: string;
  title: string;
  description: string;
  h1: string;
  updated: string; // ISO
  sections: RatgeberSection[];
  relatedTools?: { href: string; label: string }[];
}

export const RATGEBER: RatgeberArticle[] = [
  {
    slug: "was-ist-ein-kollektivvertrag",
    title: "Was ist ein Kollektivvertrag? Einfach erklärt",
    description:
      "Ein Kollektivvertrag (KV) regelt Mindestlöhne und Arbeitsbedingungen für eine ganze Branche. So funktioniert das österreichische System — verständlich erklärt.",
    h1: "Was ist ein Kollektivvertrag?",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Definition",
        paragraphs: [
          "Ein Kollektivvertrag ist eine schriftliche Vereinbarung zwischen den Interessenvertretungen der Arbeitgeber (meist Fachverbände oder Innungen der Wirtschaftskammer) und der Arbeitnehmer (Gewerkschaften). Er legt für eine ganze Branche verbindliche Mindeststandards fest.",
          "In Österreich sind die meisten Arbeitsverhältnisse von einem Kollektivvertrag erfasst. Welcher KV gilt, hängt in der Regel von der Branche des Betriebs ab, nicht vom einzelnen Job.",
        ],
      },
      {
        h2: "Was ein KV regelt",
        paragraphs: [
          "Typische Inhalte sind Mindestgehälter bzw. Mindestlöhne nach Verwendungs- oder Lohngruppen, die Einstufungskriterien, Vorrückungen (Gehaltssprünge nach Dienstjahren), Lehrlingseinkommen, Zulagen, Arbeitszeit, Zuschläge und Sonderzahlungen.",
          "Der KV bildet eine Untergrenze: Bezahlt werden darf mehr, aber nicht weniger als der kollektivvertragliche Mindestbetrag.",
        ],
      },
      {
        h2: "Warum es jährliche Anpassungen gibt",
        paragraphs: [
          "Die Sozialpartner verhandeln meist jährlich über die Erhöhung der Mindestbeträge. Die neuen Tabellen treten zu unterschiedlichen, branchenspezifischen Stichtagen in Kraft — deshalb sind die Daten über viele Seiten verstreut.",
        ],
      },
    ],
    relatedTools: [
      { href: "/tools/kv-mindest-check", label: "KV-Mindest-Check" },
      { href: "/kollektivvertraege", label: "Alle Kollektivverträge" },
    ],
  },
  {
    slug: "einstufung-erklaert",
    title: "KV-Einstufung erklärt: Welche Gruppe gilt für mich?",
    description:
      "Die Einstufung im Kollektivvertrag richtet sich nach der tatsächlichen Tätigkeit, nicht nach dem Jobtitel. So liest du Verwendungsgruppen und Stufen.",
    h1: "Einstufung im Kollektivvertrag",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Tätigkeit zählt, nicht der Titel",
        paragraphs: [
          "Maßgeblich für die Einstufung ist, welche Tätigkeit tatsächlich ausgeübt wird — nicht die Berufsbezeichnung im Vertrag. Die KVs beschreiben dazu Tätigkeitsmerkmale je Gruppe.",
          "Je höher die Anforderungen an Ausbildung, Selbstständigkeit und Verantwortung, desto höher in der Regel die Gruppe.",
        ],
      },
      {
        h2: "Gruppen und Stufen",
        paragraphs: [
          "Innerhalb einer Gruppe gibt es meist mehrere Stufen, die mit den anrechenbaren Jahren (Verwendungsgruppen- oder Berufsjahren) steigen. Vordienstzeiten können angerechnet werden.",
        ],
      },
    ],
    relatedTools: [{ href: "/tools/einstufung", label: "Einstufungs-Assistent" }],
  },
  {
    slug: "verwendungsgruppen",
    title: "Verwendungsgruppen verstehen",
    description:
      "Verwendungsgruppen (bei Arbeitern oft Lohngruppen, im Handel Beschäftigungsgruppen) bündeln Tätigkeiten mit ähnlichem Anforderungsniveau. Ein Überblick.",
    h1: "Verwendungsgruppen verstehen",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Was eine Verwendungsgruppe ist",
        paragraphs: [
          "Eine Verwendungsgruppe fasst Tätigkeiten mit vergleichbarem Anforderungsniveau zusammen. Je nach KV heißen sie Verwendungsgruppen, Lohngruppen oder Beschäftigungsgruppen.",
          "Jeder Gruppe ist eine Mindestgehalts- bzw. Mindestlohnreihe zugeordnet, häufig zusätzlich gestaffelt nach Dienstjahren.",
        ],
      },
    ],
    relatedTools: [{ href: "/kollektivvertraege", label: "KV-Verzeichnis" }],
  },
  {
    slug: "vorrueckung",
    title: "Vorrückung: Wann steigt mein KV-Gehalt?",
    description:
      "Vorrückung bezeichnet den automatischen Anstieg des Mindestgehalts mit den Dienstjahren innerhalb einer Gruppe. So funktioniert sie.",
    h1: "Vorrückung im Kollektivvertrag",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Stufensprünge nach Jahren",
        paragraphs: [
          "Viele KVs sehen vor, dass das Mindestgehalt innerhalb einer Gruppe nach einer bestimmten Zahl an Jahren steigt — etwa nach 2 oder 4 Verwendungsgruppenjahren. Diese Sprünge nennt man Vorrückung.",
          "Die genauen Zeitpunkte und Beträge stehen im jeweiligen KV. Anrechenbare Vordienstzeiten können den Einstieg in eine höhere Stufe vorverlegen.",
        ],
      },
    ],
    relatedTools: [{ href: "/tools/vorrueckung", label: "Vorrückungs-Rechner" }],
  },
  {
    slug: "kv-mindestgehalt-vs-ist-gehalt",
    title: "KV-Mindestgehalt vs. IST-Gehalt",
    description:
      "Das KV-Mindestgehalt ist die verbindliche Untergrenze, das IST-Gehalt das tatsächlich bezahlte. Was der Unterschied für Erhöhungen bedeutet.",
    h1: "KV-Mindestgehalt vs. IST-Gehalt",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Zwei verschiedene Größen",
        paragraphs: [
          "Das KV-Mindestgehalt ist der niedrigste erlaubte Betrag für eine Gruppe und Stufe. Das IST-Gehalt ist das, was tatsächlich vereinbart und bezahlt wird — oft über dem Mindestgehalt (Überzahlung).",
          "Bei Abschlüssen werden häufig zwei Prozentsätze genannt: einer für die KV-Mindestgehälter und einer für die IST-Gehälter. Teils gibt es eine Deckelung (maximaler Euro-Betrag) für die IST-Erhöhung.",
        ],
      },
    ],
    relatedTools: [
      { href: "/tools/kv-mindest-check", label: "KV-Mindest-Check" },
      { href: "/tools/kv-erhoehung", label: "KV-Erhöhungs-Rechner" },
    ],
  },
  {
    slug: "lehrlingseinkommen",
    title: "Lehrlingseinkommen im Kollektivvertrag",
    description:
      "Das Lehrlingseinkommen (früher Lehrlingsentschädigung) steigt mit dem Lehrjahr und ist im KV geregelt. Ein kompakter Überblick.",
    h1: "Lehrlingseinkommen",
    updated: "2026-06-21",
    sections: [
      {
        h2: "Nach Lehrjahr gestaffelt",
        paragraphs: [
          "Das Lehrlingseinkommen ist im jeweiligen Kollektivvertrag festgelegt und steigt typischerweise mit jedem Lehrjahr. Die genauen Beträge unterscheiden sich je Branche.",
          "Bei den KV-Abschlüssen werden die Lehrlingseinkommen meist gesondert erhöht — oft mit einem eigenen Prozentsatz.",
        ],
      },
    ],
    relatedTools: [{ href: "/kollektivvertraege", label: "KV-Verzeichnis" }],
  },
];

export function getRatgeber(slug: string): RatgeberArticle | undefined {
  return RATGEBER.find((a) => a.slug === slug);
}
