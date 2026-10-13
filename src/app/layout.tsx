import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { display, lato } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'ESN Lille',
  description: 'Erasmus Student Network Lille: events, trips and support for international students in Lille.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${lato.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
