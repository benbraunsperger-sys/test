/**
 * Controlled vocabularies. Keep these closed sets so facets, filters and the
 * quality gate stay deterministic. Adding a value here is a deliberate act.
 */

export const SECTORS = [
  "Metallgewerbe",
  "Metallindustrie",
  "Handel",
  "Gewerbe, Handwerk und Dienstleistung",
  "Information und Consulting",
  "Informationstechnologie",
  "Hotel- und Gastgewerbe",
  "Bauindustrie und Baugewerbe",
  "Gebäudereinigung",
  "Sozialwirtschaft",
  "Spedition und Logistik",
  "Elektro- und Elektronikindustrie",
] as const;

export type Sector = (typeof SECTORS)[number];

export const EMPLOYEE_TYPES = ["Angestellte", "Arbeiter", "Beide", "Lehrlinge"] as const;
export type EmployeeType = (typeof EMPLOYEE_TYPES)[number];

export const COUNTRIES = ["AT", "DE", "CH"] as const;
export type Country = (typeof COUNTRIES)[number];

export const VALIDITY_STATUS = ["gültig", "angekündigt", "ausgelaufen"] as const;
export type ValidityStatus = (typeof VALIDITY_STATUS)[number];

export const CONFIDENCE = [
  "verified",
  "verified-pending-human",
  "likely",
  "needs-review",
] as const;
export type Confidence = (typeof CONFIDENCE)[number];

export const SALARY_BASIS = ["Monat", "Stunde"] as const;
export type SalaryBasis = (typeof SALARY_BASIS)[number];

/** Map a sector to its facet/landing slug. */
export function sectorSlug(sector: string): string {
  return sector
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
