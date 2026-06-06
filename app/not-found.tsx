import Link from 'next/link';
import type { Route } from 'next';
import { Home, Users } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
          <p className="mt-1 text-sm text-slate-600">
            We couldn&apos;t find the page you were looking for.
          </p>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 pb-24">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-5xl">🔍</p>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">This page doesn&apos;t exist</h2>
          <p className="mt-2 text-sm text-slate-500">
            The link may be outdated or the page has moved.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={'/' as Route}
              className="flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <Home size={15} />
              Go home
            </Link>
            <Link
              href={'/practitioners' as Route}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Users size={15} />
              Find Services
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm font-semibold text-amber-900">Need immediate help?</p>
          <p className="mt-1 text-sm text-amber-800">
            Call{' '}
            <a href="tel:000" className="font-bold underline">
              000
            </a>{' '}
            for emergencies or Lifeline{' '}
            <a href="tel:131114" className="font-bold underline">
              13 11 14
            </a>{' '}
            any time.
          </p>
        </div>
      </main>
    </>
  );
}
