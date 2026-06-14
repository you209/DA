'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

const NAV: { href: Route; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/practitioners', label: 'Find Services' },
  { href: '/courses', label: 'Courses' },
  { href: '/call-log' as Route, label: 'Call Log' },
  { href: '/safety-plan' as Route, label: 'Safety Plan' },
];

export default function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 shadow-md print:hidden">
      {/* Crisis numbers bar */}
      <div className="bg-red-950 py-1.5 text-xs text-red-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-0.5 px-4">
          <span className="font-semibold text-white">In danger?</span>
          <a href="tel:000" className="font-bold text-white transition-colors hover:text-red-300">
            Emergency: 000
          </a>
          <span aria-hidden="true" className="hidden text-red-700 sm:inline">·</span>
          <a href="tel:131114" className="hidden transition-colors hover:text-white sm:inline">
            Lifeline: 13 11 14
          </a>
          <span aria-hidden="true" className="hidden text-red-700 md:inline">·</span>
          <a href="tel:1800737732" className="hidden transition-colors hover:text-white md:inline">
            1800RESPECT: 1800 737 732
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-teal-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Help<span className="text-teal-300">Hub</span>{' '}
            <span className="text-teal-200">AU</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  path === href
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-100 hover:bg-teal-800 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <a
            href="https://www.google.com"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-900"
            title="Leave this page immediately"
            aria-label="Quick exit — navigate away from this page now"
          >
            Quick Exit ✕
          </a>
        </div>

        {/* Mobile nav */}
        <nav className="border-t border-teal-800 px-4 py-2 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-wrap gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  path === href ? 'bg-teal-700 text-white' : 'text-teal-100 hover:bg-teal-800'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
