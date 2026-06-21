import type { Metadata } from "next";

// Entire staging tree is noindex, no matter what.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Vorschau", template: "Vorschau – %s" },
};

export default function VorschauLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm text-brand-700">
        <strong>Staging-Vorschau (noindex).</strong> So sieht die Seite live aus, bevor du sie über{" "}
        <code>npm run verify:promote</code> freischaltest. Nicht in Sitemap, nicht indexiert.
      </div>
      {children}
    </div>
  );
}
