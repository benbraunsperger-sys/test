import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/** Standard wrapper for text/legal pages: breadcrumb + readable measure. */
export function Prose({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {intro && <p className="max-w-prose text-lg text-ink-soft">{intro}</p>}
      </header>
      <div className="prose-kv max-w-prose space-y-4 text-ink-soft [&_a]:text-brand-600 [&_a:hover]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}

/** Highlights a fact the site owner must still supply. */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-warn-soft px-1 text-warn">TODO: {children}</mark>
  );
}
