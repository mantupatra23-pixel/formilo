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
import Badge from '@/components/common/Badge';
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
    <div className="space-y-8">
      
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-[13px] text-[#53636A] font-medium overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[#00A879] transition shrink-0">Home</Link>
        <span>/</span>
        <span className="text-[#53636A] shrink-0">{data.categoryName}</span>
        <span>/</span>
        <span className="text-[#17262E] font-bold truncate">{data.title}</span>
      </nav>

      {/* 2. TOOL HERO */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {data.badge && <Badge label={data.badge} variant="green" />}
          {data.targetKB && <Badge label={`STRICTLY < ${data.targetKB} KB`} variant="neutral" />}
          <Badge label="100% IN-BROWSER" variant="neutral" />
          <span className="text-[12px] text-[#66777D] font-mono">Updated: 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
          {data.title}
        </h1>

        <p className="text-[13.5px] sm:text-[14px] text-[#53636A] leading-relaxed max-w-3xl">
          {data.description}
        </p>
      </div>

      {/* 3. AD SLOT #1 (Top) */}
      <AdSlot slotId="tool-top" />

      {/* 4. MAIN INTERACTIVE TOOL WORKSPACE */}
      <div className="w-full">
        {children}
      </div>

      {/* 5. AD SLOT #2 (Middle) */}
      <AdSlot slotId="tool-middle" />

      {/* 6. HOW TO USE & BEST FOR / USE CASES (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* How to Use */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 space-y-3 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#17262E]">
              <FileCheck className="w-5 h-5 text-[#00A879]" />
              <h3>How to Use {data.title}</h3>
            </div>

            <ol className="list-decimal pl-4 space-y-2 text-[13px] text-[#53636A] leading-relaxed">
              {data.howToSteps.map((step, idx) => (
                <li key={idx}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Best For / Use Cases */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 space-y-3 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#17262E]">
              <CheckCircle2 className="w-5 h-5 text-[#00A879]" />
              <h3>Best For &amp; Primary Use Cases</h3>
            </div>

            <ul className="space-y-2 text-[13px] text-[#53636A] leading-relaxed">
              {data.bestFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#00A879] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* 7. METHODOLOGY / PROCESSING DETAILS */}
      <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 space-y-3 shadow-card">
        <div className="flex items-center gap-2 text-[15px] font-bold text-[#17262E]">
          <SlidersHorizontal className="w-5 h-5 text-[#00A879]" />
          <h3>{data.methodology.heading}</h3>
        </div>

        <p className="text-[13px] text-[#53636A] leading-relaxed">
          {data.methodology.description}
        </p>

        {data.formula && (
          <div className="p-3.5 bg-[#F7F7F3] rounded-xl border border-[#DDE2DF] space-y-2 mt-2">
            <span className="text-[11px] font-mono text-[#66777D] block uppercase font-bold">Calculation Formula</span>
            <div className="font-mono text-[14px] font-bold text-[#17262E]">{data.formula.expression}</div>
            {data.formula.variables.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[12px] text-[#53636A] pt-1">
                {data.formula.variables.map((v, i) => (
                  <div key={i}>
                    <strong className="text-[#17262E]">{v.symbol}</strong> = {v.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 8. IMPORTANT NOTES & PRIVACY GUARANTEE (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Important Notes */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 space-y-3 shadow-card">
          <div className="flex items-center gap-2 text-[15px] font-bold text-[#17262E]">
            <FileText className="w-5 h-5 text-[#00A879]" />
            <h3>Important Notes &amp; Assumptions</h3>
          </div>

          <ul className="space-y-2 text-[13px] text-[#53636A] leading-relaxed">
            {data.importantNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#EBAA78] font-bold mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy Section */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-6 space-y-3 shadow-card">
          <div className="flex items-center gap-2 text-[15px] font-bold text-[#17262E]">
            <Lock className="w-5 h-5 text-[#00A879]" />
            <h3>Browser-Native Privacy</h3>
          </div>

          <p className="text-[13px] text-[#53636A] leading-relaxed">
            {data.privacyMessage}
          </p>

          <div className="p-3 bg-[#F0F3F2] rounded-xl border border-[#D8DEDC] flex items-center gap-2 text-[12px] text-[#46565C] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#008760] shrink-0" />
            <span>Zero Remote Storage • Runs In RAM</span>
          </div>
        </div>

      </div>

      {/* 9. RELATED TOOLS (2-Column Desktop Grid) */}
      {data.relatedTools && data.relatedTools.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#53636A] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00A879]" />
              <span>RELATED FORM TOOLS</span>
            </h3>
            <span className="text-[11px] font-mono text-[#66777D]">Quick Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.relatedTools.map((t) => (
              <ToolCard
                key={t.slug}
                title={t.title}
                description={t.description}
                slug={t.slug}
                badge={t.badge}
                category={t.category}
                targetKB={t.targetKB}
                dimensions={t.width && t.height ? `${t.width} × ${t.height} px` : undefined}
                popular={t.popular}
              />
            ))}
          </div>
        </div>
      )}

      {/* 10. TELEGRAM CTA */}
      <TelegramCTA />

      {/* 11. FAQ SECTION */}
      <ToolFAQ faqs={data.faqs} />

      {/* 12. EXPLORE MORE CATEGORY DISCOVERY (2-Column Desktop Grid) */}
      {data.categoryTools && data.categoryTools.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
            <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[#17262E]">
              More {data.categoryName}
            </h3>
            <Link href="/tools" className="text-[12px] font-bold text-[#00A879] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.categoryTools.map((t) => (
              <ToolCard
                key={`cat-${t.slug}`}
                title={t.title}
                description={t.description}
                slug={t.slug}
                badge={t.badge}
                category={t.category}
                targetKB={t.targetKB}
                dimensions={t.width && t.height ? `${t.width} × ${t.height} px` : undefined}
                popular={t.popular}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
