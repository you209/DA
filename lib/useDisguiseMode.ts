import { useEffect, useState } from 'react';

const KEY = 'helphub_disguise_mode';

export function useDisguiseMode() {
  const [enabled, setEnabled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem(KEY) === 'true');
    setLoaded(true);
  }, []);

  const enable = () => {
    localStorage.setItem(KEY, 'true');
    setEnabled(true);
    setRevealed(false);
  };

  const disable = () => {
    localStorage.setItem(KEY, 'false');
    setEnabled(false);
    setRevealed(false);
  };

  const reveal = () => setRevealed(true);

  return { enabled, revealed, loaded, enable, disable, reveal };
}
