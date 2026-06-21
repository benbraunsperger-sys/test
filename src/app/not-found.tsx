import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-3xl font-bold">Seite nicht gefunden</h1>
      <p className="text-ink-soft">Diese Seite gibt es nicht (mehr).</p>
      <p>
        <Link href="/" className="text-brand-600 hover:underline">
          Zur Startseite
        </Link>{" "}
        ·{" "}
        <Link href="/kollektivvertraege" className="text-brand-600 hover:underline">
          Alle Kollektivverträge
        </Link>
      </p>
    </div>
  );
}
