import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#102630] text-white pt-12 pb-8 px-4 sm:px-6 border-t border-[#1f3847]">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00C98B] to-[#00C7D9] flex items-center justify-center text-white font-black text-base shadow-sm">
                F
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  FORMILO
                </span>
                <span className="text-[9px] font-bold text-[#89959A] tracking-wider uppercase mt-0.5">
                  Document & Photo Tools
                </span>
              </div>
            </div>

            <p className="text-xs text-[#89959A] leading-relaxed max-w-sm">
              Free, browser-native photo, signature, and PDF formatting tools designed for government recruitment forms, online entrance exams, and Cyber Cafe operators.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#00C98B] pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side In-Browser Processing Guarantee</span>
            </div>
          </div>

          {/* Col 2: Popular Tools */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Popular Tools</h4>
            <ul className="space-y-2 text-[#89959A]">
              <li><Link href="/photo-resizer-20kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 20 KB</Link></li>
              <li><Link href="/photo-resizer-50kb" className="hover:text-[#00C98B] transition">Photo Resizer &lt; 50 KB</Link></li>
              <li><Link href="/exam/signature-resize-to-20kb" className="hover:text-[#00C98B] transition">Signature Under 20 KB</Link></li>
              <li><Link href="/tools/make-background-white-of-signature" className="hover:text-[#00C98B] transition">Signature Whitener</Link></li>
              <li><Link href="/name-date-on-photo" className="hover:text-[#00C98B] transition">Name & Date on Photo</Link></li>
            </ul>
          </div>

          {/* Col 3: Document & PDF */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">PDF & Document Suite</h4>
            <ul className="space-y-2 text-[#89959A]">
              <li><Link href="/jpg-to-pdf-converter" className="hover:text-[#00C98B] transition">JPG to PDF Converter</Link></li>
              <li><Link href="/pdf-to-jpg-converter" className="hover:text-[#00C98B] transition">PDF to JPG Converter HD</Link></li>
              <li><Link href="/pdf-compressor" className="hover:text-[#00C98B] transition">PDF Compressor (&lt; 200 KB)</Link></li>
              <li><Link href="/exam/pan-card-photo-resizer" className="hover:text-[#00C98B] transition">PAN Card Photo Resizer</Link></li>
              <li><Link href="/cyber-cafe" className="hover:text-[#00C98B] transition">Cyber Cafe Hub</Link></li>
            </ul>
          </div>

          {/* Col 4: Exam Categories */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Recruitment Presets</h4>
            <ul className="space-y-2 text-[#89959A]">
              <li><Link href="/#exam-presets" className="hover:text-[#00C98B] transition">SSC (CGL, CHSL, GD)</Link></li>
              <li><Link href="/#exam-presets" className="hover:text-[#00C98B] transition">Railway (RRB NTPC, Group D)</Link></li>
              <li><Link href="/#exam-presets" className="hover:text-[#00C98B] transition">Banking (IBPS, SBI PO)</Link></li>
              <li><Link href="/#exam-presets" className="hover:text-[#00C98B] transition">NTA (NEET UG, JEE Main)</Link></li>
              <li><Link href="/#exam-presets" className="hover:text-[#00C98B] transition">State Police Recruitment</Link></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Box */}
        <div className="p-3.5 rounded-xl bg-[#0C1D26] border border-[#1f3847] text-[11px] text-[#89959A] leading-relaxed">
          <strong className="text-neutral-300">Disclaimer:</strong> Formilo helps prepare documents according to standard technical specifications published in official recruitment guidelines. Requirements can change by board or application cycle. Always verify the latest notification on the respective official recruitment portal prior to final submission.
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-[#1f3847] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#89959A]">
          <div>
            © 2026 <strong>Formilo</strong>. All rights reserved. Built for fast client-side performance.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-white transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-white transition">Terms of Service</Link>
            <span>•</span>
            <Link href="/cyber-cafe" className="hover:text-white transition">CSC Center Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
