'use client';

import { useMemo, useState } from 'react';
import { categories, services, states } from '@/lib/data';

type FontMode = 'normal' | 'large' | 'xlarge';

export default function HelpHubApp() {
  const [stateFilter, setStateFilter] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [easyRead, setEasyRead] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [fontMode, setFontMode] = useState<FontMode>('normal');
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('saved_services') || '[]'));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => services.filter((s) => {
    const matchState = !stateFilter || s.area.includes(stateFilter) || s.area.includes('Australia');
    const matchCat = !category || s.tags.includes(category);
    const q = query.toLowerCase();
    const matchQ = !q || [s.name, s.helps, s.description, ...s.tags].join(' ').toLowerCase().includes(q);
    return matchState && matchCat && matchQ;
  }), [stateFilter, category, query]);

  const selectedService = services.find((s) => s.id === selected);
  const speak = (text: string) => window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  const saveToggle = (id: string) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    setSaved(next);
    localStorage.setItem('saved_services', JSON.stringify(next));
  };
  const quickExit = () => { document.body.innerHTML = ''; window.location.href = 'https://www.google.com'; };

  return (
    <main className={`min-h-screen ${contrast ? 'high-contrast' : ''} ${fontMode === 'large' ? 'font-lg' : fontMode === 'xlarge' ? 'font-xl' : ''}`} onKeyDown={(e) => { if (e.key === 'Escape' && e.repeat) quickExit(); }}>
      <button onClick={quickExit} className="fixed right-4 top-4 z-50 rounded-full bg-red-600 px-4 py-2 text-white">Exit now</button>
      <section className="mx-auto max-w-7xl p-4">
        <h1 className="text-3xl font-bold text-calm-600">HelpHub AU</h1>
        <p className="mt-2 rounded-lg bg-amber-100 p-3 text-sm">This app helps people find support services. It is not emergency, legal, medical, or counselling advice. If you are in immediate danger, call 000.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <select className="rounded border p-2" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}><option value="">All states</option>{states.map((s) => <option key={s}>{s}</option>)}</select>
          <select className="rounded border p-2" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <input className="rounded border p-2 md:col-span-2" placeholder="Try: I need help with ADHD diagnosis" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded border px-3 py-1" onClick={() => setEasyRead((v) => !v)}>Easy Read</button>
          <button className="rounded border px-3 py-1" onClick={() => setContrast((v) => !v)}>High Contrast</button>
          <button className="rounded border px-3 py-1" onClick={() => setFontMode('large')}>Large Font</button>
          <button className="rounded border px-3 py-1" onClick={() => setFontMode('xlarge')}>Extra Large Font</button>
          <button className="rounded border px-3 py-1" onClick={() => setFontMode('normal')}>Normal Font</button>
          <button className="rounded border px-3 py-1" onClick={() => localStorage.removeItem('saved_services')}>Clear local history</button>
          <button className="rounded border px-3 py-1">Private mode (local only)</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            {filtered.map((s) => (
              <article key={s.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="text-xl font-semibold">{s.name}</h2>
                <p>{easyRead ? `• ${s.helps}. • ${s.hours}.` : s.helps}</p>
                <p className="text-sm text-slate-600">{s.area} · {s.hours}</p>
                <div className="mt-2 flex flex-wrap gap-2">{s.tags.map((t) => <span key={t} className="rounded-full bg-calm-100 px-2 py-1 text-xs">{t}</span>)}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="rounded bg-calm-600 px-3 py-2 text-white">Phone</a>
                  <a href={s.website} target="_blank" className="rounded border px-3 py-2">Website</a>
                  <button onClick={() => saveToggle(s.id)} className="rounded border px-3 py-2">{saved.includes(s.id) ? 'Saved' : 'Save'}</button>
                  <button onClick={() => setSelected(s.id)} className="rounded border px-3 py-2">More info</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="rounded-xl border bg-white p-4">
            <h3 className="text-lg font-semibold">Service details / support log</h3>
            {selectedService ? <div className="mt-2 space-y-2"><p>{selectedService.description}</p><button className="rounded border px-3 py-2" onClick={() => speak(`${selectedService.name}. ${selectedService.description}`)}>🔊 Speech reader</button><textarea className="h-32 w-full rounded border p-2" placeholder="Local support notes" onChange={(e) => localStorage.setItem(`note_${selectedService.id}`, e.target.value)} defaultValue={localStorage.getItem(`note_${selectedService.id}`) || ''} /></div> : <p className="mt-2 text-sm">Select More info on a service card.</p>}
            <h4 className="mt-4 font-medium">Saved services</h4>
            <ul className="list-disc pl-5">{saved.map((id) => <li key={id}>{services.find((s) => s.id === id)?.name || id}</li>)}</ul>
          </aside>
        </div>
      </section>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-2 md:hidden">
        <ul className="grid grid-cols-5 text-center text-xs">
          {['Help now','Find support','Saved','My log','Exit'].map((item) => <li key={item}><button className="w-full rounded p-2" onClick={item === 'Exit' ? quickExit : undefined}>{item}</button></li>)}
        </ul>
      </nav>
    </main>
  );
}
