import { ImageResponse } from "next/og";
import { loadAllBerufe, getBerufBySlug, resolveBeruf } from "@/lib/berufe";
import { isKnownAmount } from "@/lib/calc";
import { formatEUR } from "@/lib/format";
import { SITE } from "@/lib/site";

export const alt = "Beruf & KV-Gehalt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return loadAllBerufe().map((b) => ({ slug: b.slug }));
}

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beruf = getBerufBySlug(slug);
  const name = beruf?.name ?? SITE.name;
  let line = beruf ? `${beruf.sector} · Kollektivvertrag` : "";
  if (beruf) {
    const { groups } = resolveBeruf(beruf);
    const entries = groups.map((g) => g.entryEUR).filter((v): v is number => v != null && isKnownAmount(v));
    if (entries.length) line = `KV-Mindestgehalt ab ${formatEUR(Math.min(...entries))} / Monat`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0f172a",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#5eead4", fontWeight: 700 }}>{SITE.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 16, color: "#cbd5e1" }}>Gehalt in Österreich 2026</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#5eead4" }}>{line}</div>
      </div>
    ),
    size,
  );
}
