'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

export default function CoursesPage() {
  const [stateFilter, setStateFilter] = useState('');

  const programs = useMemo(() => services.flatMap((s) => {
    const items = s.courses_programs.filter((c) => c && c !== 'To be confirmed');
    return items.map((title) => ({
      id: `${s.id}-${title}`,
      title,
      provider: s.name,
      website: s.website,
      phone: s.phone,
      state: s.state,
      area: s.service_area,
      summary: s.normal_description,
      easySummary: s.easy_read_description,
      eligibility: s.eligibility,
      hours: s.opening_hours,
      verified: s.verified_status,
      checked: s.last_checked_at
    }));
  }), []);

  const states = useMemo(() => programs.reduce<Record<string, number>>((acc, p) => ((acc[p.state] = (acc[p.state] || 0) + 1), acc), {}), [programs]);
  const shown = programs.filter((p) => !stateFilter || p.state === stateFilter || p.state === 'Australia-wide');

  return <main className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-5xl space-y-4">
    <div className="flex flex-wrap items-center gap-2"><Link href="/" className="rounded-lg border bg-white px-3 py-1">← Home</Link><Link href="/practitioners" className="rounded-lg border bg-white px-3 py-1">Support directory</Link></div>
    <h1 className="text-2xl font-bold text-teal-800">Courses & Programs</h1><p className="text-sm text-slate-700">Learn practical programs and connect directly to official provider course pages.</p>
    <p className="rounded-lg border bg-white p-3 text-sm">Browse course pathways by state. “Course website” opens the exact provider page for course details and enrolment/contact.</p>

    <div className="flex flex-wrap gap-2"><select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="rounded-lg border bg-white px-3 py-2"><option value="">All states</option>{Object.keys(states).sort().map((st) => <option key={st} value={st}>{st} ({states[st]})</option>)}</select></div>

    <div className="space-y-3">
      {shown.map((p) => <article key={p.id} className="rounded-xl border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(p.website)}&sz=64`} alt={`${p.provider} logo`} className="h-8 w-8 rounded" /><h2 className="text-lg font-semibold">{p.title}</h2></div><p className="text-sm">{p.provider} · {p.state} · {p.area}</p><p className="mt-2 text-sm">{p.summary}</p><p className="text-sm text-slate-700">Easy read: {p.easySummary}</p><div className="mt-2 grid gap-1 text-xs text-slate-600"><p>Eligibility: {p.eligibility}</p><p>Hours: {p.hours}</p><p>Verified: {p.verified} · Last checked: {p.checked}</p></div><div className="mt-3 flex flex-wrap gap-2"><a href={p.website} className="rounded bg-teal-700 px-3 py-1 text-white">Course website</a>{p.phone !== 'NA' && <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="rounded border px-3 py-1">Call provider</a>}</div></article>)}
    </div>
  </div></main>;
}
