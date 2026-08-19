// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Link from 'next/link';
import TopShareBar from '@/components/TopShareBar';
import { FileText, ShieldCheck, Zap } from 'lucide-react';
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

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6761614725350917"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-[#050505] text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-black">
        
        {/* Top Floating Action Bar from Image 70840 */}
        <TopShareBar />

        {/* Main Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-black shadow-md shadow-emerald-500/20">
                <FileText className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  FORMILO
                  <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    2026
                  </span>
                </span>
                <span className="text-[10px] text-zinc-400 -mt-1">
                  Document &amp; Photo Tools
                </span>
              </div>
            </Link>

            {/* Category Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
              <Link href="/#photo-tools" className="hover:text-emerald-400 transition-colors">Photo Tools</Link>
              <Link href="/#signature-tools" className="hover:text-emerald-400 transition-colors">Signature Tools</Link>
              <Link href="/#pdf-tools" className="hover:text-emerald-400 transition-colors">PDF Tools</Link>
              <Link href="/#image-tools" className="hover:text-emerald-400 transition-colors">Image Tools</Link>
              <Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors">Exam Presets</Link>
            </nav>

            {/* Quick 20 KB Preset CTA */}
            <div className="flex items-center gap-2">
              <Link
                href="/exam/ssc-signature-20kb"
                className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>20 KB Preset</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* 4-Column Footer matching Image 70840 */}
        <footer className="w-full border-t border-zinc-900 bg-black mt-16 py-12 text-zinc-400 text-xs">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-black text-xs">
                  F
                </div>
                <span className="font-extrabold text-white text-sm">FORMILO</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Fast, 100% private client-side image compression, signature resizing, and PDF formatting engine for online exam application forms.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Server Uploads
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">TOOL SUITES</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/#photo-tools" className="hover:text-emerald-400">Photo Resizer Tools</Link></li>
                <li><Link href="/#signature-tools" className="hover:text-emerald-400">Signature Cropper</Link></li>
                <li><Link href="/#pdf-tools" className="hover:text-emerald-400">PDF Conversion Suite</Link></li>
                <li><Link href="/#image-tools" className="hover:text-emerald-400">Image Utilities &amp; Formats</Link></li>
                <li><Link href="/#exam-presets" className="hover:text-emerald-400">Government Exam Presets</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">COMPANY</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/" className="hover:text-emerald-400">About Us</Link></li>
                <li><Link href="/cyber-cafe" className="hover:text-emerald-400">Cyber Cafe Desk</Link></li>
                <li><Link href="https://t.me/formilo_alerts_hub" target="_blank" className="hover:text-emerald-400">Contact Support</Link></li>
                <li><Link href="/" className="hover:text-emerald-400">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">PRIVACY &amp; TERMS</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-500">
                <li><Link href="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-600">
            <p>&copy; {new Date().getFullYear()} Formilo. All rights reserved.</p>
            <p className="flex items-center gap-1 font-mono text-zinc-500">
              Built for fast client-side performance <span className="text-emerald-500">&bull;</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
