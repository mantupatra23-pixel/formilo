import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">
                F
              </div>
              <span className="font-extrabold text-white tracking-wider text-sm">FORMILO</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Free online photo, PDF, and form utility suite. All processing executes 100% in your browser memory for total privacy.
            </p>
          </div>

          {/* Col 2: Tools */}
          <div className="space-y-2.5">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Tools</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><Link href="/tools/photo-resize-20kb" className="hover:text-emerald-400 transition-colors">Photo Resize 20 KB</Link></li>
              <li><Link href="/tools/photo-resize-50kb" className="hover:text-emerald-400 transition-colors">Photo Resize 50 KB</Link></li>
              <li><Link href="/tools/signature-resize-20kb" className="hover:text-emerald-400 transition-colors">Signature Resize</Link></li>
              <li><Link href="/tools/passport-photo-resizer" className="hover:text-emerald-400 transition-colors">Passport Size Photo</Link></li>
            </ul>
          </div>

          {/* Col 3: PDF Suite */}
          <div className="space-y-2.5">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">PDF Suite</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li><Link href="/tools/jpg-to-pdf" className="hover:text-emerald-400 transition-colors">JPG to PDF Converter</Link></li>
              <li><Link href="/tools/pdf-to-jpg" className="hover:text-emerald-400 transition-colors">PDF to JPG Converter</Link></li>
              <li><Link href="/tools/pdf-compressor" className="hover:text-emerald-400 transition-colors">PDF Compressor</Link></li>
              <li><Link href="/tools/image-compressor" className="hover:text-emerald-400 transition-colors">Image Compressor</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Privacy */}
          <div className="space-y-2.5">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Security & Legal</p>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="text-emerald-400 font-medium">✓ 100% Client-Side</li>
              <li className="text-zinc-500">Zero Server Storage</li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px]">
          <p>© 2026 Formilo. All rights reserved.</p>
          <p className="text-zinc-500">Fast. Private. Browser-Safe.</p>
        </div>
      </div>
    </footer>
  );
}
