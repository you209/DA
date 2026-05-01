'use client';

import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

type Program = {
  id: string;
  title: string;
  provider: string;
  providerWebsite: string;
  phones: string[];
  state: string;
  verified: string;
  lastChecked: string;
  summary: string;
  relatedPrograms: string[];
};

const cleanPhone = (phone: string) => phone.replace(/\s/g, '');

export default function CoursesPage() {
  const [selected, setSelected] = useState<Program | null>(null);

  const grouped = useMemo(() => {
    const programs: Program[] = services
      .map((service) => ({
        service,
        items: service.courses_programs.filter((c) => c && c !== 'To be confirmed')
      }))
      .filter((x) => x.items.length > 0)
      .flatMap(({ service, items }) => items.map((program) => ({
        id: `${service.id}-${program}`,
        title: program,
        provider: service.name,
        providerWebsite: service.website,
        phones: [service.phone].filter((p) => p && p !== 'NA'),
        state: service.state,
        verified: service.verified_status,
        lastChecked: service.last_checked_at,
        summary: service.normal_description,
        relatedPrograms: items.filter((i) => i !== program)
      })));

    return programs.reduce<Record<string, Program[]>>((acc, p) => {
      acc[p.state] = [...(acc[p.state] || []), p];
      return acc;
    }, {});
  }, []);

  const states = Object.keys(grouped).sort();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Courses & Programs</h1>
      <p className="text-sm text-slate-700">Grouped by state with direct provider details and cleaner contact actions.</p>

      {states.map((state) => (
        <section key={state} className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">{state} ({grouped[state].length})</h2>
          <div className="mt-3 space-y-3">
            {grouped[state].map((p) => (
              <article key={p.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(p.providerWebsite)}&sz=64`} alt={`${p.provider} logo`} className="h-8 w-8 rounded" />
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm">{p.provider}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{p.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => setSelected(p)} className="rounded bg-teal-700 px-3 py-1 text-white">Learn more</button>
                  <a href={p.providerWebsite} className="rounded border px-3 py-1">Provider site</a>
                  {p.phones.map((phone) => <a key={phone} href={`tel:${cleanPhone(phone)}`} className="rounded border px-3 py-1">Call {phone}</a>)}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center gap-3">
              <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(selected.providerWebsite)}&sz=64`} alt={`${selected.provider} logo`} className="h-10 w-10 rounded" />
              <div>
                <h3 className="text-xl font-semibold">{selected.title}</h3>
                <p className="text-sm">{selected.provider}</p>
              </div>
            </div>
            <p className="text-sm">{selected.summary}</p>
            <p className="mt-2 text-xs text-slate-600">{selected.state} · {selected.verified} · Last checked {selected.lastChecked}</p>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-semibold">Contact options</p>
              {selected.phones.map((phone) => <a key={phone} href={`tel:${cleanPhone(phone)}`} className="block underline">Call {phone}</a>)}
              <a href={selected.providerWebsite} className="block underline">Go to provider website</a>
            </div>
            {selected.relatedPrograms.length > 0 && <div className="mt-3 text-sm"><p className="font-semibold">Other programs from this provider</p><ul className="list-disc pl-5">{selected.relatedPrograms.map((rp) => <li key={rp}>{rp}</li>)}</ul></div>}
            <button className="mt-4 rounded border px-3 py-1" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
