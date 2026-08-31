import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import Badge from '@/components/common/Badge';

interface ToolCardProps {
  title: string;
  description: string;
  slug?: string;
  badge?: string;
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
  targetKB,
  dimensions,
  format = 'JPG',
  popular,
}: ToolCardProps) {
  const safeSlug = String(slug || '').trim();
  const href = safeSlug.startsWith('/') ? safeSlug : `/${safeSlug}`;

  return (
    <Link
      href={href || '/'}
      className="group bg-[#FFFFFF] rounded-2xl p-5 border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between gap-4 relative"
    >
      {/* Top Meta Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {badge && <Badge label={badge} variant={popular ? 'orange' : 'green'} />}
          {targetKB && <Badge label={`< ${targetKB} KB`} variant="neutral" />}
        </div>
        {popular && (
          <span className="text-[11px] font-bold text-[#A85A20] flex items-center gap-1 shrink-0">
            <Zap className="w-3.5 h-3.5 fill-[#EBAA78] text-[#EBAA78]" />
            POPULAR
          </span>
        )}
      </div>

      {/* Main Title & High-Contrast Description */}
      <div className="space-y-1.5">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-[#17262E] group-hover:text-[#00A879] transition-colors line-clamp-1 leading-snug">
          {title}
        </h3>
        <p className="text-[13px] text-[#53636A] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Bottom Specs & Vibrant CTA Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E8EBE9] text-xs">
        <span className="text-[11px] sm:text-[12px] font-mono text-[#66777D] font-medium">
          {dimensions || format}
        </span>
        <span className="text-[12px] font-bold text-[#00A879] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
