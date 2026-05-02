'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import GuidedPathway from '@/components/GuidedPathway';
import QuickExitButton from '@/components/QuickExitButton';
import SafetyNotice from '@/components/SafetyNotice';
import { services } from '@/lib/data';

const topicMap: Record<string, string[]> = {
  'I need help now': ['crisis', 'domestic violence', 'family violence', 'emergency'],
  'Understand what is happening': ['abuse', 'coercive', 'safety', 'trauma'],
  'Services near me': ['directory', 'support', 'practitioner', 'housing'],
  'Parenting / court / rights': ['parent', 'family', 'legal', 'separation'],
  'Neurodivergence support': ['adhd', 'autism', 'neurodivergent']
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  const topicKeywords = topicMap[activeTopic] || [];

  const results = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
    const queryMatch = !query || text.includes(query.toLowerCase());
    const topicMatch = !topicKeywords.length || topicKeywords.some((k) => text.includes(k));
    return queryMatch && topicMatch;
  }).slice(0, 10), [query, topicKeywords]);

  return <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-4 pb-24">
    <QuickExitButton />

    {showSplash && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition duration-300">
        <h2 className="text-2xl font-bold text-slate-900">Welcome. You’re not alone.</h2>
        <p className="mt-2 text-sm text-slate-700">Choose what you need first. You can change this at any time.</p>
        <div className="mt-4 grid gap-2">{Object.keys(topicMap).slice(0, 4).map((t) => <button key={t} onClick={() => { setActiveTopic(t); setShowSplash(false); }} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left font-medium transition hover:scale-[1.01] hover:bg-blue-50">{t}</button>)}</div>
        <button onClick={() => setShowSplash(false)} className="mt-3 text-sm underline">Skip for now</button>
      </div>
    </div>}

    <div className="mx-auto max-w-5xl space-y-4">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">HelpHub AU</h1>
        <p className="mt-2 text-sm text-slate-700">A guided support hub for safety, family violence support, parenting and rights information, and trusted services.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="tel:000" className="rounded-xl bg-red-700 px-4 py-2 text-white transition hover:bg-red-800">I need help now</a>
          <Link href="/practitioners" className="rounded-xl border px-4 py-2 transition hover:bg-slate-50">I need services near me</Link>
          <Link href="/courses" className="rounded-xl border px-4 py-2 transition hover:bg-slate-50">Courses & education</Link>
          <button onClick={() => setShowSplash(true)} className="rounded-xl border px-4 py-2 transition hover:bg-slate-50">Guided start</button>
        </div>
      </header>

      <SafetyNotice />

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">What do you need today?</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">{Object.keys(topicMap).map((topic) => <button key={topic} onClick={() => setActiveTopic(topic)} className={`rounded-2xl px-4 py-3 text-left font-medium transition ${activeTopic===topic ? 'bg-blue-600 text-white shadow' : 'border bg-slate-50 hover:bg-blue-50'}`}>{topic}</button>)}</div>
        <p className="mt-2 text-sm text-slate-600">Selected: {activeTopic || 'None (showing broad results)'}</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Search support</h2>
        <input aria-label="Search support" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try: coercive control, legal aid, autism, housing, crisis" className="mt-3 w-full rounded-xl border p-3" />
      </section>

      <GuidedPathway />

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold">Relevant services</h2>
        <div className="mt-3 space-y-2">{results.length === 0 ? <p className="rounded-xl border bg-slate-50 p-3 text-sm">No matches yet. Try a different topic or search term.</p> : results.map((s)=><article key={s.id} className="rounded-2xl border border-slate-200 p-3 transition hover:shadow"><p className="font-semibold">{s.name}</p><p className="text-sm">{s.easy_read_description}</p><p className="text-xs text-slate-600">Tags: {s.tags.join(', ') || 'General'} · Last verified: {s.last_checked_at}</p><div className="mt-2 flex gap-2">{s.phone !== 'NA' && <a href={`tel:${s.phone.replace(/\s/g,'')}`} className="rounded-lg bg-slate-900 px-3 py-1 text-white">Call</a>}<a href={s.website} className="rounded-lg border px-3 py-1">Website</a></div></article>)}</div>
      </section>
    </div>
  </main>;
}
