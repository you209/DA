export default function PolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-6">
        <h1 className="text-3xl font-bold text-teal-700">HelpHub AU Safety, Policy & Compliance</h1>

        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Our goal</h2>
          <p>
            HelpHub AU helps people quickly find trusted Australian support services in stressful moments using clear,
            calm, and accessible guidance.
          </p>
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Important message</h2>
          <p>
            This app helps people find support services. It is not emergency, legal, medical, or counselling advice.
            If you are in immediate danger, call 000.
          </p>
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Legal and compliance commitments</h2>
          <ul className="list-disc pl-6">
            <li>We do not claim to replace emergency responders or licensed professionals.</li>
            <li>We do not claim quick-exit deletes browser history.</li>
            <li>We prefer official APIs, open datasets, and approved directories before scraping.</li>
            <li>We only use approved public-page scraping where terms and permissions allow it.</li>
            <li>Imported services are reviewed before public publishing.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Content quality and verification</h2>
          <ul className="list-disc pl-6">
            <li>Services include source name, source URL, and last checked date.</li>
            <li>Services can be marked verified, unverified, or needs review.</li>
            <li>Outdated services can be flagged and disabled.</li>
          </ul>
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Safe handoff to providers</h2>
          <p>
            HelpHub AU links users to provider-owned phone and website channels. Any counselling or chat is handled by
            the official provider systems.
          </p>
        </section>
      </div>
    </main>
  );
}
