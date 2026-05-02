import './globals.css';
import type { Metadata } from 'next';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';

export const metadata: Metadata = {
  title: 'HelpHub AU',
  description: 'Find support services across Australia quickly and safely.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<AccessibilityToolbar /></body>
    </html>
  );
}
