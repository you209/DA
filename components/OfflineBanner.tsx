'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900 print:hidden"
    >
      <WifiOff size={14} className="flex-shrink-0" />
      You&apos;re offline — Saved Services, Call Log and Safety Plan still work. Calls, websites and maps need a
      connection.
    </div>
  );
}
