"use client";

import { useState } from "react";
import { Field, Select, ResultBox } from "@/components/calc/ui";

/**
 * Correction form. Builds a structured mailto (no server, no data stored). A
 * serverless handler can be wired later; for MVP this opens the user's mail
 * client with everything pre-filled.
 */
export function KorrekturForm({
  kvs,
  email,
}: {
  kvs: { slug: string; name: string }[];
  email: string;
}) {
  const [slug, setSlug] = useState(kvs[0]?.slug ?? "");
  const [location, setLocation] = useState("");
  const [wrong, setWrong] = useState("");
  const [correct, setCorrect] = useState("");
  const [source, setSource] = useState("");

  const kvName = kvs.find((k) => k.slug === slug)?.name ?? slug;
  const subject = encodeURIComponent(`Korrektur-Hinweis: ${kvName}`);
  const body = encodeURIComponent(
    `KV: ${kvName} (/kv/${slug})\n` +
      `Betroffene Gruppe/Stufe: ${location}\n` +
      `Falscher Wert: ${wrong}\n` +
      `Korrekter Wert (laut offizieller Quelle): ${correct}\n` +
      `Quelle (URL): ${source}\n`,
  );
  const href = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <div className="grid gap-4 sm:max-w-xl">
      <Field label="Kollektivvertrag">
        <Select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {kvs.map((k) => (
            <option key={k.slug} value={k.slug}>
              {k.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Betroffene Gruppe / Stufe">
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="z. B. Gruppe III, 3.–4. Jahr" className="w-full rounded-md border border-surface-border px-3 py-2 text-sm" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Falscher Wert">
          <input value={wrong} onChange={(e) => setWrong(e.target.value)} className="w-full rounded-md border border-surface-border px-3 py-2 text-sm" />
        </Field>
        <Field label="Korrekter Wert">
          <input value={correct} onChange={(e) => setCorrect(e.target.value)} className="w-full rounded-md border border-surface-border px-3 py-2 text-sm" />
        </Field>
      </div>
      <Field label="Offizielle Quelle (URL)">
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://www.wko.at/…" className="w-full rounded-md border border-surface-border px-3 py-2 text-sm" />
      </Field>

      <a href={href} className="inline-block rounded-md bg-brand-600 px-4 py-2 text-center font-medium text-white no-underline hover:bg-brand-700">
        Korrektur per E-Mail senden
      </a>

      <ResultBox>
        Es werden ausschließlich die von dir eingegebenen Angaben übermittelt — kein Tracking, keine
        Speicherung auf unseren Servern.
      </ResultBox>
    </div>
  );
}
