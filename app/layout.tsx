// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import { FileText, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://formilo-jzcl.vercel.app'),
  title: {
    default: 'Formilo — Govt Exam Photo, Signature & PDF Tools (100% Private)',
    template: '%s | Formilo',
  },
  description:
    'Free online document resizer for SSC, UPSC, Railway, State PSC, and Banking forms. Compress photos and signatures strictly under 20 KB / 50 KB directly in your browser without uploading to any server.',
  keywords: [
    'photo resizer for govt exam',
    'ssc signature resizer 20kb',
    'upsc document compressor 50kb',
    'formilo exam tool',
    'sarkari exam photo compressor',
    'online image resizer in kb',
  ],
  authors: [{ name: 'Formilo Team' }],
  creator: 'Formilo',
  publisher: 'Formilo',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://formilo-jzcl.vercel.app',
    title: 'Formilo — 1-Click Govt Exam Document Resizer',
    description:
      'Compress photos and signatures to exact KB requirements for SSC, UPSC, RRB, and state police exams directly inside your browser.',
    siteName: 'Formilo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formilo — 1-Click Govt Exam Document Resizer',
    description:
      'Instant in-browser document compressor for all competitive exam applications.',
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-N34YNSXTTV"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N34YNSXTTV', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* Google AdSense (Auto Ads) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6761614725350917"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-[#050505] text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  FORMILO
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    2026
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 -mt-1 font-medium">
                  Browser-Native Doc Tools
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/cyber-cafe"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cyber Cafe Hub</span>
              </Link>
              <Link
                href="https://t.me/formilo_alerts_hub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-all active:scale-95 shadow-md shadow-emerald-500/20"
              >
                Telegram Alerts
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col">
          {children}
          
          {/* Telegram Viral Conversion Banner */}
          <TelegramBanner />
        </main>

        {/* Global Footer */}
        <footer className="w-full border-t border-zinc-900 bg-zinc-950/60 mt-12 py-8 text-zinc-400 text-xs">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <p className="font-semibold text-zinc-300">
                Formilo &copy; {new Date().getFullYear()} — Client-Side Document Processor
              </p>
              <p className="text-[11px] text-zinc-500 flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Files are processed locally in RAM. No photos or signatures are uploaded or stored.
              </p>
            </div>

            <div className="flex items-center gap-4 text-zinc-400 font-medium">
              <Link href="/" className="hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
