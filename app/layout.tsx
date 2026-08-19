// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  manifest: '/manifest.json',
  title: {
    default: 'Formilo — Free Online Photo, Signature & PDF Tools',
    template: '%s | Formilo',
  },
  description: 'Fast client-side photo compression, signature resizing under 20 KB, and PDF converter for SSC, UPSC, IBPS, and job forms. 100% free and private.',
  keywords: [
    'photo resize 20kb',
    'signature resize 20kb',
    'ssc photo resizer',
    'upsc photo resize online',
    'jpg to pdf converter',
    'watermark remover free',
    'online form photo resizer',
    'reduce photo size under 50kb',
    'driving license photo signature resizer',
    'passport photo maker'
  ],
  authors: [{ name: 'Formilo' }],
  creator: 'Formilo',
  publisher: 'Formilo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'Formilo — Free Online Photo, Signature & PDF Tools',
    description: 'Format photos, compress signatures, and convert PDFs under exact KB limits for government exams.',
    url: BASE_URL,
    siteName: 'Formilo',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formilo — Online Photo, Signature & PDF Tools',
    description: 'Compress photos & signatures under 20 KB, 50 KB, and convert PDFs directly in your browser.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Web App Manifest for PWA & Install Support */}
        <link rel="manifest" href="/manifest.json" />

        {/* Official Google AdSense Integration */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5180587791480026"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#09090b] text-zinc-100 antialiased flex flex-col justify-between`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
