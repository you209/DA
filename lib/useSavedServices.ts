import { useEffect, useState } from 'react';

const KEY = 'helphub_saved_services';

export function useSavedServices() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[];
      setSaved(new Set(data));
    } catch {
      /* ignore parse errors */
    }
  }, []);

  const toggle = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        /* ignore storage errors */
      }
      return next;
    });
  };

  return { saved, toggle, isSaved: (id: string) => saved.has(id) };
}
