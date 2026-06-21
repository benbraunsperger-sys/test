import { ImageResponse } from "next/og";
import { loadAllKvs, getKvBySlug, getCurrentPeriod } from "@/lib/data";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const alt = "KV-Gehaltstabelle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return loadAllKvs().map((kv) => ({ slug: kv.slug }));
}

export default async function Og({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kv = getKvBySlug(slug);
  const title = kv?.shortName ?? kv?.name ?? SITE.name;
  const period = kv ? getCurrentPeriod(kv) : null;
  const subline = kv ? `${kv.sector} · ${kv.employeeType}` : "";
  const footer = kv
    ? `${period ? `Aktuell ab ${formatDate(period.validFrom)} · ` : ""}zuletzt geprüft ${formatDate(kv.lastChecked)}`
    : "";

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
          background: "#f8fafc",
          color: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#1d4ed8", fontWeight: 700 }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#64748b" }}>{subline}</div>
          <div style={{ fontSize: 60, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#334155" }}>{footer}</div>
      </div>
    ),
    size,
  );
}
