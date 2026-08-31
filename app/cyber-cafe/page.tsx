import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Zap, ShieldCheck, ArrowRight, GraduationCap, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { examsData } from '@/data/exams';
import Badge from '@/components/common/Badge';

export const metadata: Metadata = {
  title: 'Cyber Cafe & CSC Center Quick Hub (2026) | Formilo',
  description: 'High-speed document and photo formatting workspace for Cyber Cafe and CSC operators. Zero server upload queues and 1-click presets.',
  alternates: {
    canonical: 'https://www.formilo.in/cyber-cafe',
  },
};

export default function CyberCafePage() {
  const frequentShortcuts = [
    { title: 'SSC CGL Photo & Sign', slug: '/exam/ssc-cgl-passport-size-photo-resizer', tag: 'SSC' },
    { title: 'Name & Date on Photo (DOP)', slug: '/name-date-on-photo', tag: 'NEW' },
    { title: 'PAN Card Photo (213×213 px)', slug: '/exam/pan-card-photo-resizer', tag: 'NSDL' },
    { title: 'PAN Signature (400×200 px)', slug: '/exam/pan-card-signature-resizer', tag: 'NSDL' },
    { title: 'NEET 4×6 Postcard Photo', slug: '/exam/nta-neet-ug-postcard-size-photo-4x6-resizer', tag: 'NTA' },
    { title: 'Signature Background Whitener', slug: '/tools/make-background-white-of-signature', tag: 'CLEAN' },
    { title: 'JPG to Multi-Page PDF', slug: '/jpg-to-pdf-converter', tag: 'PDF' },
    { title: 'PDF Compressor (< 200 KB)', slug: '/pdf-compressor', tag: 'PDF' },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* 1. Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C98B]/15 border border-[#00C98B]/30 text-[#008760] text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#00C98B]" />
            <span>OPERATOR DESK 2026 &bull; ZERO SERVER QUEUES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Cyber Cafe &amp; CSC Center Quick Workspace
          </h1>

          <p className="text-[13px] sm:text-[14px] text-[#53636A] leading-relaxed max-w-3xl">
            Designed specifically for digital service centers and cyber cafe operators. Format candidate application photos, signatures, thumb impressions, and marksheets at high speed directly in your browser.
          </p>
        </div>

        {/* 2. High-Frequency Cafe Shortcuts (Compact Quick-Launch) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
            <h2 className="text-[13px] sm:text-[14px] font-extrabold text-[#17262E] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00A879]" />
              <span>High-Frequency Cafe Shortcuts</span>
            </h2>
            <span className="text-[11px] font-mono text-[#66777D]">Quick Launch</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {frequentShortcuts.map((item) => (
              <Link
                key={item.slug}
                href={item.slug}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition flex flex-col justify-between gap-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <Badge label={item.tag} variant="neutral" />
                  <ArrowRight className="w-3.5 h-3.5 text-[#66777D] group-hover:text-[#00A879] group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-[13px] font-bold text-[#17262E] group-hover:text-[#00A879] transition-colors line-clamp-1 leading-snug">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Active Recruitment Exam Suites (Unified 2-Column Desktop Grid) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2 flex-wrap gap-2">
            <div className="space-y-0.5">
              <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#17262E] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#00A879]" />
                <span>Active Recruitment Exam Suites ({examsData.length})</span>
              </h2>
              <p className="text-[13px] text-[#53636A]">
                Select any exam suite to format photos, signatures, and document attachments to official guidelines.
              </p>
            </div>
            <span className="text-[12px] font-mono text-[#66777D] font-medium">
              {examsData.length} Suites Available
            </span>
          </div>

          {/* 2-Column Desktop Grid / 1-Column Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examsData.map((exam) => (
              <div
                key={exam.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#DDE2DF] hover:border-[#00C98B] shadow-sm hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[180px] sm:min-h-[195px] gap-3.5"
              >
                {/* Top: Board Badge & Meta */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Badge label={exam.board} variant="neutral" />
                    <span className="text-[11px] font-mono text-[#66777D]">
                      Photo • Sign • Thumb
                    </span>
                  </div>

                  <h3 className="font-bold text-[15px] sm:text-[16px] text-[#17262E] leading-snug pt-1">
                    {exam.title} Tools Suite
                  </h3>

                  <p className="text-[13px] text-[#53636A] leading-relaxed line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                {/* Bottom: Specs & Full-Width CTA Button */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-[12px] font-mono text-[#66777D]">
                    Official Dimension &amp; Size Lock Ready
                  </div>

                  <Link
                    href={`/exam/${exam.id}-passport-size-photo-resizer`}
                    className="w-full h-[42px] sm:h-[44px] rounded-xl bg-[#138F79] hover:bg-[#0E7764] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    <span>Open Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Operator Guarantee Box */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[14px] font-bold text-[#17262E]">
              <ShieldCheck className="w-5 h-5 text-[#00A879]" />
              <span>100% In-Browser Memory Processing Guarantee</span>
            </div>
            <p className="text-[13px] text-[#53636A] max-w-2xl leading-relaxed">
              No confidential customer photos, signature crops, or identity documents are ever uploaded to any server or database. All compression runs instantly in device RAM.
            </p>
          </div>

          <Link
            href="/#photo-tools"
            className="px-5 py-2.5 rounded-xl bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] font-bold text-[12px] text-center border border-[#DDE2DF] transition shrink-0"
          >
            Explore All Presets
          </Link>
        </div>

      </div>
    </main>
  );
}
