import { services } from '@/lib/data';

export default function CoursesPage() {
  const programs = services
    .flatMap((service) => service.courses_programs.map((program) => ({
      id: `${service.id}-${program}`,
      program,
      serviceName: service.name,
      website: service.website,
      phone: service.phone,
      state: service.state,
      verified: service.verified_status,
      lastChecked: service.last_checked_at
    })))
    .filter((p) => p.program && p.program !== 'To be confirmed');

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Courses & Programs</h1>
      <p className="mb-4 text-sm text-slate-700">Workshops, programs, and guided supports from listed services.</p>
      <div className="space-y-3">
        {programs.map((p) => (
          <article key={p.id} className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">{p.program}</h2>
            <p className="text-sm">Provider: {p.serviceName}</p>
            <p className="text-xs text-slate-600">{p.state} · {p.verified} · Last checked {p.lastChecked}</p>
            <div className="mt-2 flex gap-2">
              <a className="rounded bg-teal-700 px-3 py-1 text-white" href={p.website}>Learn more</a>
              {p.phone !== 'NA' && <a className="rounded border px-3 py-1" href={`tel:${p.phone.replace(/\s/g, '')}`}>Call</a>}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
