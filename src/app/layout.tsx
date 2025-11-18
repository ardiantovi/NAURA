import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'NAURA ELECTRONIC - Professional Sound Systems',
  description: 'Your one-stop shop for high-quality sound systems.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="https://image2url.com/images/1763435989049-14688da4-1c6a-4bf9-95fe-1d1b6a37b35d.png" type="image/png" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <FirebaseClientProvider>
            {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
