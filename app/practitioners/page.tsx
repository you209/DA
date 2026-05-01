'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

const mapLink = (name: string, state: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${state} Australia`)}`;

export default function PractitionersPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [need, setNeed] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'non-urgent' | ''>('');
  const [tab, setTab] = useState<'helplines' | 'practitioners' | 'advocacy'>('helplines');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => services.filter((s) => !stateFilter || s.state === stateFilter || s.state === 'Australia-wide'), [stateFilter]);
  const byState = useMemo(() => filtered.reduce<Record<string, number>>((acc, s) => ((acc[s.state] = (acc[s.state] || 0) + 1), acc), {}), [filtered]);

  const helplines = filtered.filter((s) => s.phone !== 'NA' && s.categories.includes('Crisis support'));
  const practitioners = filtered.filter((s) => s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs'));
  const advocacy = filtered.filter((s) => s.tags.includes('advocacy') || s.categories.includes('Legal help') || s.categories.includes('Grandparents/family support'));
  const shown = tab === 'helplines' ? helplines : tab === 'practitioners' ? practitioners : advocacy;
  const selected = shown.find((s) => s.id === selectedId) || null;

  return <main className="min-h-screen bg-amber-50 p-6">
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="rounded border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50">← Back to home</Link>
        <a href="tel:000" className="rounded bg-red-600 px-3 py-1 text-white">Emergency 000</a>
      </div>

      <h1 className="text-2xl font-bold text-amber-900">Find safe support</h1>
      <p className="rounded bg-yellow-100 p-3 text-sm border border-yellow-300">You are in control. We ask a few short questions first, then show options gradually. You can still browse all services by state.</p>

      {step === 1 && <section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">1) What best matches right now?</h2><div className="mt-3 grid gap-2 md:grid-cols-2">{['I feel unsafe','I need mental health support','I need family/legal support','I need assessment or practitioner'].map((n)=><button key={n} onClick={() => { setNeed(n); setStep(2); if(n==='I feel unsafe') setTab('helplines'); }} className="rounded-xl border border-amber-300 bg-white px-3 py-2 hover:bg-yellow-50 text-left">{n}</button>)}</div><button onClick={() => setStep(3)} className="mt-3 text-sm underline">Skip and browse everything</button></section>}

      {step === 2 && <section className="rounded-xl border bg-white p-4"><h2 className="font-semibold">2) Is this urgent today?</h2><div className="mt-3 flex gap-2"><button onClick={() => { setUrgency('urgent'); setTab('helplines'); setStep(3); }} className="rounded-xl border border-amber-300 bg-white px-3 py-2 hover:bg-yellow-50">Yes, urgent</button><button onClick={() => { setUrgency('non-urgent'); setStep(3); }} className="rounded-xl border border-amber-300 bg-white px-3 py-2 hover:bg-yellow-50">Not urgent</button></div></section>}

      {step === 3 && <>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTab('helplines')} className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50">Helplines ({helplines.length})</button>
          <button onClick={() => setTab('practitioners')} className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50">Practitioners ({practitioners.length})</button>
          <button onClick={() => setTab('advocacy')} className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50">Advocacy ({advocacy.length})</button>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50"><option value="">All states</option>{Object.keys(byState).sort().map((st) => <option key={st} value={st}>{st} ({byState[st]})</option>)}</select>
          <button onClick={() => { setStep(1); setNeed(''); setUrgency(''); }} className="rounded border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50">Start questions again</button>
        </div>
        {(need || urgency) && <p className="text-sm text-slate-700">Guided view: <strong>{need || 'General browsing'}</strong> · <strong>{urgency || 'Not set'}</strong>.</p>}

        <div className="space-y-3">
          {shown.map((s) => (
            <article key={s.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center gap-3"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(s.website)}&sz=64`} alt="service logo" className="h-8 w-8 rounded" /><div><h2 className="font-semibold">{s.name}</h2><p className="text-sm">{s.easy_read_description}</p></div></div>
              <p className="mt-2 text-sm">{s.state} · {s.opening_hours}</p>
              <div className="mt-2 flex flex-wrap gap-2">{s.phone !== 'NA' && <a className="rounded-xl bg-amber-600 px-3 py-1 text-white hover:bg-amber-700" href={`tel:${s.phone.replace(/\s/g, '')}`}>Call</a>}<a className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50" href={s.website}>Website</a><a className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50" href={mapLink(s.name, s.state)}>View on map</a><button className="rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50" onClick={() => setSelectedId(s.id)}>Learn more</button></div>
            </article>
          ))}
        </div>
      </>}

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedId(null)}><div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}><h3 className="text-xl font-semibold">{selected.name}</h3><p className="text-sm">{selected.normal_description}</p><p className="mt-2 text-sm">{selected.state} · {selected.service_area}</p><a className="mt-2 block underline" href={mapLink(selected.name, selected.state)}>Directions now</a><button className="mt-4 rounded-xl border border-amber-300 bg-white px-3 py-1 hover:bg-yellow-50" onClick={() => setSelectedId(null)}>Close</button></div></div>}
    </div>
  </main>;
}
