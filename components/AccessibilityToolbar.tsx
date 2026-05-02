'use client';

import { useEffect, useState } from 'react';

export default function AccessibilityToolbar() {
  const [easyRead, setEasyRead] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const e = localStorage.getItem('easy_read_mode') === 'true';
    const l = localStorage.getItem('large_text_mode') === 'true';
    const h = localStorage.getItem('high_contrast_mode') === 'true';
    setEasyRead(e); setLargeText(l); setHighContrast(h);
    document.body.classList.toggle('easy-read', e);
    document.body.classList.toggle('font-xl', l);
    document.body.classList.toggle('high-contrast', h);
  }, []);

  const setMode = (key: string, value: boolean, cls: string, setter: (v: boolean)=>void) => {
    setter(value); localStorage.setItem(key, String(value)); document.body.classList.toggle(cls, value);
  };

  const readPage = () => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (speaking) { synth.cancel(); setSpeaking(false); return; }
    const text = document.querySelector('main')?.textContent || document.body.textContent || '';
    const utt = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    utt.onend = () => setSpeaking(false);
    synth.cancel(); synth.speak(utt); setSpeaking(true);
  };

  return <div className="fixed bottom-3 right-3 z-50 flex flex-wrap gap-2 rounded-xl border bg-white p-2 shadow-lg">
    <button onClick={() => setMode('easy_read_mode', !easyRead, 'easy-read', setEasyRead)} className={`rounded-lg border px-3 py-1 text-sm ${easyRead ? "bg-slate-900 text-white" : "bg-white"}`}>{easyRead ? 'Standard' : 'Easy Read'}</button>
    <button onClick={() => setMode('large_text_mode', !largeText, 'font-xl', setLargeText)} className={`rounded-lg border px-3 py-1 text-sm ${largeText ? "bg-slate-900 text-white" : "bg-white"}`}>{largeText ? 'Normal text' : 'Large text'}</button>
    <button onClick={() => setMode('high_contrast_mode', !highContrast, 'high-contrast', setHighContrast)} className={`rounded-lg border px-3 py-1 text-sm ${highContrast ? "bg-slate-900 text-white" : "bg-white"}`}>Contrast</button>
    <button onClick={readPage} className={`rounded-lg border px-3 py-1 text-sm ${speaking ? "bg-slate-900 text-white" : "bg-white"}`}>{speaking ? 'Stop' : 'Read aloud'}</button>
  </div>;
}
