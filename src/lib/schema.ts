import { z } from "zod";
import {
  SECTORS,
  EMPLOYEE_TYPES,
  COUNTRIES,
  VALIDITY_STATUS,
  CONFIDENCE,
  SALARY_BASIS,
} from "./vocab";

/**
 * Zod is the single source of truth for the data model. Every KV record is
 * validated against this schema at build time; an invalid record FAILS the
 * build (see scripts/validate-data.ts).
 */

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum muss ISO YYYY-MM-DD sein");

const eur = z
  .number()
  .nonnegative("Betrag darf nicht negativ sein")
  .finite();

const url = z.string().url("Muss eine gültige URL sein");

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug muss kebab-case sein");

export const stepSchema = z.object({
  /** Verwendungsgruppenjahr / Stufe, e.g. "Im 1. u. 2. Jahr" or "nach 2 Jahren". */
  stepLabel: z.string().min(1),
  validFrom: isoDate,
  minSalaryEUR: eur,
  basis: z.enum(SALARY_BASIS),
});

export const groupSchema = z.object({
  /** Verwendungsgruppe / Lohngruppe / Beschäftigungsgruppe code, e.g. "III". */
  code: z.string().min(1),
  name: z.string().optional(),
  /** Tätigkeitsmerkmale summarised IN OUR OWN WORDS. Never verbatim KV prose. */
  criteriaSummary: z.string().min(1),
  steps: z.array(stepSchema).min(1, "Jede Gruppe braucht mindestens eine Stufe"),
});

export const validityPeriodSchema = z.object({
  id: z.string().min(1),
  validFrom: isoDate,
  validTo: isoDate.optional(),
  status: z.enum(VALIDITY_STATUS),
  increaseKVPercent: z.number().optional(),
  increaseISTPercent: z.number().optional(),
  capEUR: eur.optional(),
  sourceUrl: url,
  notes: z.string().optional(),
});

export const apprenticePaySchema = z.object({
  year: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  validFrom: isoDate,
  amountEUR: eur,
});

export const allowanceSchema = z.object({
  name: z.string().min(1),
  amountEUR: eur,
  basis: z.enum(SALARY_BASIS),
  validFrom: isoDate,
});

export const seoSchema = z.object({
  title: z.string().min(10).max(70),
  metaDescription: z.string().min(50).max(170),
  h1: z.string().min(3),
});

export const collectiveAgreementSchema = z
  .object({
    id: z.string().min(1),
    slug,
    name: z.string().min(5),
    shortName: z.string().optional(),
    sector: z.enum(SECTORS),
    employeeType: z.enum(EMPLOYEE_TYPES),
    country: z.enum(COUNTRIES).default("AT"),
    region: z.string().optional(),
    parties: z.object({
      employer: z.array(z.string().min(1)).min(1),
      unions: z.array(z.string().min(1)).min(1),
    }),
    validityPeriods: z
      .array(validityPeriodSchema)
      .min(1, "Mindestens ein Gültigkeitszeitraum"),
    groups: z.array(groupSchema).default([]),
    apprenticePay: z.array(apprenticePaySchema).optional(),
    allowances: z.array(allowanceSchema).optional(),
    /** How to read groups/steps and Vorrückung — OUR words. */
    classificationNotes: z.string().min(1),
    sourceUrls: z.array(url).min(1, "Mindestens eine offizielle Quelle"),
    lastChecked: isoDate,
    confidence: z.enum(CONFIDENCE),
    manualReview: z.boolean().default(false),
    active: z.boolean().default(true),
    relatedKvIds: z.array(z.string()).optional(),
    seo: seoSchema,
  })
  .strict();

export type CollectiveAgreement = z.infer<typeof collectiveAgreementSchema>;
export type ValidityPeriod = z.infer<typeof validityPeriodSchema>;
export type Group = z.infer<typeof groupSchema>;
export type Step = z.infer<typeof stepSchema>;
export type ApprenticePay = z.infer<typeof apprenticePaySchema>;
export type Allowance = z.infer<typeof allowanceSchema>;

/** Phrases that must never appear — INFORMATION, NOT ADVICE guardrail. */
export const PROHIBITED_ADVICE_PATTERNS: RegExp[] = [
  /\brechtsberatung\b/i,
  /\bsteuerberatung\b/i,
  /\bwir empfehlen ihnen rechtlich\b/i,
  /\bgarantiert(?:er|es)? anspruch\b/i,
  /\brechtsverbindlich(?:er|es)? anspruch\b/i,
  /\bverbindliche zusage\b/i,
];
