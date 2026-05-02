'use client';
import { useMemo, useState } from 'react';
import { services } from '@/lib/data';

export default function GuidedPathway() {
  const [answers, setAnswers] = useState({ danger: '', talkNow: '', court: '', monitoring: '' });
  const done = Object.values(answers).every(Boolean);
  const results = useMemo(() => {
    if (!done) return [];
    const out = [] as string[];
    if (answers.danger === 'yes') out.push('Call 000 now and use crisis helplines first.');
    if (answers.talkNow === 'yes') out.push('Start with Lifeline, 1800RESPECT, or state crisis lines.');
    if (answers.monitoring === 'yes') out.push('Use safer device planning and technology-abuse information.');
    if (answers.court === 'yes') out.push('Review parenting rights/FVO info and legal aid pathways.');
    return out;
  }, [answers, done]);

  const recommended = services.filter((s) => s.categories.includes('Crisis support')).slice(0, 4);

  return <section className="rounded-2xl border bg-white p-4 shadow-sm">
    <h2 className="text-xl font-semibold">Guided support pathway</h2>
    <div className="mt-3 grid gap-2 md:grid-cols-2">
      {[
        ['danger', 'Are you in immediate danger?'],
        ['talkNow', 'Do you need someone to talk to now?'],
        ['monitoring', 'Are you worried about monitoring/tech abuse?'],
        ['court', 'Are you dealing with parenting or court issues?']
      ].map(([k, q]) => <div key={k} className="rounded-xl border p-3"><p className="font-medium">{q}</p><div className="mt-2 flex gap-2"><button onClick={() => setAnswers((a) => ({ ...a, [k]: 'yes' }))} className="rounded border px-3 py-1">Yes</button><button onClick={() => setAnswers((a) => ({ ...a, [k]: 'no' }))} className="rounded border px-3 py-1">No</button></div></div>)}
    </div>
    {done && <div className="mt-4 space-y-2"><p className="font-semibold">Suggested next steps</p><ul className="list-disc pl-5 text-sm">{results.map((r) => <li key={r}>{r}</li>)}</ul><p className="text-sm">Recommended helplines:</p><ul className="list-disc pl-5 text-sm">{recommended.map((r) => <li key={r.id}>{r.name} — {r.phone}</li>)}</ul></div>}
  </section>;
}
