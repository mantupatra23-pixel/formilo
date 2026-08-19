// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import TopShareBar from '@/components/TopShareBar';
import { ShieldCheck, Zap } from 'lucide-react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://formilo-jzcl.vercel.app'),
  title: {
    default: 'Formilo — 100% Private Govt Exam Photo, Signature & PDF Tools',
    template: '%s | Formilo',
  },
  description:
    'Free online document resizer for SSC, UPSC, Railway, State Police, and Banking forms. Compress photos and signatures strictly under 20 KB / 50 KB directly in your browser without uploading.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
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
        {/* Explicit Link Tags for Mobile Favicon Resolution */}
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />

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

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6761614725350917"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-[#050505] text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
        
        {/* Top Floating Action Bar */}
        <TopShareBar />

        {/* Main Header / Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Brand Logo with Hexagon Badge */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Formilo Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-tight">
                  FORMILO
                  <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    2026
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">
                  Document &amp; Photo Tools
                </span>
              </div>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
              <Link href="/#photo-resizers" className="hover:text-emerald-400 transition-colors">Photo Tools</Link>
              <Link href="/#signatures" className="hover:text-emerald-400 transition-colors">Signature Tools</Link>
              <Link href="/#pdf-suite" className="hover:text-emerald-400 transition-colors">PDF Tools</Link>
              <Link href="/#converters" className="hover:text-emerald-400 transition-colors">Image Tools</Link>
              <Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors">Exam Presets</Link>
            </nav>

            {/* Quick Preset CTA */}
            <div className="flex items-center gap-2">
              <Link
                href="/exam/ssc-cgl-2026-signature-crop-compress"
                className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>20 KB Preset</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* 4-Column Footer */}
        <footer className="w-full border-t border-zinc-900 bg-black mt-16 py-12 text-zinc-400 text-xs">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Formilo"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-extrabold text-white text-sm tracking-wide">FORMILO</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Fast, 100% private client-side image compression, signature resizing, and PDF formatting engine for online exam application forms.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Uploads
              </div>
            </div>

            {/* Col 2: Tool Suites */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">TOOL SUITES</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/#photo-resizers" className="hover:text-emerald-400 transition-colors">Photo Resizer Tools</Link></li>
                <li><Link href="/#signatures" className="hover:text-emerald-400 transition-colors">Signature Cropper</Link></li>
                <li><Link href="/#pdf-suite" className="hover:text-emerald-400 transition-colors">PDF Conversion Suite</Link></li>
                <li><Link href="/#converters" className="hover:text-emerald-400 transition-colors">Image Utilities &amp; Formats</Link></li>
                <li><Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors">Government Exam Presets</Link></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">COMPANY</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="/cyber-cafe" className="hover:text-emerald-400 transition-colors">Cyber Cafe Desk</Link></li>
                <li><Link href="https://t.me/formilo_alerts_hub" target="_blank" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
                <li><Link href="/name-date-on-photo" className="hover:text-emerald-400 transition-colors">Name &amp; Date Generator</Link></li>
              </ul>
            </div>

            {/* Col 4: Privacy & Terms */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">PRIVACY &amp; TERMS</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
            <p>&copy; 2026 Formilo. All rights reserved.</p>
            <p className="flex items-center gap-1 font-mono text-zinc-500">
              Built for fast client-side performance <span className="text-emerald-500">&bull;</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
