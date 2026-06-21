import { describe, it, expect } from "vitest";
import { berufSchema } from "@/lib/berufSchema";

/**
 * The Beruf gate itself (getBerufIndexability) imports server-only data loaders,
 * so its cross-KV behaviour is covered by the build (data:validate referential
 * integrity + build report). Here we lock the Beruf schema contract.
 */
describe("berufSchema", () => {
  const valid = {
    id: "beruf-x",
    slug: "x-beruf",
    name: "Test Beruf",
    primaryKvId: "kv-handel-angestellte",
    typicalGroups: [{ kvId: "kv-handel-angestellte", groupCode: "C", rationale: "weil" }],
    sector: "Handel",
    confidence: "verified",
  };

  it("accepts a minimal valid beruf and defaults arrays", () => {
    const r = berufSchema.parse(valid);
    expect(r.synonyms).toEqual([]);
    expect(r.searchTermsDE).toEqual([]);
    expect(r.sourceUrls).toEqual([]);
  });

  it("rejects an unknown sector", () => {
    expect(berufSchema.safeParse({ ...valid, sector: "Mondbasis" }).success).toBe(false);
  });

  it("requires at least one typicalGroup", () => {
    expect(berufSchema.safeParse({ ...valid, typicalGroups: [] }).success).toBe(false);
  });

  it("enforces kebab-case slug", () => {
    expect(berufSchema.safeParse({ ...valid, slug: "Not Kebab" }).success).toBe(false);
  });
});
