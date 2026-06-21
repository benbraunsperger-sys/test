import type { Metadata } from "next";
import Link from "next/link";
import { getUpdates } from "@/lib/updates";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aktualisierungen",
  description: "Neue und zuletzt geprüfte Kollektivvertrags-Gehaltstabellen auf KV-Radar.",
  alternates: { canonical: absoluteUrl("/aktualisierungen"), types: { "application/rss+xml": absoluteUrl("/feed.xml") } },
};

export const revalidate = 86400;

export default function AktualisierungenPage() {
  const updates = getUpdates();
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: "Start", href: "/" }, { name: "Aktualisierungen", href: "/aktualisierungen" }]} />
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Aktualisierungen</h1>
        <p className="text-ink-soft">
          Zuletzt geprüfte und aktualisierte Kollektivverträge.{" "}
          <Link href="/feed.xml" className="text-brand-600 hover:underline">RSS-Feed</Link>.
        </p>
      </header>
      <ul className="space-y-3">
        {updates.map((u) => (
          <li key={u.href} className="rounded-lg border border-surface-border bg-surface p-4">
            <div className="flex items-baseline justify-between gap-3">
              <Link href={u.href} className="font-semibold text-ink hover:text-brand-600">{u.title}</Link>
              <span className="shrink-0 text-xs text-ink-muted">{formatDate(u.date)}</span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{u.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
