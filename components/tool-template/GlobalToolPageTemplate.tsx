'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Layers, 
  ArrowRight, 
  Zap, 
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import AdSlot from './AdSlot';
import TelegramCTA from './TelegramCTA';
import ToolFAQ from './ToolFAQ';
import { ToolPageData } from '@/lib/toolPageHelper';

interface GlobalToolPageTemplateProps {
  data: ToolPageData;
  children: React.ReactNode;
}

export default function GlobalToolPageTemplate({ data, children }: GlobalToolPageTemplateProps) {
  return (
    <div className="w-full bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-emerald-400 transition-colors shrink-0">Home</Link>
          <span>/</span>
          <span className="text-zinc-500 shrink-0">{data.categoryName}</span>
          <span>/</span>
          <span className="text-emerald-400 font-semibold truncate">{data.title}</span>
        </nav>

        {/* 2. TOOL HERO */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Official Dimension &amp; Size Lock: {data.targetKB ? `< ${data.targetKB} KB` : 'Standard'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {data.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {data.description}
          </p>
        </div>

        {/* 3. AD SLOT #1 */}
        <AdSlot slotId="tool-top" />

        {/* 4. MAIN WORKING TOOL INTERACTION */}
        <div className="w-full">
          {children}
        </div>

        {/* 5. AD SLOT #2 */}
        <AdSlot slotId="tool-middle" />

        {/* 6. HOW TO USE & ZERO SERVER PRIVACY (2-Box Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>How to Use {data.title}</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 leading-relaxed">
              {data.howToSteps.map((step, idx) => (
                <li key={idx}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Server Upload Guarantee</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              {data.privacyMessage}
            </p>
            <div className="p-3 bg-black rounded-2xl border border-zinc-800 flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% In-Browser RAM Execution</span>
            </div>
          </div>
        </div>

        {/* 7. BEST FOR & METHODOLOGY (2-Box Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Best For &amp; Primary Use Cases</span>
            </div>
            <ul className="space-y-2 text-zinc-400 leading-relaxed">
              {data.bestFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>{data.methodology.heading}</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              {data.methodology.description}
            </p>
            {data.formula && (
              <div className="p-3 bg-black rounded-2xl border border-zinc-800 space-y-1 font-mono text-[12px] text-emerald-400">
                <span>{data.formula.expression}</span>
              </div>
            )}
          </div>
        </div>

        {/* 8. IMPORTANT NOTES & CAUTION */}
        <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-xl text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Important Notes &amp; Verification</span>
          </div>
          <ul className="space-y-2 text-zinc-400 leading-relaxed">
            {data.importantNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 9. RELATED TOOLS */}
        {data.relatedTools && data.relatedTools.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                RELATED FORM TOOLS
              </h3>
              <span className="text-xs text-zinc-500 font-mono">Quick Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.slug.replace(/^\//, '')}`}
                  className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {t.badge || 'TOOL'}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">{t.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">
                      {t.targetKB ? `< ${t.targetKB} KB` : 'Aspect-Safe'}
                    </span>
                    <span className="text-zinc-400 group-hover:text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 10. TELEGRAM CTA */}
        <TelegramCTA />

        {/* 11. FAQ ACCORDION */}
        <ToolFAQ faqs={data.faqs} />

        {/* 12. EXPLORE MORE TOOLS DISCOVERY */}
        {data.categoryTools && data.categoryTools.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                EXPLORE MORE {data.categoryName.toUpperCase()}
              </h3>
              <Link href="/tools" className="text-xs text-emerald-400 hover:underline font-bold flex items-center gap-1">
                View All Directory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.categoryTools.map((t) => (
                <Link
                  key={`cat-${t.slug}`}
                  href={`/${t.slug.replace(/^\//, '')}`}
                  className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {t.badge || 'PRESET'}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors pt-1 line-clamp-1">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">{t.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
                    <span className="font-mono text-emerald-400 text-[11px] font-bold">
                      {t.targetKB ? `< ${t.targetKB} KB` : 'Verified'}
                    </span>
                    <span className="text-zinc-400 group-hover:text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
