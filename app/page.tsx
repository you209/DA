'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import GuidedPathway from '@/components/GuidedPathway';
import QuickExitButton from '@/components/QuickExitButton';
import SafetyNotice from '@/components/SafetyNotice';
import { services } from '@/lib/data';

const categories = [
  'Emergency and crisis help','Domestic abuse / family violence','Types of abuse','Parenting and rights','Neurodivergence','Support services','Safety planning','Documentation help'
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const results = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!category || text.includes(category.toLowerCase()));
  }).slice(0,8), [query, category]);

  return <main className="min-h-screen bg-slate-50 p-4 pb-24">
    <QuickExitButton />
    <div className="mx-auto max-w-5xl space-y-4">
      <header className="rounded-2xl border bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">HelpHub AU — Guided support for safety, rights, and services</h1>
        <p className="mt-2 text-sm text-slate-700">Find urgent help, understand what is happening, and get connected to trusted support pathways.</p>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="/practitioners" className="rounded-lg border px-3 py-2">I need services near me</Link><Link href="/courses" className="rounded-lg border px-3 py-2">Courses and education</Link><a href="tel:000" className="rounded-lg bg-red-700 px-3 py-2 text-white">I need help now</a></div>
      </header>

      <SafetyNotice />

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Search support</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_260px]"><input aria-label="Search support" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search helplines, family violence, legal, ADHD, housing..." className="rounded-lg border p-3" /><select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border p-3"><option value="">All categories</option>{categories.map((c)=><option key={c}>{c}</option>)}</select></div>
        <div className="mt-3 flex flex-wrap gap-2">{categories.map((c)=><button key={c} onClick={()=>setCategory(c)} className="rounded-full border px-3 py-1 text-sm">{c}</button>)}</div>
      </section>

      <GuidedPathway />

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Top matches</h2>
        <div className="mt-3 space-y-2">{results.map((s)=><article key={s.id} className="rounded-xl border p-3"><p className="font-semibold">{s.name}</p><p className="text-sm">{s.easy_read_description}</p><p className="text-xs text-slate-600">Source: {s.source_name} · Last verified: {s.last_checked_at}</p></article>)}</div>
      </section>
    </div>
  </main>;
}
