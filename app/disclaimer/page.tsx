import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { AlertTriangle, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer | Formilo',
  description: 'Official disclaimer for Formilo document and photo preparation tools.',
  alternates: {
    canonical: 'https://www.formilo.in/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] transition">Home</Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">Disclaimer</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Disclaimer
          </h1>
          <p className="text-[12px] text-[#66777D] font-mono">Last Updated: August 2026</p>
        </div>

        {/* Body */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-card text-[13.5px] text-[#53636A] leading-relaxed">
          
          <div className="p-4 bg-[#FDF2E9] border border-[#EBAA78]/50 rounded-xl flex items-center gap-3 text-xs text-[#A85A20]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span><strong>Important Notice:</strong> Formilo is an independent document utility platform and is NOT affiliated with, authorized by, or endorsed by any government entity or examination authority.</span>
          </div>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">1. Non-Government Entity</h2>
            <p>
              Formilo (www.formilo.in) is an independent technological platform providing browser-based document resizing, compression, and conversion utilities. All examination names, board acronyms (e.g., SSC, UPSC, RRB, NTA, IBPS), and references are used solely for descriptive and identification purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">2. Verification by Candidate</h2>
            <p>
              While we make every effort to ensure that our dimensional and file-size presets match current examination requirements, application rules may change without prior notice. Candidates are strongly advised to verify the latest specifications from the official notification of the respective recruitment board.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">3. Limitation of Liability</h2>
            <p>
              Formilo will not be held liable for any form rejection, application failure, or loss resulting from the use of our resizing, compressing, or formatting tools.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">4. Inquiries</h2>
            <p>
              If you have any questions concerning this disclaimer, contact us at <strong>formilohelp@gmail.com</strong>.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
