'use client';

import { useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';

const FAKE_NOTES = [
  { title: 'Shopping list', preview: 'Milk, bread, eggs, coffee, pasta…', date: 'Yesterday' },
  { title: 'Recipe — pasta bake', preview: 'Pasta, mince, tomato sauce, cheese…', date: 'Mon' },
  { title: 'Work follow-ups', preview: 'Email the team about the roster…', date: 'Mon' },
  { title: 'Gift ideas', preview: 'Book, scarf, gift card, plant…', date: 'Last week' },
  { title: 'Garden plan', preview: 'Plant tomatoes and herbs in spring…', date: 'Last week' },
];

export default function DisguiseOverlay({ onReveal }: { onReveal: () => void }) {
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Notes';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleTitleTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      onReveal();
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-amber-50 text-slate-900">
      <div className="border-b border-amber-100 bg-white px-4 py-4 shadow-sm">
        <button onClick={handleTitleTap} className="text-2xl font-bold">
          Notes
        </button>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-400 shadow-sm">
          <Search size={14} />
          Search notes
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-2">
          {FAKE_NOTES.map((n) => (
            <div key={n.title} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{n.title}</p>
                <p className="flex-shrink-0 text-xs text-slate-400">{n.date}</p>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">{n.preview}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        aria-label="New note"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
