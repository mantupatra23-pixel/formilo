import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CyberCafeCard() {
  return (
    <div className="w-full bg-white border border-[#DDE2DF] rounded-card p-5 sm:p-7 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
      
      {/* Left Info */}
      <div className="space-y-2.5 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00C98B]/10 text-[#00a874] border border-[#00C98B]/20 text-[11px] font-bold uppercase tracking-wider">
          <Zap className="w-3 h-3 fill-[#00C98B]" />
          <span>CYBER CAFE &amp; CSC OPERATOR HUB</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-[#162630] tracking-tight">
          Fast Form Document Formatting Workspace
        </h2>

        <p className="text-xs text-[#65737A] leading-relaxed">
          Prepare candidate photos, signatures, handwritten declarations, and marksheet PDFs quickly from one high-speed workspace with zero server waiting queues.
        </p>

        {/* Quick Shortcuts Row */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link href="/exam/ssc-cgl-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
            SSC CGL Photo
          </Link>
          <Link href="/name-date-on-photo" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
            Name &amp; Date DOP
          </Link>
          <Link href="/exam/pan-card-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
            PAN 213×213 px
          </Link>
          <Link href="/exam/rrb-ntpc-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
            Railway NTPC
          </Link>
        </div>
      </div>

      {/* Right Action */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
        <Link
          href="/cyber-cafe"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-xs sm:text-sm text-center shadow-md shadow-[#00C98B]/20 hover:opacity-95 transition flex items-center justify-center gap-2"
        >
          <span>Open Cyber Cafe Hub</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/#exam-presets"
          className="px-5 py-2.5 rounded-xl bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] font-bold text-xs text-center border border-[#DDE2DF] transition"
        >
          View All Exam Presets
        </Link>
      </div>

    </div>
  );
}
