'use client';

import { useMemo, useState } from 'react';
import { Phone, Globe, MapPin, Shield, ChevronDown, Bookmark } from 'lucide-react';
import { services } from '@/lib/data';
import { useSavedServices } from '@/lib/useSavedServices';

const mapLink = (name: string, state: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${state} Australia`)}`;

const TABS = [
  { key: 'helplines' as const, label: 'Helplines' },
  { key: 'practitioners' as const, label: 'Practitioners' },
  { key: 'advocacy' as const, label: 'Advocacy' },
];

type Tab = 'helplines' | 'practitioners' | 'advocacy';

export default function PractitionersPage() {
  const [tab, setTab] = useState<Tab>('helplines');
  const [stateFilter, setStateFilter] = useState('');

  const filtered = useMemo(
    () =>
      services.filter(
        (s) => !stateFilter || s.state === stateFilter || s.state === 'Australia-wide'
      ),
    [stateFilter]
  );

  const byState = useMemo(
    () =>
      services.reduce<Record<string, number>>((acc, s) => {
        acc[s.state] = (acc[s.state] || 0) + 1;
        return acc;
      }, {}),
    []
  );

  const helplines = filtered.filter(
    (s) => s.phone !== 'NA' && s.categories.includes('Crisis support')
  );
  const practitioners = filtered.filter(
    (s) => s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs')
  );
  const advocacy = filtered.filter(
    (s) =>
      s.tags.includes('advocacy') ||
      s.categories.includes('Legal help') ||
      s.categories.includes('Grandparents/family support')
  );

  const shown = tab === 'helplines' ? helplines : tab === 'practitioners' ? practitioners : advocacy;
  const counts = { helplines: helplines.length, practitioners: practitioners.length, advocacy: advocacy.length };
  const { toggle, isSaved } = useSavedServices();

  return (
    <>
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Support Services Directory</h1>
          <p className="mt-1 text-sm text-slate-600">
            Find trusted helplines, practitioners, and advocacy services with direct contact options.
          </p>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 pb-24">
        {/* Tabs + state filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === key
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {label}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    tab === key ? 'bg-teal-600 text-teal-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All states &amp; territories</option>
              {Object.keys(byState).sort().map((st) => (
                <option key={st} value={st}>
                  {st} ({byState[st]})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-5 space-y-3">
          {shown.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No services found for this filter. Try selecting a different state or tab.
            </div>
          ) : (
            shown.map((s) => (
              <article
                key={s.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(s.website)}&sz=64`}
                    alt=""
                    aria-hidden="true"
                    className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-lg border border-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-slate-900">{s.name}</h2>
                      {s.verified_status === 'verified' && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          <Shield size={10} />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{s.easy_read_description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {s.state}
                      </span>
                      <span>{s.opening_hours}</span>
                      <span>Last verified: {s.last_checked_at}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(s.id)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-teal-600"
                    aria-label={isSaved(s.id) ? 'Remove from saved' : 'Save this service'}
                  >
                    <Bookmark size={16} className={isSaved(s.id) ? 'fill-teal-600 text-teal-600' : ''} />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {s.phone !== 'NA' && (
                    <a
                      href={`tel:${s.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                    >
                      <Phone size={13} />
                      Call {s.phone}
                    </a>
                  )}
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Globe size={13} />
                    Website
                  </a>
                  <a
                    href={mapLink(s.name, s.state)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <MapPin size={13} />
                    View on map
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  );
}
