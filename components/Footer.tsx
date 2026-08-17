// components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050507] border-t border-zinc-800/80 text-zinc-400 text-xs mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/30 bg-zinc-950 flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Formilo Logo" 
                  width={28}
                  height={28}
                  unoptimized
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-black text-sm tracking-wider text-white">FORMILO</span>
            </Link>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Fast, 100% private client-side image compression, signature resizing, and PDF formatting engine for online exam application forms.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" /> Zero Server Uploads
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">Tool Suites</h4>
            <ul className="space-y-2">
              <li><Link href="/photo-tools" className="hover:text-emerald-400 transition-colors">Photo Resizer Tools</Link></li>
              <li><Link href="/signature-tools" className="hover:text-emerald-400 transition-colors">Signature Cropper</Link></li>
              <li><Link href="/pdf-tools" className="hover:text-emerald-400 transition-colors">PDF Conversion Suite</Link></li>
              <li><Link href="/image-tools" className="hover:text-emerald-400 transition-colors">Image Utilities & Formats</Link></li>
              <li><Link href="/form-tools" className="hover:text-emerald-400 transition-colors">Government Exam Presets</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/disclaimer" className="hover:text-emerald-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] mb-3">Privacy & Terms</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px]">
          <p>© 2026 Formilo. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for fast client-side performance <Lock className="w-3 h-3 text-emerald-500 ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
