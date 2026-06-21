import { z } from "zod";
import { SECTORS, CONFIDENCE } from "./vocab";

/**
 * A Beruf (occupation) maps how civilians search ("Bürokauffrau Gehalt") onto a
 * KV + its likely Verwendungsgruppe(s). It never stores a salary itself — the
 * number is always RESOLVED live from the mapped, verified KV record. This keeps
 * one source of truth and prevents a job page from ever showing a stale figure.
 */
export const berufSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case"),
    name: z.string().min(2),
    synonyms: z.array(z.string()).default([]),
    primaryKvId: z.string().min(1),
    typicalGroups: z
      .array(
        z.object({
          kvId: z.string().min(1),
          groupCode: z.string().min(1),
          rationale: z.string().min(1), // OUR words: why this job sits here.
        }),
      )
      .min(1),
    sector: z.enum(SECTORS),
    searchTermsDE: z.array(z.string()).default([]),
    notes: z.string().optional(),
    confidence: z.enum(CONFIDENCE),
    sourceUrls: z.array(z.string().url()).default([]),
  })
  .strict();

export type Beruf = z.infer<typeof berufSchema>;
