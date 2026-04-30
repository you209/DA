import { services } from '@/lib/data';

export default function PractitionersPage() {
  const practitioners = services.filter((s) => s.categories.includes('Psychologists') || s.categories.includes('Doctors/GPs'));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Practitioner Search</h1>
      <p className="mb-4 text-sm">Directory of GP and psychology pathways (state filters can be added next).</p>
      <div className="space-y-3">
        {practitioners.map((p) => (
          <article key={p.id} className="rounded-xl border bg-white p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm">{p.normal_description}</p>
            <p className="text-xs text-slate-600">{p.state} · {p.opening_hours}</p>
            <div className="mt-2 flex gap-2">
              <a className="rounded bg-teal-700 px-3 py-1 text-white" href={`tel:${p.phone.replace(/\s/g, '')}`}>Call</a>
              <a className="rounded border px-3 py-1" href={p.website}>Website</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
