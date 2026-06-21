import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export interface Crumb {
  name: string;
  href: string;
}

/** Visual breadcrumbs + BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
  return (
    <nav aria-label="Brotkrümelnavigation" className="text-sm text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-brand-600 hover:underline">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-soft">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
