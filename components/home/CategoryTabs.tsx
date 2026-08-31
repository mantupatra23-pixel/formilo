'use client';

import React, { useState } from 'react';
import { getAllTools, getRegistryStats, ToolItem } from '@/lib/toolsData';
import ToolCard from '@/components/tools/ToolCard';

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'photo' | 'signature' | 'pdf'>('all');
  const allTools = getAllTools();
  const stats = getRegistryStats();

  const tabs = [
    { id: 'all', label: 'All Tools', count: stats.total },
    { id: 'photo', label: 'Photo Resizers', count: stats.photoCount },
    { id: 'signature', label: 'Signatures', count: stats.signatureCount },
    { id: 'pdf', label: 'PDF Tools', count: stats.pdfCount },
  ];

  const filtered = activeCategory === 'all'
    ? allTools.filter((t) => t.popular).slice(0, 9)
    : allTools.filter((t) => t.category === activeCategory).slice(0, 9);

  return (
    <section className="w-full space-y-6">
      
      {/* Category Tabs Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1 border-b border-[#DDE2DF]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white shadow-sm shadow-[#00C98B]/20'
                  : 'bg-white text-[#65737A] hover:text-[#162630] border border-[#DDE2DF]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-[#F7F7F3] text-[#89959A]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
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

    </section>
  );
}
