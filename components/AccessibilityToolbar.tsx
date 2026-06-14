'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Mode = { key: string; cls: string; label: string; activeLabel: string };

const MODES: Mode[] = [
  { key: 'easy_read_mode', cls: 'easy-read', label: 'Easy Read', activeLabel: 'Standard' },
  { key: 'large_text_mode', cls: 'font-xl', label: 'Large Text', activeLabel: 'Normal Text' },
  { key: 'high_contrast_mode', cls: 'high-contrast', label: 'Contrast', activeLabel: 'Contrast' },
];

export default function AccessibilityToolbar({
  disguiseEnabled,
  onEnableDisguise,
  onDisableDisguise,
}: {
  disguiseEnabled: boolean;
  onEnableDisguise: () => void;
  onDisableDisguise: () => void;
}) {
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const state: Record<string, boolean> = {};
    MODES.forEach(({ key, cls }) => {
      const on = localStorage.getItem(key) === 'true';
      state[key] = on;
      document.body.classList.toggle(cls, on);
    });
    setActive(state);
  }, []);

  const toggle = ({ key, cls }: Mode) => {
    const next = !active[key];
    setActive((a) => ({ ...a, [key]: next }));
    localStorage.setItem(key, String(next));
    document.body.classList.toggle(cls, next);
  };

  const readPage = () => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = (document.querySelector('main')?.textContent ?? document.body.textContent ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    const utt = new SpeechSynthesisUtterance(text);
    utt.onend = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utt);
    setSpeaking(true);
  };

  const handleDisguiseClick = () => {
    if (disguiseEnabled) {
      onDisableDisguise();
      return;
    }
    const ok = confirm(
      'HelpHub will be hidden behind a Notes app screen.\n\n' +
        'To bring HelpHub back, tap the "Notes" title 5 times quickly.\n\n' +
        'Turn on disguise mode?'
    );
    if (ok) onEnableDisguise();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg print:hidden">
      {MODES.map((mode) => (
        <button
          key={mode.key}
          onClick={() => toggle(mode)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            active[mode.key]
              ? 'border-slate-700 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {active[mode.key] ? mode.activeLabel : mode.label}
        </button>
      ))}
      <button
        onClick={readPage}
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          speaking
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        {speaking ? 'Stop' : 'Read aloud'}
      </button>
      <button
        onClick={handleDisguiseClick}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          disguiseEnabled
            ? 'border-slate-700 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        {disguiseEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
        {disguiseEnabled ? 'Exit disguise' : 'Disguise'}
      </button>
    </div>
  );
}
