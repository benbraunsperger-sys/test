import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} – Kollektivvertrags-Gehaltstabellen Österreich`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #1e40af 0%, #0d9488 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.85 }}>{SITE.name}</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 20, lineHeight: 1.1 }}>
          Kollektivvertrags-Gehaltstabellen Österreich
        </div>
        <div style={{ fontSize: 30, marginTop: 24, opacity: 0.9 }}>
          Strukturiert · mit Quelle · kostenlos
        </div>
      </div>
    ),
    size,
  );
}
