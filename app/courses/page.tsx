'use client';

import { useMemo, useState } from 'react';
import { Globe, Phone, Shield, ChevronDown } from 'lucide-react';
import { services } from '@/lib/data';
import ProviderIcon from '@/components/ProviderIcon';

export default function CoursesPage() {
  const [stateFilter, setStateFilter] = useState('');

  const programs = useMemo(
    () =>
      services.flatMap((s) =>
        s.courses_programs
          .filter((c) => c && c !== 'To be confirmed')
          .map((title) => ({
            id: `${s.id}-${title}`,
            title,
            provider: s.name,
            website: s.website,
            phone: s.phone,
            state: s.state,
            area: s.service_area,
            summary: s.normal_description,
            eligibility: s.eligibility,
            hours: s.opening_hours,
            verified: s.verified_status,
            checked: s.last_checked_at,
          }))
      ),
    []
  );

  const stateCounts = useMemo(
    () =>
      programs.reduce<Record<string, number>>((acc, p) => {
        acc[p.state] = (acc[p.state] || 0) + 1;
        return acc;
      }, {}),
    [programs]
  );

  const shown = programs.filter(
    (p) => !stateFilter || p.state === stateFilter || p.state === 'Australia-wide'
  );

  return (
    <>
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Courses &amp; Programs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse practical programs and connect directly to official provider course pages.
          </p>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 pb-24">
        {/* Filter bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {shown.length} program{shown.length !== 1 ? 's' : ''} found
          </p>
          <div className="relative">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All states &amp; territories</option>
              {Object.keys(stateCounts).sort().map((st) => (
                <option key={st} value={st}>
                  {st} ({stateCounts[st]})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-4 space-y-3">
          {shown.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No programs found for this state. Try selecting a different filter.
            </div>
          ) : (
            shown.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <ProviderIcon className="mt-0.5 h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-900">{p.title}</h2>
                      {p.verified === 'verified' && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          <Shield size={10} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {p.provider} · {p.state}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
                    <div className="mt-2 space-y-0.5 text-xs text-slate-400">
                      {p.eligibility && p.eligibility !== 'Anyone' && (
                        <p>Eligibility: {p.eligibility}</p>
                      )}
                      {p.hours && <p>Hours: {p.hours}</p>}
                      <p>Last checked: {p.checked}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                  >
                    <Globe size={13} />
                    Course website
                  </a>
                  {p.phone !== 'NA' && (
                    <a
                      href={`tel:${p.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Phone size={13} />
                      Call provider
                    </a>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  );
}
