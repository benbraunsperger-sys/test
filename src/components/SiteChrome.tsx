import Link from "next/link";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/kollektivvertraege", label: "Kollektivverträge" },
  { href: "/branchen", label: "Branchen" },
  { href: "/tools/kv-mindest-check", label: "Tools" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/methodik", label: "Methodik" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-surface-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="inline-block h-6 w-6 rounded bg-brand-600" aria-hidden />
          {SITE.name}
          <span className="hidden text-xs font-normal text-ink-muted sm:inline">
            KV-Gehaltstabellen
          </span>
        </Link>
        <nav aria-label="Hauptnavigation">
          <ul className="flex flex-wrap items-center gap-4 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-soft hover:text-brand-600">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

const FOOTER_LINKS = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/methodik", label: "Methodik" },
  { href: "/quellen", label: "Quellen" },
  { href: "/korrektur-melden", label: "Korrektur melden" },
  { href: "/ueber-uns", label: "Über uns" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-muted">
        <nav aria-label="Rechtliches" className="mb-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="max-w-prose">
          {SITE.name} bündelt öffentlich zugängliche Fakten aus österreichischen
          Kollektivverträgen und verlinkt stets die offizielle Quelle. {SITE.defaultDisclaimerShort}
        </p>
        <p className="mt-3">© {new Date().getFullYear()} {SITE.name}. Angaben ohne Gewähr.</p>
      </div>
    </footer>
  );
}
