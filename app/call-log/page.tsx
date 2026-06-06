'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Phone, Plus, Trash2, Mic, MicOff, ChevronRight, Hash, FileText, Clock,
} from 'lucide-react';

// Web Speech API minimal types (not fully standardised in TS DOM lib)
interface SR {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
interface SREvent {
  resultIndex: number;
  results: { length: number; [i: number]: { isFinal: boolean; [i: number]: { transcript: string } } };
}
type SRConstructor = new () => SR;
function getSR(): SRConstructor | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as unknown as { SpeechRecognition?: SRConstructor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SRConstructor }).webkitSpeechRecognition ??
    null
  );
}

interface CallEntry {
  id: string;
  date: string;
  time: string;
  serviceName: string;
  phone: string;
  outcome: string;
  referenceNumbers: string;
  notes: string;
  transcript: string;
}

const STORAGE_KEY = 'helphub_call_log';

function now() {
  const d = new Date();
  return {
    date: d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
  };
}

function newEntry(): CallEntry {
  return {
    id: crypto.randomUUID(),
    ...now(),
    serviceName: '',
    phone: '',
    outcome: '',
    referenceNumbers: '',
    notes: '',
    transcript: '',
  };
}

export default function CallLogPage() {
  const [entries, setEntries] = useState<CallEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const recognitionRef = useRef<SR | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CallEntry[];
      setEntries(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const save = (updated: CallEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  const addEntry = () => {
    const entry = newEntry();
    const updated = [entry, ...entries];
    save(updated);
    setExpandedId(entry.id);
  };

  const updateEntry = (id: string, patch: Partial<CallEntry>) => {
    save(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const deleteEntry = (id: string) => {
    if (!confirm('Delete this call log entry?')) return;
    save(entries.filter((e) => e.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const startTranscription = (entry: CallEntry) => {
    const SRClass = getSR();
    if (!SRClass) {
      alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    if (recording && recordingId === entry.id) {
      recognitionRef.current?.stop();
      setRecording(false);
      setRecordingId(null);
      return;
    }

    const recognition = new SRClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    let finalText = entry.transcript;

    recognition.onresult = (event: SREvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interim = result[0].transcript;
        }
      }
      updateEntry(entry.id, { transcript: finalText + interim });
    };

    recognition.onerror = () => {
      setRecording(false);
      setRecordingId(null);
    };

    recognition.onend = () => {
      setRecording(false);
      setRecordingId(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setRecordingId(entry.id);
  };

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-900">Call Log</h1>
          <p className="mt-1 text-sm text-slate-600">
            Keep a private record of your calls — notes, reference numbers, and transcriptions.
            Stored only on this device.
          </p>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 pb-32">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} — saved on this device only
          </p>
          <button
            onClick={addEntry}
            className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            <Plus size={15} />
            Log a call
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Phone size={32} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No calls logged yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Tap &ldquo;Log a call&rdquo; after speaking with a service to save notes and reference numbers.
            </p>
            <button
              onClick={addEntry}
              className="mt-4 flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800 mx-auto"
            >
              <Plus size={15} />
              Log your first call
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {entries.map((entry) => {
              const isOpen = expandedId === entry.id;
              const isThisRecording = recording && recordingId === entry.id;
              return (
                <article
                  key={entry.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Summary row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {entry.serviceName || 'Unnamed call'}
                        </p>
                        <p className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock size={11} />
                          {entry.date} at {entry.time}
                          {entry.referenceNumbers && (
                            <>
                              <span className="text-slate-200">·</span>
                              <Hash size={11} />
                              {entry.referenceNumbers.split('\n')[0]}
                            </>
                          )}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="flex-shrink-0 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Expanded form */}
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pb-5 pt-4 space-y-4">
                      {/* Date/time + service + phone row */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="label">Service / organisation</label>
                          <input
                            type="text"
                            value={entry.serviceName}
                            onChange={(e) => updateEntry(entry.id, { serviceName: e.target.value })}
                            placeholder="e.g. Lifeline, Legal Aid QLD"
                            className="input mt-1"
                          />
                        </div>
                        <div>
                          <label className="label">Phone number called</label>
                          <input
                            type="tel"
                            value={entry.phone}
                            onChange={(e) => updateEntry(entry.id, { phone: e.target.value })}
                            placeholder="e.g. 13 11 14"
                            className="input mt-1"
                          />
                        </div>
                        <div>
                          <label className="label">Date</label>
                          <input
                            type="text"
                            value={entry.date}
                            onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
                            className="input mt-1"
                          />
                        </div>
                        <div>
                          <label className="label">Time</label>
                          <input
                            type="text"
                            value={entry.time}
                            onChange={(e) => updateEntry(entry.id, { time: e.target.value })}
                            className="input mt-1"
                          />
                        </div>
                      </div>

                      {/* Outcome */}
                      <div>
                        <label className="label flex items-center gap-1.5">
                          <FileText size={13} />
                          Outcome / what was agreed
                        </label>
                        <input
                          type="text"
                          value={entry.outcome}
                          onChange={(e) => updateEntry(entry.id, { outcome: e.target.value })}
                          placeholder="e.g. Referral to local shelter, follow-up call scheduled for Friday"
                          className="input mt-1"
                        />
                      </div>

                      {/* Reference numbers */}
                      <div>
                        <label className="label flex items-center gap-1.5">
                          <Hash size={13} />
                          Reference / case numbers
                        </label>
                        <textarea
                          value={entry.referenceNumbers}
                          onChange={(e) =>
                            updateEntry(entry.id, { referenceNumbers: e.target.value })
                          }
                          placeholder="e.g. Case #12345&#10;DHS ref: 987654&#10;Court file: FAM-2026-001"
                          rows={3}
                          className="input mt-1 resize-none font-mono text-xs"
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="label">Notes</label>
                        <textarea
                          value={entry.notes}
                          onChange={(e) => updateEntry(entry.id, { notes: e.target.value })}
                          placeholder="Key points from the call, names of people you spoke to, next steps…"
                          rows={4}
                          className="input mt-1 resize-y"
                        />
                      </div>

                      {/* Transcription */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="label flex items-center gap-1.5">
                            <Mic size={13} />
                            Live transcription
                          </label>
                          <button
                            onClick={() => startTranscription(entry)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                              isThisRecording
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-teal-700 text-white hover:bg-teal-800'
                            }`}
                          >
                            {isThisRecording ? (
                              <>
                                <MicOff size={13} />
                                Stop recording
                                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-300" />
                              </>
                            ) : (
                              <>
                                <Mic size={13} />
                                Start transcription
                              </>
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Speak after pressing start. Transcription uses your device microphone and
                          stays on-device — nothing is sent to a server.
                        </p>
                        <textarea
                          value={entry.transcript}
                          onChange={(e) => updateEntry(entry.id, { transcript: e.target.value })}
                          placeholder="Transcription will appear here as you speak, or type manually…"
                          rows={5}
                          className={`input mt-2 resize-y font-mono text-xs ${
                            isThisRecording ? 'border-red-300 ring-1 ring-red-300' : ''
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
