import React from 'react';
import Link from 'next/link';
import HeroSearch from '@/components/home/HeroSearch';
import CyberCafeCard from '@/components/home/CyberCafeCard';
import FormChecker from '@/components/home/FormChecker';
import CategoryTabs from '@/components/home/CategoryTabs';
import TrustSection from '@/components/home/TrustSection';
import ToolCard from '@/components/tools/ToolCard';
import { examsData } from '@/data/exams';
import { ArrowRight, Zap, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const popularExams = examsData.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* 1. Hero, Search & Quick Chips */}
        <HeroSearch />

        {/* 2. Cyber Cafe & CSC Center Feature */}
        <CyberCafeCard />

        {/* 3. Category Filter Tabs & Main Tools Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#162630]">
                ⚡ Most Used Document Tools
              </h2>
              <p className="text-xs text-[#65737A]">Universal presets for government forms and exams</p>
            </div>
            <Link href="/photo-resizer-20kb" className="text-xs font-bold text-[#00C98B] flex items-center gap-1 hover:underline">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CategoryTabs />
        </div>

        {/* 4. Exam Form Presets Section */}
        <div id="exam-presets" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#162630]">
                🎓 Exam Form Presets
              </h2>
              <p className="text-xs text-[#65737A]">Pre-configured dimension and file size locks for active recruitment portals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}-passport-size-photo-resizer`}
                className="group bg-white rounded-card p-5 border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F7F7F3] text-[#65737A] border border-[#DDE2DF]">
                    {exam.board}
                  </span>
                  <h3 className="font-bold text-sm text-[#162630] group-hover:text-[#00C98B] transition-colors">
                    {exam.title} Tools Suite
                  </h3>
                  <p className="text-xs text-[#65737A] line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8EBE9] text-xs">
                  <span className="text-[11px] font-mono text-[#89959A]">Photo • Sign • Thumb</span>
                  <span className="text-xs font-bold text-[#00C98B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Form File Checker (Is Your File Ready?) */}
        <FormChecker />

        {/* 6. Trust Section */}
        <TrustSection />

        {/* 7. Structured SEO Information */}
        <div className="bg-white border border-[#DDE2DF] rounded-card p-6 sm:p-8 space-y-4 text-xs text-[#65737A] leading-relaxed">
          <h3 className="text-sm font-bold text-[#162630]">
            About Formilo Government Form Preparation Platform
          </h3>
          <p>
            Formilo provides browser-based image and PDF formatting utilities tailored for candidate document uploads. Online recruitment portals such as SSC (Staff Selection Commission), UPSC, Railway RRB, State Police Boards, and NTA mandate strict limits on candidate photograph dimensions, file weight (such as strictly under 20 KB or 50 KB), and signature clarity.
          </p>
          <p>
            Using HTML5 client-side canvas algorithms, Formilo downscales images with bi-cubic smoothing to preserve facial features, candidate name strips (DOP/DOB), and ink stroke legibility while staying within byte restrictions.
          </p>
        </div>

      </div>
    </main>
  );
}
