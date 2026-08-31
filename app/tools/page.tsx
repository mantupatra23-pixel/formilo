import React from 'react';
import Link from 'next/link';
import { getAllTools, getRegistryStats } from '@/lib/toolsData';
import ToolCard from '@/components/tools/ToolCard';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AllToolsPage() {
  const allTools = getAllTools();
  const stats = getRegistryStats();

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">All Tools Directory</span>
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            All Formilo Tools ({stats.totalDisplay})
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#53636A]">
            Browse all verified photo, signature, thumb impression, and PDF formatting tools.
          </p>
        </div>

        {/* 2-Column Responsive Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {allTools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              slug={tool.slug}
              badge={tool.badge}
              category={tool.category}
              targetKB={tool.targetKB}
              dimensions={tool.width && tool.height ? `${tool.width} × ${tool.height} px` : undefined}
              popular={tool.popular}
            />
          ))}
        </div>

      </div>
    </main>
  );
}
