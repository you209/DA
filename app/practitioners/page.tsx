'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

const mapLink = (name: string, state: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${state} Australia`)}`;

export default function PractitionersPage() {
  const [tab, setTab] = useState<'helplines' | 'practitioners' | 'advocacy'>('helplines');
  const [stateFilter, setStateFilter] = useState('');

  const filtered = useMemo(() => services.filter((s) => !stateFilter || s.state === stateFilter || s.state === 'Australia-wide'), [stateFilter]);
  const byState = useMemo(() => filtered.reduce<Record<string, number>>((acc, s) => ((acc[s.state] = (acc[s.state] || 0) + 1), acc), {}), [filtered]);

  const helplines = filtered.filter((s) => s.phone !== 'NA' && s.categories.includes('Crisis support'));
  const practitioners = filtered.filter((s) => s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs'));
  const advocacy = filtered.filter((s) => s.tags.includes('advocacy') || s.categories.includes('Legal help') || s.categories.includes('Grandparents/family support'));
  const shown = tab === 'helplines' ? helplines : tab === 'practitioners' ? practitioners : advocacy;

  return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-5xl space-y-4">
    <div className="flex flex-wrap items-center gap-2"><Link href="/" className="rounded-lg border bg-white px-3 py-1">← Home</Link><Link href="/courses" className="rounded-lg border bg-white px-3 py-1">Courses</Link><a href="tel:000" className="rounded bg-red-600 px-3 py-1 text-white">Emergency 000</a></div>
    <h1 className="text-2xl font-bold text-teal-800">Support directory</h1><p className="text-sm text-slate-700">Find trusted helplines, practitioners, and advocacy services with direct actions.</p>
    <p className="rounded-lg border bg-white p-3 text-sm">Clear tabs, consistent cards, and direct links for call, website, and maps.</p>

    <div className="flex flex-wrap gap-2"><button onClick={() => setTab('helplines')} className="rounded-lg border bg-white px-3 py-1">Helplines ({helplines.length})</button><button onClick={() => setTab('practitioners')} className="rounded-lg border bg-white px-3 py-1">Practitioners ({practitioners.length})</button><button onClick={() => setTab('advocacy')} className="rounded-lg border bg-white px-3 py-1">Advocacy ({advocacy.length})</button><select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-lg border bg-white px-3 py-1"><option value="">All states</option>{Object.keys(byState).sort().map((st) => <option key={st} value={st}>{st} ({byState[st]})</option>)}</select></div>

    <div className="space-y-3">{shown.map((s) => <article key={s.id} className="rounded-xl border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(s.website)}&sz=64`} alt={`${s.name} logo`} className="h-8 w-8 rounded" /><h2 className="text-lg font-semibold">{s.name}</h2></div><p className="text-sm">{s.easy_read_description}</p><p className="mt-1 text-sm">{s.state} · {s.service_area} · {s.opening_hours}</p><p className="text-xs text-slate-600">Verified: {s.verified_status} · Last checked: {s.last_checked_at}</p><div className="mt-3 flex flex-wrap gap-2">{s.phone !== 'NA' && <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Call</a>}<a href={s.website} className="rounded border px-3 py-1">Website</a><a href={mapLink(s.name, s.state)} className="rounded border px-3 py-1">View on map</a></div></article>)}</div>
  </div></main>;
}
