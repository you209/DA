'use client';

import { useState } from 'react';
import {
  Shield, Users, MapPin, KeyRound, Backpack, FileText, Baby, StickyNote,
  Plus, Trash2, Download, Printer, RotateCcw, Phone, AlertTriangle,
} from 'lucide-react';
import {
  useSafetyPlan, type Contact, type SafePlace, type ChecklistItem, type SafetyPlan,
} from '@/lib/useSafetyPlan';

function planToText(plan: SafetyPlan): string {
  const lines: string[] = [];
  lines.push('MY SAFETY PLAN');
  lines.push(`Generated ${new Date().toLocaleDateString('en-AU')}`);
  lines.push('');
  lines.push('TRUSTED CONTACTS');
  if (plan.contacts.length === 0) {
    lines.push('  (none added)');
  } else {
    plan.contacts.forEach((c) => {
      lines.push(`  - ${c.name || 'Unnamed'} (${c.relationship || 'relationship not set'}): ${c.phone || 'no number'}`);
    });
  }
  lines.push('');
  lines.push('SAFE PLACES TO GO');
  if (plan.safePlaces.length === 0) {
    lines.push('  (none added)');
  } else {
    plan.safePlaces.forEach((p) => {
      lines.push(`  - ${p.name || 'Unnamed place'}${p.notes ? ` — ${p.notes}` : ''}`);
    });
  }
  lines.push('');
  lines.push('CODE WORD');
  lines.push(`  Word: ${plan.codeWord || '(not set)'}`);
  lines.push(`  Meaning: ${plan.codeWordMeaning || '(not set)'}`);
  lines.push('');
  lines.push('WHAT TO TAKE IF I NEED TO LEAVE');
  plan.bagItems.forEach((i) => lines.push(`  [${i.checked ? 'x' : ' '}] ${i.label}`));
  lines.push('');
  lines.push('IMPORTANT DOCUMENTS');
  plan.documents.forEach((i) => lines.push(`  [${i.checked ? 'x' : ' '}] ${i.label}`));
  lines.push('');
  lines.push('NOTES ABOUT CHILDREN');
  lines.push(`  ${plan.childrenNotes || '(none)'}`);
  lines.push('');
  lines.push('ADDITIONAL NOTES');
  lines.push(`  ${plan.notes || '(none)'}`);
  lines.push('');
  lines.push('EMERGENCY NUMBERS');
  lines.push('  Police / Fire / Ambulance: 000');
  lines.push('  1800RESPECT (domestic, family & sexual violence): 1800 737 732');
  lines.push('  Lifeline: 13 11 14');
  return lines.join('\n');
}

function ChecklistSection({
  items, onToggle, onRemove, newValue, onNewValueChange, onAdd, placeholder,
}: {
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  newValue: string;
  onNewValueChange: (value: string) => void;
  onAdd: () => void;
  placeholder: string;
}) {
  return (
    <div className="mt-4 space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
        >
          <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 flex-shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className={item.checked ? 'text-slate-400 line-through' : ''}>{item.label}</span>
          </label>
          <button
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
            className="flex-shrink-0 rounded-lg p-1 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={newValue}
          onChange={(e) => onNewValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="input"
        />
        <button
          onClick={onAdd}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
}

export default function SafetyPlanPage() {
  const { plan, setPlan, reset } = useSafetyPlan();
  const [newBagItem, setNewBagItem] = useState('');
  const [newDocItem, setNewDocItem] = useState('');

  const update = (patch: Partial<SafetyPlan>) => setPlan((prev) => ({ ...prev, ...patch }));

  const addContact = () =>
    update({ contacts: [...plan.contacts, { id: crypto.randomUUID(), name: '', phone: '', relationship: '' }] });
  const updateContact = (id: string, patch: Partial<Contact>) =>
    update({ contacts: plan.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const removeContact = (id: string) =>
    update({ contacts: plan.contacts.filter((c) => c.id !== id) });

  const addPlace = () =>
    update({ safePlaces: [...plan.safePlaces, { id: crypto.randomUUID(), name: '', notes: '' }] });
  const updatePlace = (id: string, patch: Partial<SafePlace>) =>
    update({ safePlaces: plan.safePlaces.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const removePlace = (id: string) =>
    update({ safePlaces: plan.safePlaces.filter((p) => p.id !== id) });

  const toggleBagItem = (id: string) =>
    update({ bagItems: plan.bagItems.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)) });
  const removeBagItem = (id: string) =>
    update({ bagItems: plan.bagItems.filter((i) => i.id !== id) });
  const addBagItem = () => {
    if (!newBagItem.trim()) return;
    update({ bagItems: [...plan.bagItems, { id: crypto.randomUUID(), label: newBagItem.trim(), checked: false }] });
    setNewBagItem('');
  };

  const toggleDocument = (id: string) =>
    update({ documents: plan.documents.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)) });
  const removeDocument = (id: string) =>
    update({ documents: plan.documents.filter((i) => i.id !== id) });
  const addDocument = () => {
    if (!newDocItem.trim()) return;
    update({ documents: [...plan.documents, { id: crypto.randomUUID(), label: newDocItem.trim(), checked: false }] });
    setNewDocItem('');
  };

  const downloadPlan = () => {
    const blob = new Blob([planToText(plan)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-safety-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!confirm('Clear your entire safety plan? This cannot be undone.')) return;
    reset();
  };

  const steps = [
    plan.contacts.some((c) => c.name.trim()),
    plan.safePlaces.some((p) => p.name.trim()),
    plan.codeWord.trim().length > 0,
    plan.bagItems.some((i) => i.checked),
    plan.documents.some((i) => i.checked),
  ];
  const completedSteps = steps.filter(Boolean).length;
  const totalSteps = steps.length;

  return (
    <>
      <div className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Shield size={24} className="text-teal-700" />
            Safety Plan
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            A private plan for staying safer — contacts, places to go, and what to take if you need to
            leave quickly. Saved only on this device, never sent anywhere.
          </p>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 pb-32">
        <div className="space-y-4 print:hidden">
          {/* Safety notice */}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Before you start</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-amber-800 leading-relaxed">
                <li>Everything you type here is saved only on this device — it is never sent to a server.</li>
                <li>
                  If someone else may check this device or find a printed copy, use <strong>Quick Exit</strong>{' '}
                  above and consider clearing your plan when you&apos;re finished.
                </li>
                <li>You can download or print your plan to keep a copy somewhere only you can access.</li>
              </ul>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Plan progress</span>
              <span className="text-slate-500">{completedSteps} of {totalSteps} sections started</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all duration-300"
                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Trusted contacts */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Users size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Trusted contacts</h2>
                  <p className="text-xs text-slate-500">People you could call, text, or stay with in an emergency</p>
                </div>
              </div>
              <button
                onClick={addContact}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-800"
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            {plan.contacts.length === 0 ? (
              <p className="mt-4 text-sm italic text-slate-400">No contacts added yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {plan.contacts.map((c) => (
                  <div
                    key={c.id}
                    className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1.5fr_1fr_1.2fr_auto] sm:items-center"
                  >
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateContact(c.id, { name: e.target.value })}
                      placeholder="Name"
                      className="input"
                    />
                    <input
                      type="text"
                      value={c.relationship}
                      onChange={(e) => updateContact(c.id, { relationship: e.target.value })}
                      placeholder="Relationship"
                      className="input"
                    />
                    <input
                      type="tel"
                      value={c.phone}
                      onChange={(e) => updateContact(c.id, { phone: e.target.value })}
                      placeholder="Phone number"
                      className="input"
                    />
                    <div className="flex justify-end gap-1.5">
                      {c.phone && (
                        <a
                          href={`tel:${c.phone.replace(/\s/g, '')}`}
                          aria-label={`Call ${c.name || 'contact'}`}
                          className="rounded-lg p-1.5 text-teal-600 transition-colors hover:bg-teal-50"
                        >
                          <Phone size={15} />
                        </a>
                      )}
                      <button
                        onClick={() => removeContact(c.id)}
                        aria-label="Remove contact"
                        className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Safe places */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">Safe places to go</h2>
                  <p className="text-xs text-slate-500">Places you could go quickly if you needed to leave</p>
                </div>
              </div>
              <button
                onClick={addPlace}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-800"
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            {plan.safePlaces.length === 0 ? (
              <p className="mt-4 text-sm italic text-slate-400">No places added yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {plan.safePlaces.map((p) => (
                  <div key={p.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePlace(p.id, { name: e.target.value })}
                        placeholder="e.g. Mum's house, a friend's place, a refuge"
                        className="input"
                      />
                      <button
                        onClick={() => removePlace(p.id)}
                        aria-label="Remove place"
                        className="flex-shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <textarea
                      value={p.notes}
                      onChange={(e) => updatePlace(p.id, { notes: e.target.value })}
                      placeholder="Notes — how to get there, who's there, anything to remember"
                      rows={2}
                      className="input mt-2 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Code word */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Code word</h2>
                <p className="text-xs text-slate-500">
                  A word or phrase to signal you need help, without saying so directly
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Code word or phrase</label>
                <input
                  type="text"
                  value={plan.codeWord}
                  onChange={(e) => update({ codeWord: e.target.value })}
                  placeholder="e.g. How's the weather up there?"
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="label">What it means / what should happen</label>
                <textarea
                  value={plan.codeWordMeaning}
                  onChange={(e) => update({ codeWordMeaning: e.target.value })}
                  placeholder="e.g. If I text or say this, please call me straight away or come and get me and the kids"
                  rows={2}
                  className="input mt-1 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Emergency bag */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Backpack size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">What to take if I need to leave</h2>
                <p className="text-xs text-slate-500">A checklist for a bag you can grab quickly</p>
              </div>
            </div>
            <ChecklistSection
              items={plan.bagItems}
              onToggle={toggleBagItem}
              onRemove={removeBagItem}
              newValue={newBagItem}
              onNewValueChange={setNewBagItem}
              onAdd={addBagItem}
              placeholder="Add another item…"
            />
          </section>

          {/* Important documents */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Important documents</h2>
                <p className="text-xs text-slate-500">Originals or copies worth keeping somewhere safe</p>
              </div>
            </div>
            <ChecklistSection
              items={plan.documents}
              onToggle={toggleDocument}
              onRemove={removeDocument}
              newValue={newDocItem}
              onNewValueChange={setNewDocItem}
              onAdd={addDocument}
              placeholder="Add another document…"
            />
          </section>

          {/* Children */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Baby size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Notes about children</h2>
                <p className="text-xs text-slate-500">
                  Names and ages, school or daycare, medications, custody arrangements — anything that helps keep
                  them safe and settled
                </p>
              </div>
            </div>
            <textarea
              value={plan.childrenNotes}
              onChange={(e) => update({ childrenNotes: e.target.value })}
              placeholder="Write anything that would help someone care for your children if you couldn't…"
              rows={4}
              className="input mt-4 resize-y"
            />
          </section>

          {/* Additional notes */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <StickyNote size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Additional notes</h2>
                <p className="text-xs text-slate-500">
                  Pets, vehicles, finances, work — anything else worth remembering
                </p>
              </div>
            </div>
            <textarea
              value={plan.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder="Write anything else here…"
              rows={4}
              className="input mt-4 resize-y"
            />
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pb-4 pt-2">
            <button
              onClick={downloadPlan}
              className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              <Download size={15} />
              Download as text file
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Printer size={15} />
              Print
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <RotateCcw size={15} />
              Clear plan
            </button>
          </div>
        </div>

        {/* Print view */}
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold">My Safety Plan</h1>
          <p className="text-sm text-slate-500">
            Generated {new Date().toLocaleDateString('en-AU')} — keep this somewhere only you can access
          </p>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Trusted contacts</h2>
          {plan.contacts.length === 0 ? (
            <p className="mt-2 text-sm">—</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {plan.contacts.map((c) => (
                <li key={c.id}>
                  {c.name || 'Unnamed'} ({c.relationship || '—'}): {c.phone || '—'}
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Safe places to go</h2>
          {plan.safePlaces.length === 0 ? (
            <p className="mt-2 text-sm">—</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {plan.safePlaces.map((p) => (
                <li key={p.id}>
                  {p.name || 'Unnamed place'}
                  {p.notes ? ` — ${p.notes}` : ''}
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Code word</h2>
          <p className="mt-2 text-sm">Word: {plan.codeWord || '—'}</p>
          <p className="text-sm">Meaning: {plan.codeWordMeaning || '—'}</p>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">
            What to take if I need to leave
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {plan.bagItems.map((i) => (
              <li key={i.id}>{i.checked ? '☑' : '☐'} {i.label}</li>
            ))}
          </ul>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Important documents</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {plan.documents.map((i) => (
              <li key={i.id}>{i.checked ? '☑' : '☐'} {i.label}</li>
            ))}
          </ul>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Notes about children</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm">{plan.childrenNotes || '—'}</p>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Additional notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm">{plan.notes || '—'}</p>

          <h2 className="mt-6 border-b border-slate-300 pb-1 text-base font-semibold">Emergency numbers</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Police / Fire / Ambulance: 000</li>
            <li>1800RESPECT: 1800 737 732</li>
            <li>Lifeline: 13 11 14</li>
          </ul>
        </div>
      </main>
    </>
  );
}
