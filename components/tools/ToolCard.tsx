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
      className="group bg-white rounded-card p-5 border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-4 relative"
    >
      {/* Top Meta Badges */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {badge && <Badge label={badge} variant={popular ? 'orange' : 'green'} />}
          {targetKB && <Badge label={`< ${targetKB} KB`} variant="neutral" />}
        </div>
        {popular && (
          <span className="text-[10px] font-bold text-[#c97b40] flex items-center gap-1">
            <Zap className="w-3 h-3 fill-[#EBAA78] text-[#EBAA78]" />
            POPULAR
          </span>
        )}
      </div>

      {/* Main Title & Description */}
      <div className="space-y-1.5">
        <h3 className="font-bold text-sm text-[#162630] group-hover:text-[#00C98B] transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-xs text-[#65737A] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Bottom Specs & Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E8EBE9] text-xs">
        <span className="text-[11px] font-mono text-[#89959A]">
          {dimensions || format}
        </span>
        <span className="text-xs font-bold text-[#00C98B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
