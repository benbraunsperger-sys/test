import { describe, it, expect } from "vitest";
import { slugify, comparisonSlug, parseComparisonSlug } from "@/lib/slug";

describe("slugify", () => {
  it("handles German umlauts and ß", () => {
    expect(slugify("Gebäudereinigung")).toBe("gebaeudereinigung");
    expect(slugify("Groß & Klein")).toBe("gross-und-klein");
  });
  it("produces clean kebab-case", () => {
    expect(slugify("  Metallgewerbe, Angestellte  ")).toBe("metallgewerbe-angestellte");
  });
});

describe("comparisonSlug", () => {
  it("is order-independent", () => {
    expect(comparisonSlug("b", "a")).toBe(comparisonSlug("a", "b"));
    expect(comparisonSlug("a", "b")).toBe("a-vs-b");
  });
  it("round-trips", () => {
    expect(parseComparisonSlug("a-vs-b")).toEqual(["a", "b"]);
    expect(parseComparisonSlug("invalid")).toBeNull();
  });
});
