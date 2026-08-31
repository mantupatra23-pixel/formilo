'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#102630] text-[#FFFFFF] pt-12 pb-8 px-4 sm:px-6 border-t border-[#1f3847]">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info with Logo */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Formilo Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[17px] tracking-tight text-[#FFFFFF] leading-none">
                  FORMILO
                </span>
                <span className="text-[10px] font-bold text-[#B8C5C9] tracking-wider uppercase mt-0.5">
                  Document &amp; Photo Tools
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#B8C5C9] leading-relaxed max-w-sm">
              Free, browser-native photo, signature, and PDF formatting tools designed for government recruitment forms, online entrance exams, and Cyber Cafe operators.
            </p>

            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2 text-[12px] text-[#00C98B] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client-Side In-Browser Processing</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#B8C5C9]">
                <Mail className="w-3.5 h-3.5 text-[#00C98B]" />
                <a href="mailto:formilohelp@gmail.com" className="hover:text-white transition">
                  formilohelp@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Photo Resizers */}
          <div className="space-y-2.5 text-[13px]">
            <h4 className="font-bold text-[#FFFFFF] uppercase tracking-wider text-[12px]">Photo Resizers</h4>
            <ul className="space-y-2 text-[#C4D0D3]">
              <li><Link href="/photo-resizer-20kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 20 KB</Link></li>
              <li><Link href="/photo-resizer-30kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 30 KB</Link></li>
              <li><Link href="/photo-resizer-50kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 50 KB</Link></li>
              <li><Link href="/photo-resizer-100kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 100 KB</Link></li>
              <li><Link href="/photo-resizer-200kb" className="hover:text-[#00C98B] transition">Postcard Photo (4x6)</Link></li>
              <li><Link href="/name-date-on-photo" className="hover:text-[#00C98B] transition">Name &amp; Date on Photo</Link></li>
            </ul>
          </div>

          {/* Col 3: PDF Suite */}
          <div className="space-y-2.5 text-[13px]">
            <h4 className="font-bold text-[#FFFFFF] uppercase tracking-wider text-[12px]">PDF Tools</h4>
            <ul className="space-y-2 text-[#C4D0D3]">
              <li><Link href="/jpg-to-pdf-converter" className="hover:text-[#00C98B] transition">JPG to PDF Converter</Link></li>
              <li><Link href="/pdf-to-jpg-converter" className="hover:text-[#00C98B] transition">PDF to JPG Converter HD</Link></li>
              <li><Link href="/pdf-compressor" className="hover:text-[#00C98B] transition">PDF Compressor (&lt; 200 KB)</Link></li>
              <li><Link href="/exam/signature-resize-to-20kb" className="hover:text-[#00C98B] transition">Signature Under 20 KB</Link></li>
              <li><Link href="/tools/make-background-white-of-signature" className="hover:text-[#00C98B] transition">Signature Whitener</Link></li>
              <li><Link href="/cyber-cafe" className="hover:text-[#00C98B] transition">Cyber Cafe Hub</Link></li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div className="space-y-2.5 text-[13px]">
            <h4 className="font-bold text-[#FFFFFF] uppercase tracking-wider text-[12px]">Company &amp; Legal</h4>
            <ul className="space-y-2 text-[#C4D0D3]">
              <li><Link href="/about" className="hover:text-[#00C98B] transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#00C98B] transition">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#00C98B] transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#00C98B] transition">Terms &amp; Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-[#00C98B] transition">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#0C1D26] border border-[#1f3847] text-[12px] text-[#B8C5C9] leading-relaxed">
          <strong className="text-[#FFFFFF]">Disclaimer:</strong> Formilo is an independent platform and is not affiliated with any government recruitment board or examination authority. Guidelines are provided for preparation assistance. Always verify the latest official notification on the destination portal prior to submission.
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#1f3847] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#B8C5C9]">
          <div>
            © 2026 <strong>Formilo</strong>. All rights reserved. Support: <a href="mailto:formilohelp@gmail.com" className="text-white underline">formilohelp@gmail.com</a>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
