'use client';

import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

const practitionerFilters = [
  'Psychologist','Psychiatrist','GP','Paediatrician','Occupational therapist','Speech therapist','Counsellor','Social worker'
] as const;

const specialtyFilters = [
  'ADHD','Autism','Trauma','Domestic/family violence','Child support','Adult diagnosis','Neurodivergent-friendly','Bulk billing','Telehealth','In person','Taking new clients','Has booking link'
] as const;

const advocacyFilters = [
  'Domestic violence','Family violence','Autism','ADHD','Grandparents/family support','Legal aid','Housing','Disability support','Carer support','Men’s support','Women’s support','LGBTQIA+ support','Aboriginal/Torres Strait Islander support','Migrant/refugee support'
] as const;

const helplineFilters = ['24/7','Crisis','Non-crisis','Phone','Webchat','SMS/text','Email','Anonymous','State-based','National'] as const;

const scripts = [
  'Hi, I’m looking for help with ADHD assessment.',
  'Hi, I’m not safe at home and need advice.',
  'Hi, I need support with family violence and legal options.',
  'Hi, I’m a grandparent trying to get support for my family.'
];

const supportPurposeRules = [
  'Only import records with clear support purpose.',
  'Must include at least one contact method.',
  'Must include state, suburb/postcode, or national service area.',
  'Must include source URL and enough detail to categorise safely.',
  'Exclude vague wellness pages, outdated pages, no-contact listings, blogs, unverified social posts, and unrelated coaching pages.',
  'All imports default to unverified and require admin review before publish.'
];

export default function PractitionersPage() {
  const [mode, setMode] = useState<'simple' | 'full'>('simple');
  const [query, setQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedAdvocacy, setSelectedAdvocacy] = useState('');
  const [selectedHelpline, setSelectedHelpline] = useState('');

  const practitioners = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.easy_read_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
    const q = query.toLowerCase();
    const practitioner = practitionerFilters.some((p) => text.includes(p.toLowerCase())) || s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs');
    const professionMatch = !selectedProfession || text.includes(selectedProfession.toLowerCase());
    const specialtyMatch = !selectedSpecialty || text.includes(selectedSpecialty.toLowerCase());
    const queryMatch = !q || text.includes(q);
    return practitioner && professionMatch && specialtyMatch && queryMatch;
  }), [query, selectedProfession, selectedSpecialty]);

  const advocacyGroups = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
    return (!selectedAdvocacy || text.includes(selectedAdvocacy.toLowerCase())) && (s.tags.includes('advocacy') || s.categories.includes('Legal help') || s.categories.includes('Grandparents/family support'));
  }), [selectedAdvocacy]);

  const helplines = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')} ${s.opening_hours} ${s.service_area}`.toLowerCase();
    const isHelpline = s.phone !== 'NA' && (s.categories.includes('Crisis support') || s.tags.includes('counselling') || s.tags.includes('support'));
    return isHelpline && (!selectedHelpline || text.includes(selectedHelpline.toLowerCase()));
  }), [selectedHelpline]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Practitioner, advocacy group, and helpline discovery</h1>
      <p className="text-sm text-slate-700">Preferred sources: Healthdirect/NHSD APIs, Infoxchange/Ask Izzy, Ahpra register for registration checks, APS Find a Psychologist where permitted, official websites, and manual CSV imports.</p>
      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" onClick={() => setMode('simple')}>Simple Mode</button>
        <button className="rounded border px-3 py-1" onClick={() => setMode('full')}>Full Mode</button>
      </div>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Relevance and publishing rules</h2>
        <ul className="list-disc pl-5 text-sm space-y-1 mt-2">{supportPurposeRules.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>

      <section className="rounded-xl border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Practitioner filters</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search practitioner or clinic" className="rounded border p-2 w-full" />
        <div className="grid gap-2 md:grid-cols-3">
          <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="rounded border p-2"><option value="">All professions</option>{practitionerFilters.map((f) => <option key={f}>{f}</option>)}</select>
          <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="rounded border p-2"><option value="">All specialties</option>{specialtyFilters.map((f) => <option key={f}>{f}</option>)}</select>
        </div>
        <div className="space-y-3">{practitioners.map((p) => (
          <article key={p.id} className="rounded-xl border p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm">Profession: {selectedProfession || p.categories.join(', ')}</p>
            <p className="text-sm">Location: {p.state}</p>
            <p className="text-sm">Key areas: {p.tags.join(', ') || 'General support'}</p>
            {mode === 'full' && <>
              <p className="text-sm">Telehealth/in-person: {p.tags.some((t) => t.includes('online')) ? 'Telehealth available' : 'In person or mixed'}</p>
              <p className="text-sm">Verified status: {p.verified_status} · Last checked: {p.last_checked_at}</p>
              <p className="text-sm">More info: {p.normal_description}</p>
            </>}
            <div className="mt-2 flex gap-2 flex-wrap">
              <a className="rounded bg-teal-700 px-3 py-1 text-white" href={`tel:${p.phone.replace(/\s/g, '')}`}>Call</a>
              <a className="rounded border px-3 py-1" href={p.website}>Website</a>
              <a className="rounded border px-3 py-1" href={p.website}>Booking</a>
              <button className="rounded border px-3 py-1">Save</button>
            </div>
          </article>
        ))}</div>
      </section>

      <section className="rounded-xl border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Advocacy group filters</h2>
        <select value={selectedAdvocacy} onChange={(e) => setSelectedAdvocacy(e.target.value)} className="rounded border p-2"><option value="">All advocacy topics</option>{advocacyFilters.map((f) => <option key={f}>{f}</option>)}</select>
        {advocacyGroups.slice(0, mode === 'simple' ? 6 : advocacyGroups.length).map((g) => <article key={g.id} className="rounded border p-3"><h3 className="font-semibold">{g.name}</h3><p className="text-sm">{g.easy_read_description}</p><p className="text-sm">{g.state}</p><div className="mt-2 flex gap-2"><a href={`tel:${g.phone.replace(/\s/g, '')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Call</a><a href={g.website} className="rounded border px-3 py-1">Website</a></div></article>)}
      </section>

      <section className="rounded-xl border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Helpline filters</h2>
        <select value={selectedHelpline} onChange={(e) => setSelectedHelpline(e.target.value)} className="rounded border p-2"><option value="">All helpline types</option>{helplineFilters.map((f) => <option key={f}>{f}</option>)}</select>
        {helplines.slice(0, mode === 'simple' ? 8 : helplines.length).map((h) => <article key={h.id} className="rounded border p-3"><h3 className="font-semibold">{h.name}</h3><p className="text-sm">{h.opening_hours} · {h.service_area}</p><p className="text-sm">{h.phone}</p><a href={`tel:${h.phone.replace(/\s/g, '')}`} className="mt-2 inline-block rounded bg-teal-700 px-3 py-1 text-white">Call</a></article>)}
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Best next step suggestions</h2>
        <ul className="list-disc pl-5 text-sm">
          <li>Related helpline: Lifeline / 1800RESPECT depending on urgency.</li>
          <li>Related advocacy group: WWDA, Carer Gateway, or relevant legal/housing support.</li>
          <li>Related course/program: use listed service programs and workshops.</li>
          <li>What to say and what to have ready: summary of issue, safety concerns, location, and preferred contact method.</li>
          <li>Urgent vs non-urgent: call 000 for immediate danger; otherwise use listed helplines and practitioners.</li>
        </ul>
        <h3 className="font-semibold mt-3">What to say scripts</h3>
        <ul className="list-disc pl-5 text-sm">{scripts.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>
    </main>
  );
}
