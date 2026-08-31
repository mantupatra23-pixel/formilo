import React from 'react';
import Link from 'next/link';
import { getAllTools } from '@/lib/toolsData';
import ToolCard from '@/components/tools/ToolCard';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AllToolsPage() {
  const allTools = getAllTools();

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#65737A]">
          <Link href="/" className="hover:text-[#00C98B] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-[#162630] font-semibold">All Tools</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#162630]">
            All Formilo Tools ({allTools.length}+)
          </h1>
          <p className="text-xs sm:text-sm text-[#65737A]">
            Browse all photo, signature, and PDF formatting presets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              slug={tool.slug}
              badge={tool.badge}
              targetKB={tool.targetKB}
              dimensions={tool.width && tool.height ? `${tool.width}×${tool.height} px` : undefined}
              popular={tool.popular}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
