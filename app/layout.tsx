import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'HelpHub AU',
  description: 'Find support services across Australia quickly and safely.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
