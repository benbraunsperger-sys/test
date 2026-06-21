import { getUpdates } from "@/lib/updates";
import { absoluteUrl, SITE } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 86400;

function escape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

export function GET() {
  const items = getUpdates();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(SITE.name)} — Aktualisierungen</title>
    <link>${absoluteUrl("/aktualisierungen")}</link>
    <description>Neue und aktualisierte Kollektivvertrags-Gehaltstabellen.</description>
    <language>de-AT</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map(
    (it) => `    <item>
      <title>${escape(it.title)}</title>
      <link>${absoluteUrl(it.href)}</link>
      <guid isPermaLink="true">${absoluteUrl(it.href)}</guid>
      <pubDate>${new Date(it.date).toUTCString()}</pubDate>
      <description>${escape(it.summary)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;
  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
