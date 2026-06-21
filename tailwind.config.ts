import type { Config } from "tailwindcss";

/**
 * Design tokens live here so a later design handoff can be dropped in by
 * editing this single file. Until then we use a calm, data-dense, trustworthy
 * default palette suited to dense salary tables.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand / trust palette (TODO: replace with final brand tokens).
        ink: {
          DEFAULT: "#0f172a", // slate-900
          soft: "#334155", // slate-700
          muted: "#64748b", // slate-500
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
        accent: {
          DEFAULT: "#0d9488", // teal-600, "verified" signal
          soft: "#ccfbf1",
        },
        warn: {
          DEFAULT: "#b45309", // amber-700, "needs-review"
          soft: "#fef3c7",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",
          border: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        prose: "70ch",
      },
    },
  },
  plugins: [],
};

export default config;
