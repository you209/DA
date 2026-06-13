'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Phone, Globe, Search, ChevronRight, Shield, Bookmark, ChevronDown } from 'lucide-react';
import GuidedPathway from '@/components/GuidedPathway';
import SafetyNotice from '@/components/SafetyNotice';
import { services, states } from '@/lib/data';
import { useSavedServices } from '@/lib/useSavedServices';
import ProviderIcon from '@/components/ProviderIcon';

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
  const [stateFilter, setStateFilter] = useState('');
  const [savedOpen, setSavedOpen] = useState(false);
  const { saved, toggle, isSaved } = useSavedServices();

  // Persist state filter selection
  useEffect(() => {
    const stored = localStorage.getItem('helphub_state_filter');
    if (stored) setStateFilter(stored);
  }, []);
  const handleStateChange = (val: string) => {
    setStateFilter(val);
    localStorage.setItem('helphub_state_filter', val);
  };

  const keywords = TOPICS[activeTopic] || [];

  const topicCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TOPICS).map(([topic, kws]) => [
          topic,
          services.filter((s) => {
            const text =
              `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
            return kws.some((k) => text.includes(k));
          }).length,
        ])
      ),
    []
  );

  const results = useMemo(
    () =>
      services
        .filter((s) => {
          const text =
            `${s.name} ${s.normal_description} ${s.categories.join(' ')} ${s.tags.join(' ')}`.toLowerCase();
          const stateMatch =
            !stateFilter || s.state === stateFilter || s.state === 'Australia-wide';
          return (
            stateMatch &&
            (!query || text.includes(query.toLowerCase())) &&
            (!keywords.length || keywords.some((k) => text.includes(k)))
          );
        })
        .slice(0, 10),
    [query, keywords, stateFilter]
  );

  const savedServices = useMemo(
    () => services.filter((s) => saved.has(s.id)),
    [saved]
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
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 pb-32 space-y-6">
        <SafetyNotice />

        {/* Saved services */}
        {savedServices.length > 0 && (
          <section className="rounded-xl border border-teal-200 bg-teal-50 shadow-sm">
            <button
              onClick={() => setSavedOpen(!savedOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              aria-expanded={savedOpen}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-teal-800">
                <Bookmark size={15} className="fill-teal-600 text-teal-600" />
                Saved services ({savedServices.length})
              </span>
              <ChevronRight
                size={16}
                className={`text-teal-500 transition-transform duration-200 ${savedOpen ? 'rotate-90' : ''}`}
              />
            </button>
            {savedOpen && (
              <div className="border-t border-teal-100 px-4 pb-4 pt-3 space-y-2">
                {savedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-teal-200 bg-white px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.state}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.phone !== 'NA' && (
                        <a
                          href={`tel:${s.phone.replace(/\s/g, '')}`}
                          className="rounded-lg bg-teal-700 px-3 py-1 text-xs font-medium text-white hover:bg-teal-800"
                        >
                          Call
                        </a>
                      )}
                      <button
                        onClick={() => toggle(s.id)}
                        className="rounded-lg p-1 text-teal-600 hover:bg-teal-100"
                        aria-label="Remove from saved"
                      >
                        <Bookmark size={14} className="fill-teal-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Topic filters + state */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">What do you need today?</h2>
              <p className="text-sm text-slate-500">Select a topic to filter relevant services.</p>
            </div>
            <div className="relative">
              <select
                value={stateFilter}
                onChange={(e) => handleStateChange(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">All states</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(TOPICS).map(([topic]) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(activeTopic === topic ? '' : topic)}
                className={`relative rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-colors ${
                  activeTopic === topic
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {topic}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    activeTopic === topic
                      ? 'bg-teal-600 text-teal-100'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {topicCounts[topic]}
                </span>
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
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm font-medium text-slate-600">No services match your search.</p>
              <p className="mt-1 text-xs text-slate-400">Try a broader term, different topic, or change the state filter.</p>
            </div>
          ) : (
            <div key={`${activeTopic}-${query}-${stateFilter}`} className="mt-3 space-y-3">
              {results.map((s, i) => (
                <article
                  key={s.id}
                  style={{ animationDelay: `${Math.min(i * 30, 150)}ms` }}
                  className="animate-slide-in rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <ProviderIcon className="mt-0.5 h-9 w-9" />
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
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            {cat}
                          </span>
                        ))}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          {s.opening_hours}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(s.id)}
                      className="ml-1 flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-teal-600"
                      aria-label={isSaved(s.id) ? 'Remove from saved' : 'Save this service'}
                    >
                      <Bookmark
                        size={16}
                        className={isSaved(s.id) ? 'fill-teal-600 text-teal-600' : ''}
                      />
                    </button>
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
