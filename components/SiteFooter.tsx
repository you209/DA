import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-base font-bold text-white">
              Help<span className="text-teal-400">Hub</span>{' '}
              <span className="text-teal-300">AU</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Connecting Australians to trusted support services for safety, family, and wellbeing.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Pages</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/practitioners" className="transition-colors hover:text-white">Find Services</Link></li>
              <li><Link href="/courses" className="transition-colors hover:text-white">Courses &amp; Programs</Link></li>
              <li><Link href="/call-log" className="transition-colors hover:text-white">Call Log</Link></li>
              <li><Link href="/safety-plan" className="transition-colors hover:text-white">Safety Plan</Link></li>
              <li><Link href="/policy" className="transition-colors hover:text-white">Privacy &amp; Safety</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">Crisis Support</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                Emergency:{' '}
                <a href="tel:000" className="font-bold text-white transition-colors hover:text-red-400">
                  000
                </a>
              </li>
              <li>
                1800RESPECT:{' '}
                <a href="tel:1800737732" className="text-white transition-colors hover:text-teal-300">
                  1800 737 732
                </a>
              </li>
              <li>
                Lifeline:{' '}
                <a href="tel:131114" className="text-white transition-colors hover:text-teal-300">
                  13 11 14
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-500">
          <p>
            HelpHub AU provides information to connect people with support services. This is not legal, medical, or
            emergency advice. Information is verified periodically — always confirm details directly with the service
            provider.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} HelpHub AU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
