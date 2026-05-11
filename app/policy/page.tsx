export default function PolicyPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Safety, Privacy &amp; Compliance</h1>
          <p className="mt-1 text-sm text-slate-600">
            Our commitments to users, service providers, and community standards.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 pb-24">
        <div className="space-y-6">

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Our goal</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              HelpHub AU helps people quickly find trusted Australian support services in stressful moments using
              clear, calm, and accessible guidance.
            </p>
          </section>

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-base font-semibold text-amber-900">Important notice</h2>
            <p className="mt-2 text-sm text-amber-800 leading-relaxed">
              This app helps people find support services. It is <strong>not</strong> emergency, legal, medical, or
              counselling advice. If you are in immediate danger, call{' '}
              <a href="tel:000" className="font-bold underline">
                000
              </a>.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Legal &amp; compliance commitments</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                We do not claim to replace emergency responders or licensed professionals.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                We do not claim Quick Exit deletes your browser history.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                We prefer official APIs, open datasets, and approved directories before scraping.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                We only use approved public-page data where terms and permissions allow it.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                Imported services are reviewed and verified before public publishing.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Content quality &amp; verification</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                Services include source name, source URL, and last checked date.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                Services are marked as verified, unverified, or needs review.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                Outdated or inaccurate services can be flagged and disabled.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Safe handoff to providers</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              HelpHub AU links users to provider-owned phone and website channels. All counselling, chat, and
              intake processes are handled entirely by the official provider's systems.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
