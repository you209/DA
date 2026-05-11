'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

const NAV: { href: Route; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/practitioners', label: 'Find Services' },
  { href: '/courses', label: 'Courses' },
];

export default function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-teal-900 shadow-md">
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
        <div className="flex gap-1">
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
    </header>
  );
}
