// app/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  PenTool, 
  GraduationCap, 
  RefreshCw, 
  Flame, 
  SlidersHorizontal,
  Sparkles,
  Crop
} from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import examToolsData from '@/data/exam-presets.json';
import CyberCafeHub from '@/components/CyberCafeHub';

interface UnifiedTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'photo' | 'signature' | 'pdf' | 'image' | 'exam';
  badge: string;
  targetKB?: number;
  dimensions?: string;
  isPopular?: boolean;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Combined dataset (330+ Tools)
  const allTools = useMemo<UnifiedTool[]>(() => {
    const coreList: UnifiedTool[] = (TOOLS || []).map((t) => ({
      id: t.id || t.slug,
      slug: `/tools/${t.slug}`,
      name: t.name,
      description: t.description || t.shortDescription || '',
      category: t.category as 'photo' | 'signature' | 'pdf' | 'image',
      badge: t.badge === 'Exam Preset' ? 'Exam Preset' : t.badge || t.category.toUpperCase(),
      targetKB: t.targetKB,
      dimensions: t.targetWidth && t.targetHeight ? `${t.targetWidth} × ${t.targetHeight} px` : undefined,
      isPopular: [
        'photo-resize-20kb', 
        'photo-resize-50kb', 
        'signature-resize-20kb', 
        'watermark-remover',
        'jpg-to-pdf', 
        'pdf-to-jpg',
        'pdf-compressor',
        'ssc-cgl-photo-resizer',
        'passport-photo-resizer',
        'image-compressor'
      ].includes(t.slug),
    }));

    const examList: UnifiedTool[] = (examToolsData || []).map((e) => ({
      id: e.slug,
      slug: `/exam/${e.slug}`,
      name: e.title,
      description: e.description,
      category: 'exam',
      badge: `< ${e.targetKB} KB`,
      targetKB: e.targetKB,
      dimensions: e.dimensions,
      isPopular: false,
    }));

    return [...coreList, ...examList];
  }, []);

  const totalCount = allTools.length;
  const examCount = allTools.filter((t) => t.category === 'exam' || t.badge === 'Exam Preset').length;
  const photoCount = allTools.filter((t) => t.category === 'photo').length;
  const pdfCount = allTools.filter((t) => t.category === 'pdf').length;
  const signatureCount = allTools.filter((t) => t.category === 'signature').length;
  const imageCount = allTools.filter((t) => t.category === 'image').length;

  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'exam' && (tool.category === 'exam' || tool.badge === 'Exam Preset')) ||
        (selectedCategory === 'photo' && tool.category === 'photo') ||
        (selectedCategory === 'signature' && tool.category === 'signature') ||
        (selectedCategory === 'pdf' && tool.category === 'pdf') ||
        (selectedCategory === 'image' && tool.category === 'image');

      return matchesSearch && matchesCategory;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return allTools.filter((t) => t.isPopular);
  }, [allTools]);

  const quickPresets = [
    { label: '⚡ Photo < 20 KB', query: '20 KB', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { label: '✍️ Signature < 20 KB', query: 'Signature', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
    { label: '🧹 Watermark Remover', query: 'Watermark', color: 'border-violet-500/40 text-violet-400 bg-violet-500/10' },
    { label: '📄 JPG to PDF', query: 'PDF', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
    { label: '🪪 SSC CGL Presets', query: 'SSC', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { label: '📦 Compress 50 KB', query: '50 KB', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Client-Side Engine • {totalCount}+ Live Online Tools • Zero Server Upload</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Every Online Form File, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Resized & Formatted in Seconds
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Instant government exam presets, exact KB size reducers, watermark remover, signature background cleaners, and multi-page PDF conversion tools.
        </p>

        {/* Live Search Bar */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search across ${totalCount}+ tools (e.g. SSC, 20 KB photo, PDF, UPSC)...`}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 text-white placeholder-zinc-500 text-sm font-medium outline-none transition shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchQuery(preset.query)}
                className={`text-xs px-3 py-1 rounded-xl border font-semibold transition-all hover:scale-105 ${preset.color}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cyber Cafe & CSC Center Quick Hub Section */}
      <CyberCafeHub />

      {/* Category Tabs */}
      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: '🔥 All Tools', count: totalCount },
            { id: 'exam', label: '🪪 Exam Presets', count: examCount },
            { id: 'photo', label: '📸 Photo Resizers', count: photoCount },
            { id: 'pdf', label: '📄 PDF Suite', count: pdfCount },
            { id: 'signature', label: '✍️ Signatures', count: signatureCount },
            { id: 'image', label: '🔄 Converters', count: imageCount },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery('');
              }}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                selectedCategory === cat.id ? 'bg-black text-emerald-400' : 'bg-zinc-800 text-emerald-400 border border-zinc-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Tools Grid */}
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-10">
        {searchQuery.trim() !== '' ? (
          <section className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Search Results ({filteredTools.length})
            </h2>

            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                No tools found matching "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <UnifiedToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {selectedCategory === 'all' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400 fill-emerald-400" /> 
                    Featured & Most Used Tools
                  </h2>
                  <span className="text-xs text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    Top 10
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTools.map((tool) => (
                    <UnifiedToolCard key={tool.id} tool={tool} isFeatured />
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  {selectedCategory === 'all' ? 'All Formilo Tools' : `${selectedCategory.toUpperCase()} Tools`}
                </h2>
                <span className="text-xs text-zinc-400 font-mono">
                  {filteredTools.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <UnifiedToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function UnifiedToolCard({ tool, isFeatured }: { tool: UnifiedTool; isFeatured?: boolean }) {
  const getTheme = () => {
    switch (tool.category) {
      case 'exam':
        return {
          cardBorder: 'hover:border-amber-500/70 hover:shadow-amber-500/10',
          iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
          icon: <GraduationCap className="w-5 h-5" />,
          badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
          titleHover: 'group-hover:text-amber-300',
          btnText: 'text-amber-400',
          accentBar: 'bg-amber-500'
        };
      case 'pdf':
        return {
          cardBorder: 'hover:border-rose-500/70 hover:shadow-rose-500/10',
          iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
          icon: <FileText className="w-5 h-5" />,
          badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
          titleHover: 'group-hover:text-rose-300',
          btnText: 'text-rose-400',
          accentBar: 'bg-rose-500'
        };
      case 'signature':
        return {
          cardBorder: 'hover:border-cyan-500/70 hover:shadow-cyan-500/10',
          iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
          icon: <PenTool className="w-5 h-5" />,
          badge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40',
          titleHover: 'group-hover:text-cyan-300',
          btnText: 'text-cyan-400',
          accentBar: 'bg-cyan-500'
        };
      case 'image':
        return {
          cardBorder: 'hover:border-violet-500/70 hover:shadow-violet-500/10',
          iconBg: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
          icon: <RefreshCw className="w-5 h-5" />,
          badge: 'bg-violet-500/15 text-violet-300 border border-violet-500/40',
          titleHover: 'group-hover:text-violet-300',
          btnText: 'text-violet-400',
          accentBar: 'bg-violet-500'
        };
      case 'photo':
      default:
        return {
          cardBorder: 'hover:border-emerald-500/70 hover:shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          icon: <ImageIcon className="w-5 h-5" />,
          badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
          titleHover: 'group-hover:text-emerald-300',
          btnText: 'text-emerald-400',
          accentBar: 'bg-emerald-500'
        };
    }
  };

  const theme = getTheme();

  return (
    <Link
      href={tool.slug}
      className={`group relative p-5 rounded-2xl bg-[#121215] border-2 border-zinc-800/90 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden ${theme.cardBorder}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme.accentBar} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div>
        <div className="flex items-start justify-between gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${theme.iconBg}`}>
            {theme.icon}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg ${theme.badge}`}>
              {tool.badge}
            </span>

            {tool.targetKB && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-zinc-800 text-white border border-zinc-700">
                &lt; {tool.targetKB >= 1000 ? `${tool.targetKB / 1000} MB` : `${tool.targetKB} KB`}
              </span>
            )}
          </div>
        </div>

        <h3 className={`text-base sm:text-lg font-bold text-white mt-4 leading-snug transition-colors line-clamp-1 ${theme.titleHover}`}>
          {tool.name}
        </h3>

        <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {tool.description}
        </p>

        {tool.dimensions && (
          <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-300 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80">
            <span>Dimensions: {tool.dimensions}</span>
          </div>
        )}
      </div>

      <div className={`mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold ${theme.btnText}`}>
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
