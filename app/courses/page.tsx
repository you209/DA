'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

type Program = { id: string; title: string; provider: string; providerWebsite: string; phone: string; state: string; summary: string; related: string[] };

export default function CoursesPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [stateFilter, setStateFilter] = useState('');
  const [selected, setSelected] = useState<Program | null>(null);

  const programs = useMemo(() => services.flatMap((s) => {
    const items = s.courses_programs.filter((c) => c && c !== 'To be confirmed');
    return items.map((title) => ({ id: `${s.id}-${title}`, title, provider: s.name, providerWebsite: s.website, phone: s.phone, state: s.state, summary: s.normal_description, related: items.filter((i) => i !== title) }));
  }), []);

  const states = useMemo(() => programs.reduce<Record<string, number>>((acc, p) => ((acc[p.state] = (acc[p.state] || 0) + 1), acc), {}), [programs]);
  const shown = programs.filter((p) => !stateFilter || p.state === stateFilter || p.state === 'Australia-wide');

  return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-5xl space-y-4">
    <div className="flex items-center justify-between"><Link href="/" className="rounded border px-3 py-1">← Back to home</Link><Link href="/practitioners" className="rounded border px-3 py-1">Support directory</Link></div>
    <h1 className="text-2xl font-bold text-teal-700">Courses & programs</h1>
    <p className="rounded bg-amber-50 p-3 text-sm">Short guided start, then browse by state or all.</p>

    {step === 1 && <section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">What do you want first?</h2><div className="mt-2 flex gap-2"><button onClick={() => setStep(2)} className="rounded border px-3 py-2">Show all courses</button><button onClick={() => { setStateFilter('Australia-wide'); setStep(2); }} className="rounded border px-3 py-2">National programs first</button></div></section>}

    {step === 2 && <>
      <div className="flex flex-wrap gap-2"><select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded border px-3 py-1"><option value="">All states</option>{Object.keys(states).sort().map((st) => <option key={st} value={st}>{st} ({states[st]})</option>)}</select><button onClick={() => setStep(1)} className="rounded border px-3 py-1">Start questions again</button></div>
      <div className="space-y-3">{shown.map((p) => <article key={p.id} className="rounded-xl border bg-white p-4"><div className="flex items-center gap-3"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(p.providerWebsite)}&sz=64`} alt="provider logo" className="h-8 w-8 rounded" /><div><h2 className="font-semibold">{p.title}</h2><p className="text-sm">{p.provider} · {p.state}</p></div></div><p className="mt-2 text-sm">{p.summary}</p><div className="mt-2 flex flex-wrap gap-2"><button onClick={() => setSelected(p)} className="rounded bg-teal-700 px-3 py-1 text-white">Learn more</button><a href={p.providerWebsite} className="rounded border px-3 py-1">Website</a>{p.phone !== 'NA' && <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="rounded border px-3 py-1">Call</a>}</div></article>)}</div>
    </>}

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}><div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-3"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(selected.providerWebsite)}&sz=64`} alt="provider logo" className="h-10 w-10 rounded" /><div><h3 className="text-xl font-semibold">{selected.title}</h3><p className="text-sm">{selected.provider}</p></div></div><p className="mt-2 text-sm">{selected.summary}</p><a className="mt-2 block underline" href={selected.providerWebsite}>Provider website</a>{selected.phone !== 'NA' && <a className="block underline" href={`tel:${selected.phone.replace(/\s/g, '')}`}>Call {selected.phone}</a>}{selected.related.length > 0 && <div className="mt-3 text-sm"><p className="font-semibold">Other courses from this provider</p><ul className="list-disc pl-5">{selected.related.map((r) => <li key={r}>{r}</li>)}</ul></div>}<button className="mt-4 rounded border px-3 py-1" onClick={() => setSelected(null)}>Close</button></div></div>}
  </div></main>;
}
