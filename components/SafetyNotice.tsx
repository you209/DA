import { AlertTriangle } from 'lucide-react';

export default function SafetyNotice() {
  return (
    <section
      role="note"
      aria-label="Safety notice"
      className="rounded-xl border border-amber-200 bg-amber-50 p-4"
    >
      <div className="flex gap-3">
        <AlertTriangle
          size={18}
          className="mt-0.5 flex-shrink-0 text-amber-600"
          aria-hidden="true"
        />
        <div className="text-sm">
          <p className="font-semibold text-amber-900">Safety notice</p>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            This site provides information and support pathways — not legal, medical, or emergency
            advice. If you are in immediate danger, call{' '}
            <a href="tel:000" className="font-bold underline">
              000
            </a>
            . If someone may be monitoring your device, use <strong>Quick Exit</strong> in the menu
            above. Quick Exit does not clear your browser history.
          </p>
        </div>
      </div>
    </section>
  );
}
