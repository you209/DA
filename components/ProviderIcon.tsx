import { Globe } from 'lucide-react';

export default function ProviderIcon({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 ${className}`}
    >
      <Globe size={18} />
    </div>
  );
}
