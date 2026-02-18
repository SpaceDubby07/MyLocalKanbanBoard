import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BoardProvider } from '@/context/BoardContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Boards',
  description: 'Simple personal task boards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <BoardProvider>
          {children}
          <Toaster />
        </BoardProvider>
      </body>
    </html>
  );
}
