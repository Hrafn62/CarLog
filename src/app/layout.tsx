import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import ServiceWorkerRegistrar from '@/components/pwa/ServiceWorkerRegistrar';
import { AuthProvider } from '@/lib/hooks';

export const metadata: Metadata = {
  title: 'CarLog PWA',
  description: 'Minimalist PWA to manage vehicle maintenance.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#00BFFF" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ServiceWorkerRegistrar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
