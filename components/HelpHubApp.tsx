'use client';

import { useMemo, useState } from 'react';
import { categories, services as allServices, states } from '@/lib/data';
import { suggestRelated } from '@/lib/ingestion';

export default function HelpHubApp() {
  const [stateFilter, setStateFilter] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [easyRead, setEasyRead] = useState(false);
  const [tab, setTab] = useState<'services' | 'courses' | 'admin'>('services');
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('saved_services') || '[]'));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => allServices.filter((s) => {
    const matchState = !stateFilter || s.state === stateFilter || s.state === 'Australia-wide';
    const matchCat = !category || s.categories.includes(category);
    const q = query.toLowerCase();
    const matchQ = !q || [s.name, s.normal_description, s.easy_read_description, ...s.tags, ...s.categories].join(' ').toLowerCase().includes(q);
    return s.active && matchState && matchCat && matchQ;
  }), [stateFilter, category, query]);

  const selectedService = allServices.find((s) => s.id === selected);
  const recommendations = selectedService ? suggestRelated(selectedService, allServices, query) : [];
  const quickExit = () => { window.location.href = 'https://www.google.com'; };

  return <main className="min-h-screen bg-slate-50 p-4">
    <button onClick={quickExit} className="fixed right-4 top-4 rounded-full bg-red-600 px-4 py-2 text-white">Exit now</button>
    <h1 className="text-3xl font-bold text-teal-700">HelpHub AU</h1>
    <p className="mt-2 rounded bg-amber-100 p-3 text-sm">This app helps people find support services. It is not emergency, legal, medical, or counselling advice. If you are in immediate danger, call 000.</p>

    <div className="mt-3 flex gap-2"><button onClick={()=>setTab('services')} className="rounded border px-3 py-1">Services</button><button onClick={()=>setTab('courses')} className="rounded border px-3 py-1">Courses & Programs</button><button onClick={()=>setTab('admin')} className="rounded border px-3 py-1">Admin</button></div>

    {tab !== 'admin' && <div className="mt-4 grid gap-2 md:grid-cols-4"><select className="rounded border p-2" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}><option value="">All states</option>{states.map((s) => <option key={s}>{s}</option>)}</select><select className="rounded border p-2" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><input className="rounded border p-2 md:col-span-2" placeholder="I need help with ADHD diagnosis" value={query} onChange={(e) => setQuery(e.target.value)} /></div>}

    {tab === 'services' && <section className="mt-4 grid gap-4 md:grid-cols-2"> <div className="space-y-3">{filtered.map((s) => <article key={s.id} className="rounded-xl border bg-white p-4"><h2 className="font-semibold">{s.name}</h2><p>{easyRead ? s.easy_read_description : s.normal_description}</p><p className="text-sm">{s.state} · {s.opening_hours} · {s.verified_status}</p><div className="mt-2 flex gap-2"><a href={`tel:${s.phone.replace(/\s/g,'')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Phone</a><a href={s.website} className="rounded border px-3 py-1">Website</a><button onClick={()=>setSelected(s.id)} className="rounded border px-3 py-1">More info</button><button onClick={()=>{const n=saved.includes(s.id)?saved.filter(x=>x!==s.id):[...saved,s.id];setSaved(n);localStorage.setItem('saved_services',JSON.stringify(n));}} className="rounded border px-3 py-1">{saved.includes(s.id)?'Saved':'Save'}</button></div></article>)}</div>
    <aside className="rounded-xl border bg-white p-4"><h3 className="font-semibold">Details & smart suggestions</h3>{selectedService ? <><p className="mt-2">{selectedService.eligibility}</p><p className="text-sm">Source: <a className="underline" href={selectedService.source_url}>{selectedService.source_name}</a> · Last checked {selectedService.last_checked_at}</p><h4 className="mt-3 font-medium">Related services</h4><ul className="list-disc pl-5">{recommendations.map(r=><li key={r.id}>{r.name}</li>)}</ul><h4 className="mt-3 font-medium">Courses & programs</h4><ul className="list-disc pl-5">{selectedService.courses_programs.map(c=><li key={c}>{c}</li>)}</ul><h4 className="mt-3 font-medium">Safety info</h4><p>If unsafe now, use Exit and call 000.</p></> : <p className="mt-2 text-sm">Select More info.</p>}</aside></section>}

    {tab === 'courses' && <section className="mt-4 rounded-xl border bg-white p-4"><h3 className="font-semibold">Courses, workshops, groups, online training</h3><ul className="mt-2 list-disc pl-5">{filtered.flatMap(s=>s.courses_programs.map(c=>`${c} — ${s.name}`)).map((x,i)=><li key={i}>{x}</li>)}</ul></section>}

    {tab === 'admin' && <section className="mt-4 rounded-xl border bg-white p-4"><h3 className="font-semibold">Admin review tools</h3><ul className="list-disc pl-5 text-sm mt-2"><li>Review imported services before publishing.</li><li>Flag outdated services.</li><li>Mark verified/unverified.</li><li>Edit easy-read descriptions.</li><li>Disable inactive services.</li></ul><table className="mt-3 w-full text-sm"><thead><tr><th align='left'>Service</th><th align='left'>Verified</th><th align='left'>Last checked</th><th align='left'>Active</th></tr></thead><tbody>{allServices.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.verified_status}</td><td>{s.last_checked_at}</td><td>{String(s.active)}</td></tr>)}</tbody></table></section>}

    <button className="mt-4 rounded border px-3 py-1" onClick={()=>setEasyRead(v=>!v)}>Toggle Easy Read</button>
  </main>;
}
