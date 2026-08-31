import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import Badge from '@/components/common/Badge';

interface ToolCardProps {
  title: string;
  description: string;
  slug?: string;
  badge?: string;
  category?: string;
  targetKB?: number;
  dimensions?: string;
  format?: string;
  popular?: boolean;
}

export default function ToolCard({
  title,
  description,
  slug = '',
  badge,
  category,
  targetKB,
  dimensions,
  format = 'JPG',
  popular,
}: ToolCardProps) {
  const safeSlug = String(slug || '').trim();
  const href = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;
  const displayCategory = badge || (category ? category.toUpperCase() : 'TOOL');

  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#DDE2DF] hover:border-[#00C98B] shadow-sm hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between min-h-[180px] sm:min-h-[195px] gap-3.5">
      
      {/* Top Row: Category Badge (Left) & Popular Badge (Right) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge label={displayCategory} variant="green" />
          {targetKB && <Badge label={`< ${targetKB} KB`} variant="neutral" />}
        </div>

        {popular && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-[#FDF2E9] text-[#A85A20] border border-[#EBAA78]/50 shrink-0">
            <Zap className="w-3 h-3 fill-[#EBAA78] text-[#EBAA78]" />
            <span>POPULAR</span>
          </span>
        )}
      </div>

      {/* Main Title & Description */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-[#17262E] leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="text-[13px] text-[#53636A] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Metadata & Full-Width Calm Teal CTA Button */}
      <div className="space-y-2.5 pt-1">
        <div className="text-[12px] font-mono text-[#66777D]">
          {dimensions || (targetKB ? `JPG / JPEG • < ${targetKB} KB` : format)}
        </div>

        <Link
          href={href || '/'}
          className="w-full h-[42px] sm:h-[44px] rounded-xl bg-[#138F79] hover:bg-[#0E7764] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
