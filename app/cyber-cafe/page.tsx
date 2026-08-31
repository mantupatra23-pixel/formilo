import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Zap, ShieldCheck, ArrowRight, Layers, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { examsData } from '@/data/exams';

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
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C98B]/10 border border-[#00C98B]/20 text-[#00a874] text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#00C98B]" />
            <span>OPERATOR DESK 2026 &bull; ZERO SERVER DELAY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#162630] tracking-tight">
            Cyber Cafe &amp; CSC Center Quick Workspace
          </h1>

          <p className="text-xs sm:text-sm text-[#65737A] leading-relaxed max-w-3xl">
            Designed specifically for digital service centers and cyber cafe operators. Format candidate application photos, signatures, thumb impressions, and marksheets at high speed directly in your browser.
          </p>
        </div>

        {/* Quick Operator Shortcuts Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#162630] uppercase tracking-wider text-[#65737A] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00C98B]" />
            <span>High-Frequency Cafe Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {frequentShortcuts.map((item) => (
              <Link
                key={item.slug}
                href={item.slug}
                className="p-4 rounded-card bg-white border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#F7F7F3] text-[#65737A] border border-[#DDE2DF]">
                    {item.tag}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#89959A] group-hover:text-[#00C98B] group-hover:translate-x-1 transition" />
                </div>
                <h3 className="text-xs font-bold text-[#162630] group-hover:text-[#00C98B] transition-colors">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Exam Presets Full List */}
        <div className="bg-white border border-[#DDE2DF] rounded-card p-6 sm:p-8 space-y-6 shadow-card">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#162630]">
              Active Recruitment Exam Suites ({examsData.length})
            </h2>
            <p className="text-xs text-[#65737A]">
              Select any exam to open its pre-calibrated photo, signature, and thumb impression tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {examsData.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}-passport-size-photo-resizer`}
                className="p-3.5 rounded-xl bg-[#F7F7F3] hover:bg-white border border-[#DDE2DF] hover:border-[#00C98B] transition flex items-center justify-between group"
              >
                <div className="space-y-0.5 truncate mr-2">
                  <p className="text-xs font-bold text-[#162630] group-hover:text-[#00C98B] transition-colors truncate">
                    {exam.title}
                  </p>
                  <p className="text-[10px] text-[#89959A] truncate">{exam.board}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#89959A] group-hover:text-[#00C98B] group-hover:translate-x-1 transition shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
