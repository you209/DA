'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Phone, Globe, Search, ChevronRight, Shield } from 'lucide-react';
import GuidedPathway from '@/components/GuidedPathway';
import SafetyNotice from '@/components/SafetyNotice';
import { services } from '@/lib/data';

const TOPICS: Record<string, string[]> = {
  'I need help now': ['crisis', 'domestic violence', 'family violence', 'emergency'],
  'Talk to someone': ['crisis', 'counselling', 'mental health', 'support'],
  'Services near me': ['directory', 'support', 'practitioner', 'housing'],
  'Parenting & courts': ['parent', 'family', 'legal', 'separation'],
  'Neurodivergence': ['adhd', 'autism', 'neurodivergent'],
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('');

  const keywords = TOPICS[activeTopic] || [];

  const results = useMemo(
    () =>
      services
        .filter((s) => {
          const text =
            `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
          return (
            (!query || text.includes(query.toLowerCase())) &&
            (!keywords.length || keywords.some((k) => text.includes(k)))
          );
        })
        .slice(0, 10),
    [query, keywords]
  );

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-teal-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
            Australian Support Services
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            Find the support you need
          </h1>
          <p className="mt-3 max-w-2xl text-teal-100 md:text-lg">
            Trusted pathways to safety, family violence support, legal help, and wellbeing services
            across Australia.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="tel:000"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <Phone size={15} strokeWidth={2.5} />
              Emergency: Call 000
            </a>
            <Link
              href="/practitioners"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50"
            >
              Find Services Near Me
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 py-8 pb-24 space-y-6">
        <SafetyNotice />

        {/* Topic filters */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900">What do you need today?</h2>
          <p className="mt-1 text-sm text-slate-500">Select a topic to filter relevant services.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {Object.keys(TOPICS).map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(activeTopic === topic ? '' : topic)}
                className={`rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-colors ${
                  activeTopic === topic
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Search */}
        <section>
          <label htmlFor="search" className="text-sm font-medium text-slate-700">
            Search for support
          </label>
          <div className="relative mt-2">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: family violence, legal aid, mental health, housing…"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </section>

        {/* Guided pathway */}
        <GuidedPathway />

        {/* Results */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {activeTopic ? `Services: ${activeTopic}` : 'Support services'}
            </h2>
            <span className="text-sm text-slate-500">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No services match your search. Try a broader term or different topic.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {results.map((s) => (
                <article
                  key={s.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(s.website)}&sz=64`}
                      alt=""
                      aria-hidden="true"
                      className="mt-0.5 h-9 w-9 flex-shrink-0 rounded-lg border border-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{s.name}</h3>
                        {s.verified_status === 'verified' && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            <Shield size={10} />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{s.easy_read_description}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {s.state} · {s.opening_hours}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.phone !== 'NA' && (
                      <a
                        href={`tel:${s.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                      >
                        <Phone size={13} />
                        Call {s.phone}
                      </a>
                    )}
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Globe size={13} />
                      Website
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
