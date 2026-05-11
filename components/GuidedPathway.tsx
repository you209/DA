'use client';
import { useMemo, useState } from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import { services } from '@/lib/data';

const QUESTIONS = [
  { key: 'danger', question: 'Are you in immediate danger?' },
  { key: 'talkNow', question: 'Do you need someone to talk to right now?' },
  { key: 'monitoring', question: 'Are you concerned about device monitoring?' },
  { key: 'court', question: 'Are you dealing with parenting or court matters?' },
] as const;

type Key = typeof QUESTIONS[number]['key'];
type Answers = Record<Key, 'yes' | 'no' | ''>;

export default function GuidedPathway() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    danger: '', talkNow: '', monitoring: '', court: '',
  });

  const done = Object.values(answers).every(Boolean);

  const steps = useMemo(() => {
    if (!done) return [];
    const out: string[] = [];
    if (answers.danger === 'yes') out.push('Call 000 immediately and contact a crisis helpline listed below.');
    if (answers.talkNow === 'yes') out.push('Contact Lifeline, 1800RESPECT, or your state crisis line now.');
    if (answers.monitoring === 'yes') out.push('Use a safer device and read about technology abuse safety planning.');
    if (answers.court === 'yes') out.push('Review parenting rights, family violence orders, and legal aid options.');
    return out;
  }, [answers, done]);

  const recommended = services.filter((s) => s.categories.includes('Crisis support')).slice(0, 4);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="font-semibold text-slate-900">Not sure where to start?</p>
          <p className="text-sm text-slate-500">
            Answer 4 quick questions for personalised guidance.
          </p>
        </div>
        <ChevronRight
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-5">
          <div className="grid gap-3 md:grid-cols-2">
            {QUESTIONS.map(({ key, question }) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-800">{question}</p>
                <div className="mt-3 flex gap-2">
                  {(['yes', 'no'] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setAnswers((a) => ({ ...a, [key]: val }))}
                      className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                        answers[key] === val
                          ? val === 'yes'
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-700 text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {done && (
            <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
              <p className="font-semibold text-teal-900">Suggested next steps</p>
              <ul className="mt-2 space-y-1.5">
                {steps.length === 0 ? (
                  <li className="text-sm text-teal-700">
                    You're not in immediate crisis — explore services at your own pace.
                  </li>
                ) : (
                  steps.map((step) => (
                    <li key={step} className="flex items-start gap-2 text-sm text-teal-800">
                      <ChevronRight
                        size={14}
                        className="mt-0.5 flex-shrink-0 text-teal-500"
                        aria-hidden="true"
                      />
                      {step}
                    </li>
                  ))
                )}
              </ul>

              {recommended.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-teal-900">Recommended helplines</p>
                  <div className="mt-2 space-y-2">
                    {recommended.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-lg border border-teal-200 bg-white px-3 py-2"
                      >
                        <p className="text-sm font-medium text-slate-800">{r.name}</p>
                        {r.phone !== 'NA' && (
                          <a
                            href={`tel:${r.phone.replace(/\s/g, '')}`}
                            className="flex items-center gap-1 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
                          >
                            <Phone size={13} />
                            {r.phone}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
