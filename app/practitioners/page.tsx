'use client';

import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

const mapLink = (name: string, state: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${state} Australia`)}`;

export default function PractitionersPage() {
  const [tab, setTab] = useState<'helplines' | 'practitioners' | 'advocacy'>('helplines');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => services.filter((s) => !stateFilter || s.state === stateFilter || s.state === 'Australia-wide'), [stateFilter]);
  const byState = useMemo(() => filtered.reduce<Record<string, number>>((acc, s) => {
    acc[s.state] = (acc[s.state] || 0) + 1;
    return acc;
  }, {}), [filtered]);

  const helplines = filtered.filter((s) => s.phone !== 'NA' && s.categories.includes('Crisis support'));
  const practitioners = filtered.filter((s) => s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs'));
  const advocacy = filtered.filter((s) => s.tags.includes('advocacy') || s.categories.includes('Legal help') || s.categories.includes('Grandparents/family support'));
  const shown = tab === 'helplines' ? helplines : tab === 'practitioners' ? practitioners : advocacy;
  const selected = shown.find((s) => s.id === selectedId) || null;

  return <main className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Support directory</h1>
    <p className="text-sm text-slate-700">Starts with helplines first, then practitioners and advocacy. Use state counts and map links to narrow quickly.</p>

    <div className="flex flex-wrap gap-2">
      <button onClick={() => setTab('helplines')} className="rounded border px-3 py-1">Helplines ({helplines.length})</button>
      <button onClick={() => setTab('practitioners')} className="rounded border px-3 py-1">Practitioners ({practitioners.length})</button>
      <button onClick={() => setTab('advocacy')} className="rounded border px-3 py-1">Advocacy ({advocacy.length})</button>
      <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded border px-3 py-1"><option value="">All states</option>{Object.keys(byState).sort().map((st) => <option key={st} value={st}>{st} ({byState[st]})</option>)}</select>
    </div>

    <div className="space-y-3">
      {shown.map((s) => (
        <article key={s.id} className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(s.website)}&sz=64`} alt={`${s.name} logo`} className="h-8 w-8 rounded" />
            <div>
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm">{s.easy_read_description}</p>
            </div>
          </div>
          <p className="mt-2 text-sm">{s.state} · {s.opening_hours}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.phone !== 'NA' && <a className="rounded bg-teal-700 px-3 py-1 text-white" href={`tel:${s.phone.replace(/\s/g, '')}`}>Call</a>}
            <a className="rounded border px-3 py-1" href={s.website}>Website</a>
            <a className="rounded border px-3 py-1" href={mapLink(s.name, s.state)}>View on map</a>
            <button className="rounded border px-3 py-1" onClick={() => setSelectedId(s.id)}>Learn more</button>
          </div>
        </article>
      ))}
    </div>

    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedId(null)}>
      <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(selected.website)}&sz=64`} alt={`${selected.name} logo`} className="h-10 w-10 rounded" />
          <div>
            <h3 className="text-xl font-semibold">{selected.name}</h3>
            <p className="text-sm">{selected.state} · {selected.service_area}</p>
          </div>
        </div>
        <p className="mt-3 text-sm">{selected.normal_description}</p>
        <p className="mt-2 text-sm">Categories: {selected.categories.join(', ')}</p>
        <p className="text-sm">Key support: {selected.tags.join(', ') || 'General support'}</p>
        <p className="text-sm">Verified: {selected.verified_status} · Last checked: {selected.last_checked_at}</p>
        <div className="mt-3 space-y-1 text-sm">
          <p className="font-semibold">Contact methods</p>
          {selected.phone !== 'NA' && <a className="block underline" href={`tel:${selected.phone.replace(/\s/g, '')}`}>Phone: {selected.phone}</a>}
          <a className="block underline" href={selected.website}>Website</a>
          <a className="block underline" href={mapLink(selected.name, selected.state)}>Directions now (Google Maps)</a>
        </div>
        {selected.courses_programs.length > 0 && <div className="mt-3 text-sm"><p className="font-semibold">Courses/programs from this service</p><ul className="list-disc pl-5">{selected.courses_programs.map((c) => <li key={c}>{c}</li>)}</ul></div>}
        <button className="mt-4 rounded border px-3 py-1" onClick={() => setSelectedId(null)}>Close</button>
      </div>
    </div>}
  </main>;
}
