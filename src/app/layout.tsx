import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} – Kollektivvertrags-Gehaltstabellen Österreich`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "de_AT",
    siteName: SITE.name,
    title: `${SITE.name} – Kollektivvertrags-Gehaltstabellen Österreich`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} – KV-Gehaltstabellen Österreich`,
    description: SITE.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-AT">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand-600 focus:px-3 focus:py-2 focus:text-white"
        >
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
