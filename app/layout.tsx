import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://formilo.vercel.app'),
  title: 'Free Online Photo, PDF & Form Tools | Formilo',
  description: 'Free online tools to resize photos, compress images, resize signatures, convert JPG and PDF files, and prepare files for online forms.',
  keywords: ['photo resizer', 'signature resizer 20kb', 'image compressor', 'jpg to pdf', 'pdf compressor', 'passport photo resizer'],
  authors: [{ name: 'Formilo' }],
  openGraph: {
    title: 'Free Online Photo, PDF & Form Tools | Formilo',
    description: 'Free online tools to resize photos, compress images, resize signatures, convert JPG and PDF files, and prepare files for online forms.',
    url: 'https://formilo.vercel.app',
    siteName: 'Formilo',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Photo, PDF & Form Tools | Formilo',
    description: 'Free online tools to resize photos, compress images, resize signatures, convert JPG and PDF files.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col min-h-screen antialiased`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
