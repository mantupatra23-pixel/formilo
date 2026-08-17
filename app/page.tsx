'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowRight, Search, FileText, Image as ImageIcon, 
  PenTool, GraduationCap, RefreshCw, Flame, ShieldCheck, Smartphone
} from 'lucide-react';
import { TOOLS, Tool } from '@/lib/tools';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Real-time Dynamic Category Counts
  const totalToolsCount = TOOLS.length;
  const examTools = useMemo(() => TOOLS.filter((t) => t.badge === 'Exam Preset' && t.enabled), []);
  const photoTools = useMemo(() => TOOLS.filter((t) => t.category === 'photo' && t.enabled), []);
  const pdfTools = useMemo(() => TOOLS.filter((t) => t.category === 'pdf' && t.enabled), []);
  const signatureTools = useMemo(() => TOOLS.filter((t) => t.category === 'signature' && t.enabled), []);
  const imageTools = useMemo(() => TOOLS.filter((t) => t.category === 'image' && t.enabled), []);

  // Filter tools based on search query and category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'exam' ? tool.badge === 'Exam Preset' : tool.category === selectedCategory);

      return tool.enabled && matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return TOOLS.filter((t) => [
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
    ].includes(t.slug));
  }, []);

  const quickPresets = [
    { label: '⚡ Photo < 20 KB', slug: 'photo-resize-20kb', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' },
    { label: '✍️ Signature < 20 KB', slug: 'signature-resize-20kb', color: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' },
    { label: '🧹 Watermark Remover', slug: 'watermark-remover', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10' },
    { label: '📄 JPG to PDF', slug: 'jpg-to-pdf', color: 'border-rose-500/50 text-rose-400 bg-rose-500/10' },
    { label: '🪪 SSC CGL (3.5x4.5cm)', slug: 'ssc-cgl-photo-resizer', color: 'border-amber-500/50 text-amber-400 bg-amber-500/10' },
    { label: '📦 Compress PDF', slug: 'pdf-compressor', color: 'border-rose-500/50 text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Mesh Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section with Live Dynamic Total Badge */}
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/5">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>100% Client-Side Engine • {totalToolsCount}+ Live Online Tools • Zero Server Upload</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Every Online Form File, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Resized & Formatted in Seconds
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
          Instant government exam presets, exact KB size reducers, watermark remover, signature background cleaners, and multi-page PDF conversion tools.
        </p>

        {/* Live Search & Quick Preset Chips */}
        <div className="max-w-3xl mx-auto space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search across ${totalToolsCount}+ tools (e.g. SSC, 20 KB photo, PDF, UPSC)...`}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/90 border-2 border-zinc-700/80 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 text-white placeholder-zinc-500 text-sm font-medium outline-none transition shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {quickPresets.map((preset, idx) => (
              <Link
                key={idx}
                href={`/tools/${preset.slug}`}
                className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all hover:scale-105 ${preset.color}`}
              >
                {preset.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tool Grid Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Active Search Results */}
        {searchQuery.trim() !== '' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                Search Results ({filteredTools.length})
              </h2>
            </div>

            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                No tools found matching "{searchQuery}". Try searching "20 kb", "signature", or "ssc".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <HighlightedToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Dynamic Real Total Category Selector */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: '🔥 All Tools', count: totalToolsCount },
                { id: 'exam', label: '🪪 Exam & Govt Presets', count: examTools.length },
                { id: 'photo', label: '📸 Photo KB Resizers', count: photoTools.length },
                { id: 'pdf', label: '📄 PDF Suite', count: pdfTools.length },
                { id: 'signature', label: '✍️ Signature Tools', count: signatureTools.length },
                { id: 'image', label: '🔄 Format Converters', count: imageTools.length }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
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

            {/* Featured Tools Grid */}
            {selectedCategory === 'all' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400 fill-emerald-400" /> 
                    Featured & Most Used Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} isFeatured />
                  ))}
                </div>
              </section>
            )}

            {/* Exam Presets Section */}
            {(selectedCategory === 'all' || selectedCategory === 'exam') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                    Government & Exam Portal Presets
                  </h2>
                  <span className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {examTools.length} Presets
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Photo Tools Section */}
            {(selectedCategory === 'all' || selectedCategory === 'photo') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" />
                    Exact KB Photo Resizers & Dimensions
                  </h2>
                  <span className="text-xs text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    {photoTools.length} Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* PDF Suite Section */}
            {(selectedCategory === 'all' || selectedCategory === 'pdf') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-400" />
                    PDF Converter & Compression Suite
                  </h2>
                  <span className="text-xs text-rose-400 font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    {pdfTools.length} Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pdfTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Signature Tools Section */}
            {(selectedCategory === 'all' || selectedCategory === 'signature') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-cyan-400" />
                    Signature Cleaners & Resizers
                  </h2>
                  <span className="text-xs text-cyan-400 font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    {signatureTools.length} Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {signatureTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Image Converters Section */}
            {(selectedCategory === 'all' || selectedCategory === 'image') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-violet-400" />
                    Format Converters & Image Enhancers
                  </h2>
                  <span className="text-xs text-violet-400 font-bold px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    {imageTools.length} Tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imageTools.map((tool) => (
                    <HighlightedToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

      </main>
    </div>
  );
}

// ── HIGH-CONTRAST HIGHLIGHTED TOOL CARD ──────────────────────────────────────
function HighlightedToolCard({ tool, isFeatured }: { tool: Tool; isFeatured?: boolean }) {
  const isExam = tool.badge === 'Exam Preset';

  const getTheme = () => {
    if (isExam) {
      return {
        cardBorder: 'hover:border-amber-500/70 hover:shadow-amber-500/10',
        iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
        icon: <GraduationCap className="w-5 h-5" />,
        badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
        titleHover: 'group-hover:text-amber-300',
        btnText: 'text-amber-400',
        accentBar: 'bg-amber-500'
      };
    }
    switch (tool.category) {
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
      href={`/tools/${tool.slug}`}
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
              {isExam ? 'Exam Preset' : tool.category}
            </span>

            {tool.targetKB && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-zinc-800 text-white border border-zinc-700">
                &lt; {tool.targetKB >= 1000 ? `${tool.targetKB / 1000} MB` : `${tool.targetKB} KB`}
              </span>
            )}
          </div>
        </div>

        <h3 className={`text-base sm:text-lg font-bold text-white mt-4 leading-snug transition-colors ${theme.titleHover}`}>
          {tool.name}
        </h3>

        <p className="text-xs text-zinc-300 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {tool.shortDescription || tool.description}
        </p>

        {(tool.targetWidth && tool.targetHeight) && (
          <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-300 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/80">
            <span>Dimensions: {tool.targetWidth} × {tool.targetHeight} px</span>
          </div>
        )}
      </div>

      <div className={`mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-bold ${theme.btnText}`}>
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
