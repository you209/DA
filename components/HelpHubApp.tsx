'use client';

import { useMemo, useState } from 'react';
import { categories, services as allServices, states } from '@/lib/data';
import { forceScrapeDevOnly, suggestRelated } from '@/lib/ingestion';

const situations = [
  "I'm scared or unsafe",
  'I need mental health help',
  'I need domestic/family violence help',
  'I need legal help',
  'I need housing help',
  'I need ADHD/autism help',
  'I need help for a child',
  'I need help as a grandparent',
  "I'm not sure"
];

export default function HelpHubApp() {
  const [isSimple, setIsSimple] = useState(true);
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  const [imports, setImports] = useState<string[]>([]);
  const [importPreview, setImportPreview] = useState<string[]>([]);
  const [hiddenGroups, setHiddenGroups] = useState(false);
  const [disabledIds, setDisabledIds] = useState<string[]>([]);
  const [publishState, setPublishState] = useState<Record<string, 'draft'|'review'|'published'>>(() => JSON.parse(localStorage.getItem('publish_state') || '{}'));
  const [adminRole, setAdminRole] = useState<'viewer'|'editor'|'verifier'|'admin'>('admin');
  const [auditLog, setAuditLog] = useState<string[]>(() => JSON.parse(localStorage.getItem('audit_log') || '[]'));
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [need, setNeed] = useState('');
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem('saved_services') || '[]'));
  const [callLog, setCallLog] = useState<string[]>(() => JSON.parse(localStorage.getItem('call_log') || '[]'));
  const [apptLog, setApptLog] = useState<string[]>(() => JSON.parse(localStorage.getItem('appointment_log') || '[]'));
  const [neutralSite, setNeutralSite] = useState<'google'|'bom'>('google');

  const quickExit = () => (window.location.href = neutralSite === 'google' ? 'https://www.google.com' : 'https://www.bom.gov.au');

  const filtered = useMemo(() => allServices.filter((s) => {
    const q = (query || need).toLowerCase();
    const matchState = !stateFilter || s.state === stateFilter || s.state === 'Australia-wide';
    const matchCat = !category || s.categories.includes(category);
    const matchQ = !q || [s.name, s.normal_description, s.easy_read_description, ...s.categories, ...s.tags].join(' ').toLowerCase().includes(q);
    const groupVisible = hiddenGroups ? !s.categories.includes('Facebook/community groups') : true;
    const isDisabled = disabledIds.includes(s.id);
    const stage = publishState[s.id] || 'published';
    const visibleToPublic = isDev ? true : stage === 'published';
    return s.active && !isDisabled && groupVisible && visibleToPublic && s.verified_status !== 'unverified' && matchState && matchCat && matchQ;
  }), [query, need, stateFilter, category]);

  const selectedService = allServices.find((s) => s.id === selected) || filtered[0];
  const related = selectedService ? suggestRelated(selectedService, allServices, query || need) : [];

  const saveService = (id: string) => {
    const n = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    setSaved(n);
    localStorage.setItem('saved_services', JSON.stringify(n));
  };

  const logCall = (name: string) => {
    const n = [`${new Date().toLocaleString()} - ${name}`, ...callLog].slice(0, 50);
    setCallLog(n); localStorage.setItem('call_log', JSON.stringify(n));
  };

  const simpleCard = (s: (typeof allServices)[number]) => <article key={s.id} className="rounded-2xl border bg-white p-4 shadow-sm">
    <h3 className="text-xl font-semibold">{s.name}</h3>
    <p className="mt-1 text-lg">{s.easy_read_description}</p>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <a onClick={() => logCall(s.name)} href={`tel:${s.phone.replace(/\s/g, '')}`} className="rounded-xl bg-teal-700 px-4 py-3 text-center text-lg font-semibold text-white">Call</a>
      <a href={s.website} className="rounded-xl border-2 border-slate-300 px-4 py-3 text-center text-lg font-semibold">Website</a>
      <button onClick={() => setSelected(s.id)} className="col-span-2 rounded-xl border px-4 py-3">More info</button>
    </div>
  </article>;




  const setStage = (id: string, stage: 'draft'|'review'|'published') => {
    if (adminRole === 'viewer') return;
    setPublishState((prev) => { const next = { ...prev, [id]: stage }; localStorage.setItem('publish_state', JSON.stringify(next)); return next; });
    const entry = `${new Date().toISOString()} ${adminRole} set ${id} => ${stage}`;
    setAuditLog((prev) => { const next=[entry,...prev].slice(0,200); localStorage.setItem('audit_log', JSON.stringify(next)); return next; });
  };

  const toggleDisable = (id: string) => {
    if (adminRole === 'viewer') return;
    setDisabledIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };


  const staleServices = allServices.filter((s) => {
    const d = new Date(s.last_checked_at);
    return !Number.isNaN(d.getTime()) && (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24) > 90;
  });

  const onCsvUpload = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;
    const rows = lines.slice(1, 6).map((l) => l.split(',')[1] || l);
    setImportPreview(rows);
    setImports((i) => [`CSV preview loaded (${lines.length - 1} rows)`, ...i]);
  };

  return <main className="min-h-screen bg-slate-50 p-4 text-lg" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Escape'){ const now=Date.now(); const prev=Number((window as any).__escTs||0); (window as any).__escTs=now; if(now-prev<900) quickExit(); } }}>
    <button onClick={quickExit} className="fixed right-3 top-3 z-50 rounded-full bg-red-600 px-5 py-3 font-semibold text-white">Quick Exit</button>
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-teal-700">HelpHub AU</h1>
      <p className="mt-2 rounded-xl bg-amber-100 p-3 text-base">This app helps people find support services. It is not emergency, legal, medical, or counselling advice. If you are in immediate danger, call 000.</p>
      <div className="mt-3 flex flex-wrap gap-2"><button className="rounded-xl border px-4 py-2" onClick={() => setIsSimple((v) => !v)}>{isSimple ? 'Switch to Full Mode' : 'Switch to Simple Mode'}</button><a href="/policy" className="rounded-xl border px-4 py-2">Policy & Compliance</a><a href="/practitioners" className="rounded-xl border px-4 py-2">Practitioners</a><a href="/courses" className="rounded-xl border px-4 py-2">Courses</a><select aria-label='neutral site' value={neutralSite} onChange={(e)=>setNeutralSite(e.target.value as any)} className="rounded-xl border px-2"><option value='google'>Google</option><option value='bom'>BOM Weather</option></select></div><p className="mt-2 text-sm text-slate-600">Quick exit does NOT clear your browser history.</p>

      {isSimple ? <section className="mt-4 space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="text-2xl font-semibold">{step === 1 ? '1. I need help now' : step === 2 ? '2. Tell me what’s happening' : step === 3 ? '3. Find support near me' : step === 4 ? '4. Saved help' : '5. My support log'}</h2>
          <div className="mt-3 flex gap-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setStep(n as 1|2|3|4|5)} className="rounded-lg border px-3 py-2">{n}</button>)}</div>
        </div>

        {step === 1 && <div className="space-y-3"><div className="rounded-2xl border bg-white p-4"><h3 className="text-xl font-semibold">Top hotlines</h3><ul className="mt-2 list-disc pl-5">{allServices.filter(x=>x.categories.includes('Crisis support')).slice(0,8).map(x=><li key={x.id}>{x.name} — {x.phone}</li>)}</ul></div><article className="rounded-2xl border bg-red-50 p-4"><h3 className="text-2xl font-bold">Emergency help</h3><p className="mt-1">If you are in danger now, call 000.</p><a href="tel:000" className="mt-3 inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold text-white">Call 000</a></article>{filtered.slice(0,3).map(simpleCard)}</div>}

        {step === 2 && <div className="rounded-2xl border bg-white p-4"><p>Choose one:</p><div className="mt-2 grid gap-2">{situations.map(s => <button key={s} onClick={() => { setNeed(s); setStep(3); }} className="rounded-xl border px-4 py-3 text-left">{s}</button>)}</div><input value={need} onChange={(e)=>setNeed(e.target.value)} placeholder="Or type your own" className="mt-3 w-full rounded-xl border p-3" /></div>}

        {step === 3 && <div className="space-y-3"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="What support do you need?" className="w-full rounded-xl border p-3" />{filtered.slice(0,5).map(simpleCard)}{selectedService && <div className="rounded-2xl border bg-white p-4"><h4 className="font-semibold">What to say when calling</h4><p>“Hi, my name is ___. I need help with {need || 'my situation'}. I am in {stateFilter || 'my area'}.”</p><h4 className="mt-3 font-semibold">What happens when I call?</h4><p>They listen, ask safety questions, and connect you to next steps.</p><h4 className="mt-3 font-semibold">Related services</h4><ul className="list-disc pl-5">{related.map(r=> <li key={r.id}>{r.name}</li>)}</ul></div>}</div>}

        {step === 4 && <div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Saved help</h3><ul className="mt-2 list-disc pl-5">{saved.map(id => <li key={id}>{allServices.find(s=>s.id===id)?.name || id}</li>)}</ul></div>}

        {step === 5 && <div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Call log</h3><ul className="list-disc pl-5">{callLog.map((c,i)=><li key={i}>{c}</li>)}</ul></div><div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Appointment log</h3><button onClick={()=>{const n=[`${new Date().toLocaleDateString()} - Follow-up`, ...apptLog]; setApptLog(n); localStorage.setItem('appointment_log', JSON.stringify(n));}} className="rounded border px-3 py-2">Add appointment</button><ul className="mt-2 list-disc pl-5">{apptLog.map((a,i)=><li key={i}>{a}</li>)}</ul><h4 className="mt-3 font-semibold">Safety plan builder</h4><textarea id="safety-plan" className="mt-2 h-28 w-full rounded border p-2" placeholder="People I trust, safe places, emergency contacts..." /><button className="mt-2 rounded border px-3 py-1" onClick={()=>{const txt=(document.getElementById('safety-plan') as HTMLTextAreaElement)?.value||''; const blob=new Blob([txt],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='safety-plan.txt'; a.click();}}>Export safety plan (text)</button></div></div>}
      </section> : <section className="mt-4 grid gap-4 md:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl border bg-white p-4"><h2 className="text-xl font-semibold">Full Mode filters</h2><div className="mt-2 flex flex-wrap gap-2 text-sm"><a className="rounded border px-2 py-1" href="/">Directory</a><a className="rounded border px-2 py-1" href="/courses">Courses</a><a className="rounded border px-2 py-1" href="/practitioners">Practitioners</a><a className="rounded border px-2 py-1" href="/policy">Policy</a></div><select className="mt-2 w-full rounded border p-2" value={stateFilter} onChange={(e)=>setStateFilter(e.target.value)}><option value=''>All states</option>{states.map(s=><option key={s}>{s}</option>)}</select><select className="mt-2 w-full rounded border p-2" value={category} onChange={(e)=>setCategory(e.target.value)}><option value=''>All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><input className="mt-2 w-full rounded border p-2" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search directory" /><div className="mt-3 text-sm">Map view (state/local placeholder) · Practitioner search · Facebook/community groups · export support history</div></aside>
        <div className="space-y-3">{filtered.map((s)=> <article key={s.id} className="rounded-2xl border bg-white p-4"><h3 className="text-xl font-semibold">{s.name}</h3><p>{s.normal_description}</p><p className="text-sm">{s.state} · {s.opening_hours} · {s.verified_status}</p><div className="mt-2 flex gap-2"><a href={`tel:${s.phone.replace(/\s/g,'')}`} className="rounded bg-teal-700 px-3 py-2 text-white">Call</a><a href={s.website} className="rounded border px-3 py-2">Website</a><button onClick={()=>saveService(s.id)} className="rounded border px-3 py-2">{saved.includes(s.id)?'Saved':'Save'}</button></div><div className="mt-2 text-sm">Last checked: {s.last_checked_at} · Verified by: {s.source_name}</div><div className="mt-2 text-sm">Courses: {s.courses_programs.join(', ') || 'None'}</div><a className="mt-2 inline-block text-sm underline" href={`mailto:admin@helphub.au?subject=Report incorrect service: ${encodeURIComponent(s.name)}`}>Report incorrect info</a></article>)}<div className="rounded-2xl border bg-white p-4"><h3 className="font-semibold">Admin-style detail view</h3><p>Source URL, verification status, last checked, eligibility, related services are available in data model.</p></div>{isDev && <div className="rounded-2xl border bg-amber-50 p-4"><h3 className="font-semibold">Dev ingestion controls</h3><div className="mt-2 flex gap-2"><button className="rounded border px-3 py-2" onClick={()=>setHiddenGroups(v=>!v)}>{hiddenGroups ? 'Show community groups' : 'Hide community groups'}</button></div><p className="text-sm">For admins only. Public users never see this panel.</p><div className="mt-2"><label className="mr-2 text-sm">Role:</label><select value={adminRole} onChange={(e)=>setAdminRole(e.target.value as any)} className="rounded border px-2 py-1 text-sm"><option value='viewer'>Viewer</option><option value='editor'>Editor</option><option value='verifier'>Verifier</option><option value='admin'>Admin</option></select></div>{staleServices.length>0 && <div className="mt-2 rounded border bg-yellow-50 p-2 text-sm">Reminder: {staleServices.length} services are older than 90 days and need re-verification.</div>}<div className="mt-2 flex flex-wrap gap-2"><button className="rounded border px-3 py-2" onClick={()=>setImports(i=>[`API import queued ${new Date().toLocaleTimeString()}`,...i])}>Run API import</button><button className="rounded border px-3 py-2" onClick={()=>setImports(i=>[`CSV import queued ${new Date().toLocaleTimeString()}`,...i])}>Run CSV import</button><label className="rounded border px-3 py-2 cursor-pointer">Upload CSV<input type="file" accept=".csv" className="hidden" onChange={(e)=>onCsvUpload(e.target.files?.[0])} /></label><button className="rounded border px-3 py-2" onClick={()=>setImports(i=>[`Manual entry saved ${new Date().toLocaleTimeString()}`,...i])}>Manual entry</button><button className="rounded border px-3 py-2 bg-red-100" onClick={()=>{const job=forceScrapeDevOnly('Approved directory','https://example.org');setImports(i=>[`Force scrape (dev): ${job.sourceName} ${job.fetchedAt}`,...i]);}}>Force scrape (dev only)</button></div><ul className="mt-2 list-disc pl-5 text-sm">{imports.map((x,idx)=><li key={idx}>{x}</li>)}</ul><div className="mt-2 rounded border bg-white p-2 text-sm"><p className="font-semibold">Toggle services on/off + publish workflow</p><ul className="max-h-40 overflow-auto">{allServices.map(svc=><li key={svc.id} className="flex items-center justify-between gap-2 py-1"><span>{svc.name} <span className="text-xs text-slate-500">({publishState[svc.id] || 'published'})</span></span><div className="flex gap-1"><button className="rounded border px-2 py-1" onClick={()=>setStage(svc.id,'draft')}>Draft</button><button className="rounded border px-2 py-1" onClick={()=>setStage(svc.id,'review')}>Review</button><button className="rounded border px-2 py-1" onClick={()=>setStage(svc.id,'published')}>Publish</button><button className="rounded border px-2 py-1" onClick={()=>toggleDisable(svc.id)}>{disabledIds.includes(svc.id)?'Enable':'Disable'}</button></div></li>)}</ul></div><div className="mt-2 rounded border bg-white p-2 text-sm"><p className="font-semibold">Community group moderation queue</p><ul className="list-disc pl-5">{allServices.filter(x=>x.categories.includes('Facebook/community groups')).map(x=><li key={x.id}>{x.name} ({publishState[x.id] || 'published'})</li>)}</ul></div><div className="mt-2 rounded border bg-white p-2 text-sm"><p className="font-semibold">Audit log</p><ul className="max-h-28 overflow-auto list-disc pl-5">{auditLog.map((a,i)=><li key={i}>{a}</li>)}</ul></div>{importPreview.length>0 && <div className="mt-3 rounded border bg-white p-2 text-sm"><p className="font-semibold">CSV preview (first rows)</p><ul className="list-disc pl-5">{importPreview.map((r,i)=><li key={i}>{r}</li>)}</ul></div>}</div>}</div>
      </section>}
    </div>
  </main>;
}
