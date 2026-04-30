'use client';

import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

const practitionerFilters = ['Psychologist', 'Psychiatrist', 'GP', 'Paediatrician', 'Occupational therapist', 'Speech therapist', 'Counsellor', 'Social worker'] as const;
const specialtyFilters = ['ADHD', 'Autism', 'Trauma', 'Domestic/family violence', 'Child support', 'Adult diagnosis', 'Neurodivergent-friendly', 'Bulk billing', 'Telehealth', 'In person', 'Taking new clients', 'Has booking link'] as const;
const advocacyFilters = ['Domestic violence', 'Family violence', 'Autism', 'ADHD', 'Grandparents/family support', 'Legal aid', 'Housing', 'Disability support', 'Carer support', 'Men’s support', 'Women’s support', 'LGBTQIA+ support', 'Aboriginal/Torres Strait Islander support', 'Migrant/refugee support'] as const;
const helplineFilters = ['24/7', 'Crisis', 'Non-crisis', 'Phone', 'Webchat', 'SMS/text', 'Email', 'Anonymous', 'State-based', 'National'] as const;

export default function PractitionersPage() {
  const [mode, setMode] = useState<'simple' | 'full'>('simple');
  const [query, setQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedAdvocacy, setSelectedAdvocacy] = useState('');
  const [selectedHelpline, setSelectedHelpline] = useState('');

  const practitioners = useMemo(() => services.filter((s) => {
    const text = `${s.name} ${s.normal_description} ${s.easy_read_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
    const practitioner = practitionerFilters.some((p) => text.includes(p.toLowerCase())) || s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs');
    return practitioner && (!selectedProfession || text.includes(selectedProfession.toLowerCase())) && (!selectedSpecialty || text.includes(selectedSpecialty.toLowerCase())) && (!query || text.includes(query.toLowerCase()));
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

  return <main className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Support directory</h1>
    <p className="text-sm text-slate-700">Helplines are prioritised first, then practitioners and advocacy groups.</p>
    <div className="flex gap-2">
      <button className="rounded border px-3 py-1" onClick={() => setMode('simple')}>Simple Mode</button>
      <button className="rounded border px-3 py-1" onClick={() => setMode('full')}>Full Mode</button>
    </div>

    <section className="rounded-xl border bg-white p-4 space-y-2">
      <h2 className="font-semibold">Helplines (priority)</h2>
      <select value={selectedHelpline} onChange={(e) => setSelectedHelpline(e.target.value)} className="rounded border p-2"><option value="">All helpline types</option>{helplineFilters.map((f) => <option key={f}>{f}</option>)}</select>
      {helplines.slice(0, mode === 'simple' ? 8 : helplines.length).map((h) => <article key={h.id} className="rounded border p-3"><h3 className="font-semibold">{h.name}</h3><p className="text-sm">{h.opening_hours} · {h.service_area}</p><p className="text-sm">{h.phone}</p><div className="mt-2 flex gap-2"><a href={`tel:${h.phone.replace(/\s/g, '')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Call</a><a href={h.website} className="rounded border px-3 py-1">Website</a></div></article>)}
    </section>

    <section className="rounded-xl border bg-white p-4 space-y-2">
      <h2 className="font-semibold">Practitioners</h2>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search practitioner or clinic" className="rounded border p-2 w-full" />
      <div className="grid gap-2 md:grid-cols-2">
        <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} className="rounded border p-2"><option value="">All professions</option>{practitionerFilters.map((f) => <option key={f}>{f}</option>)}</select>
        <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="rounded border p-2"><option value="">All specialties</option>{specialtyFilters.map((f) => <option key={f}>{f}</option>)}</select>
      </div>
      {practitioners.map((p) => <article key={p.id} className="rounded border p-3"><h3 className="font-semibold">{p.name}</h3><p className="text-sm">{p.easy_read_description}</p><p className="text-sm">{p.state}</p>{mode === 'full' && <p className="text-xs text-slate-600">{p.verified_status} · Last checked {p.last_checked_at}</p>}<div className="mt-2 flex gap-2"><a href={`tel:${p.phone.replace(/\s/g, '')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Call</a><a href={p.website} className="rounded border px-3 py-1">Website/Booking</a></div></article>)}
    </section>

    <section className="rounded-xl border bg-white p-4 space-y-2">
      <h2 className="font-semibold">Advocacy groups</h2>
      <select value={selectedAdvocacy} onChange={(e) => setSelectedAdvocacy(e.target.value)} className="rounded border p-2"><option value="">All advocacy topics</option>{advocacyFilters.map((f) => <option key={f}>{f}</option>)}</select>
      {advocacyGroups.slice(0, mode === 'simple' ? 6 : advocacyGroups.length).map((g) => <article key={g.id} className="rounded border p-3"><h3 className="font-semibold">{g.name}</h3><p className="text-sm">{g.easy_read_description}</p><p className="text-sm">{g.state}</p><div className="mt-2 flex gap-2"><a href={`tel:${g.phone.replace(/\s/g, '')}`} className="rounded bg-teal-700 px-3 py-1 text-white">Call</a><a href={g.website} className="rounded border px-3 py-1">Website</a></div></article>)}
    </section>
  </main>;
}
