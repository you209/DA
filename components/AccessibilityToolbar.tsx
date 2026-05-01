'use client';

import { useEffect, useState } from 'react';

export default function AccessibilityToolbar() {
  const [easyRead, setEasyRead] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('easy_read_mode') === 'true';
    setEasyRead(saved);
    document.body.classList.toggle('easy-read', saved);
  }, []);

  const toggleEasyRead = () => {
    const next = !easyRead;
    setEasyRead(next);
    localStorage.setItem('easy_read_mode', String(next));
    document.body.classList.toggle('easy-read', next);
  };

  const readPage = () => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = document.querySelector('main')?.textContent || document.body.textContent || '';
    const utt = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
    utt.rate = 1;
    utt.pitch = 1;
    utt.onend = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utt);
    setSpeaking(true);
  };

  return <div className="fixed bottom-3 right-3 z-50 flex gap-2 rounded-xl border bg-white/95 p-2 shadow">
    <button onClick={toggleEasyRead} className="rounded-lg border px-3 py-1 text-sm">{easyRead ? 'Standard text' : 'Easy Read'}</button>
    <button onClick={readPage} className="rounded-lg border px-3 py-1 text-sm">{speaking ? 'Stop reading' : 'Read aloud'}</button>
  </div>;
}
