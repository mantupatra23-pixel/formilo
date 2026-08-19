// app/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import examToolsData from '@/data/exam-presets.json';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  FileText, 
  ShieldCheck, 
  GraduationCap, 
  Image as ImageIcon, 
  FileCheck, 
  PenTool, 
  Layers,
  Flame,
  Calendar,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

interface FormiloTool {
  id: string;
  title: string;
  description: string;
  category: 'exam' | 'photo' | 'signature' | 'pdf' | 'converter';
  badge?: string;
  sizeBadge: string;
  href: string;
  isPopular?: boolean;
}

const CORE_PRIORITY_TOOLS: FormiloTool[] = [
  {
    id: 'name-date-photo',
    title: 'Name & Date on Photo (DOP / DOB) Generator',
    description: 'Add candidate name and photo date strip on passport photo strictly under 50 KB for SSC, RRB & Police forms.',
    category: 'photo',
    badge: 'NEW 2026',
    sizeBadge: '< 50 KB',
    href: '/name-date-on-photo',
    isPopular: true,
  },
  {
    id: 'pan-photo',
    title: 'PAN Card Photo Resizer (213 x 213 px)',
    description: 'Resize passport photo to exact 213x213 px and 300 DPI for NSDL and UTIITSL portal forms.',
    category: 'exam',
    badge: 'POPULAR',
    sizeBadge: '< 50 KB',
    href: '/exam/pan-card-photo-resizer',
    isPopular: true,
  },
  {
    id: 'pan-signature',
    title: 'PAN Card Signature Resizer (400 x 200 px)',
    description: 'Compress signature to exact 400x200 px, 300 DPI and under 30 KB with crisp white background.',
    category: 'signature',
    badge: 'POPULAR',
    sizeBadge: '< 30 KB',
    href: '/exam/pan-card-signature-resizer',
    isPopular: true,
  },
  {
    id: 'photo-20kb',
    title: 'Photo Resize to 20 KB',
    description: 'Compress and resize photos strictly under 20 KB for official government application forms.',
    category: 'photo',
    badge: 'POPULAR',
    sizeBadge: '< 20 KB',
    href: '/exam/photo-resize-under-20kb',
    isPopular: true,
  },
  {
    id: 'photo-50kb',
    title: 'Photo Resize to 50 KB',
    description: 'Resize and compress photos to under 50 KB while maintaining high visual clarity.',
    category: 'photo',
    badge: 'POPULAR',
    sizeBadge: '< 50 KB',
    href: '/exam/photo-resize-under-50kb',
    isPopular: true,
  },
  {
    id: 'signature-20kb',
    title: 'Signature Resize to 20 KB',
    description: 'Resize scanned signature photos to under 20 KB with sharp contrast and clean white background.',
    category: 'signature',
    badge: 'POPULAR',
    sizeBadge: '< 20 KB',
    href: '/exam/ssc-gd-signature',
    isPopular: true,
  },
  {
    id: 'nielit-ccc',
    title: 'NIELIT CCC Exam Photo & Sign Resizer',
    description: 'Format CCC form photos to 132x170 px and signature to 170x132 px (10 KB – 20 KB).',
    category: 'exam',
    badge: 'EXAM',
    sizeBadge: '10-20 KB',
    href: '/exam/nielit-ccc-photo-resizer',
    isPopular: true,
  },
  {
    id: 'watermark-remover',
    title: 'Online Watermark & Stamp Remover',
    description: 'Erase unwanted watermarks, dates, stamps, and text from photos using browser inpainting.',
    category: 'photo',
    badge: 'SMART TOOL',
    sizeBadge: 'AUTO',
    href: '/exam/photo-watermark-remover',
    isPopular: true,
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF Converter',
    description: 'Combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    category: 'pdf',
    badge: 'PRO',
    sizeBadge: 'FAST',
    href: '/cyber-cafe',
    isPopular: true,
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG Converter',
    description: 'Extract PDF document pages into high-resolution JPG images directly in RAM.',
    category: 'converter',
    badge: 'FAST',
    sizeBadge: 'HD',
    href: '/cyber-cafe',
    isPopular: true,
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor (< 200 KB)',
    description: 'Compress large PDF certificates and marksheets strictly under 200 KB / 500 KB for uploads.',
    category: 'pdf',
    badge: 'SAFE',
    sizeBadge: '< 200 KB',
    href: '/cyber-cafe',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'exam' | 'photo' | 'pdf' | 'signature' | 'converter'>('all');

  // Dynamically merge core tools with all 280+ presets from JSON
  const allTools = useMemo<FormiloTool[]>(() => {
    const rawExamPresets: FormiloTool[] = (examToolsData || []).map((item: any) => {
      const isSign = item.slug.includes('signature') || item.slug.includes('sign');
      const isThumb = item.slug.includes('thumb');
      const cat: 'exam' | 'photo' | 'signature' = isSign ? 'signature' : isThumb ? 'signature' : 'exam';

      return {
        id: item.slug,
        title: item.title || item.name,
        description: item.description || `Compress and format ${item.title} strictly under ${item.targetKB || 50} KB for official application portals.`,
        category: cat,
        badge: item.board || 'EXAM',
        sizeBadge: `< ${item.targetKB || 50} KB`,
        href: `/exam/${item.slug}`,
        isPopular: false,
      };
    });

    // Remove duplicates if any
    const existingSlugs = new Set(CORE_PRIORITY_TOOLS.map((t) => t.id));
    const filteredPresets = rawExamPresets.filter((p) => !existingSlugs.has(p.id));

    return [...CORE_PRIORITY_TOOLS, ...filteredPresets];
  }, []);

  // Category counts calculated directly from complete dataset
  const counts = useMemo(() => {
    return {
      all: allTools.length,
      exam: allTools.filter((t) => t.category === 'exam').length,
      photo: allTools.filter((t) => t.category === 'photo').length,
      signature: allTools.filter((t) => t.category === 'signature').length,
      pdf: allTools.filter((t) => t.category === 'pdf').length,
      converter: allTools.filter((t) => t.category === 'converter').length,
    };
  }, [allTools]);

  // Search & Category Filter
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.sizeBadge.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return allTools.filter((t) => t.isPopular);
  }, [allTools]);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 pb-16">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium shadow-lg shadow-emerald-950/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>100% Client-Side Engine &bull; {allTools.length}+ Live Online Tools &bull; Zero Server Upload</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Every Online Form File,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Resized &amp; Formatted in Seconds
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Instant government exam presets, exact KB size reducers, Name &amp; Date generators, watermark removers, and multi-page PDF conversion tools.
        </p>

        {/* Live Search Bar */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search across ${allTools.length}+ tools (e.g. Name Date, PAN, SSC, 20 KB photo, UPSC)...`}
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-950/90 border border-zinc-800 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 shadow-xl focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-mono text-zinc-500 hover:text-white cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Quick Tag Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium pt-1">
            <button
              onClick={() => setSearchQuery('photo 20 kb')}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 transition-all cursor-pointer"
            >
              ⚡ Photo &lt; 20 KB
            </button>
            <button
              onClick={() => setSearchQuery('signature')}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 transition-all cursor-pointer"
            >
              ✍️ Signature &lt; 20 KB
            </button>
            <button
              onClick={() => setSearchQuery('name date')}
              className="px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 transition-all cursor-pointer"
            >
              📅 Name &amp; Date (DOP)
            </button>
            <button
              onClick={() => setSearchQuery('pan')}
              className="px-2.5 py-1 rounded-lg bg-blue-950/50 border border-blue-500/30 text-blue-300 hover:bg-blue-900/50 transition-all cursor-pointer"
            >
              🪪 PAN Card 213x213
            </button>
            <button
              onClick={() => setSearchQuery('50 kb')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              📦 Compress 50 KB
            </button>
          </div>
        </div>
      </section>

      {/* Cyber Cafe & CSC Quick Hub */}
      <section className="max-w-5xl mx-auto px-4 my-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0d0e] border border-zinc-800/90 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cyber Cafe &amp; CSC Center Quick Hub</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Fast Document Formatting for CSC &amp; Cafe Operators
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                Formilo processes unlimited photos &amp; signatures directly in browser memory without server queues, watermark, or daily limits.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/cyber-cafe"
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <span>Bookmark on PC</span>
              </Link>
              <button
                onClick={() => { setSelectedCategory('exam'); setSearchQuery(''); }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>All Exam Presets</span>
              </button>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            <span className="text-zinc-600 font-mono">FREQUENT CAFE SHORTCUTS:</span>
            <Link href="/exam/ssc-cgl-passport-photo" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              SSC CGL Photo &rarr;
            </Link>
            <Link href="/name-date-on-photo" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80 text-amber-300">
              Name &amp; Date Photo &rarr;
            </Link>
            <Link href="/exam/pan-card-photo-resizer" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              PAN NSDL Photo &rarr;
            </Link>
            <Link href="/exam/rrb-ntpc-passport-photo" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              Railway NTPC &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Category Navigation Tabs */}
      <section className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tools</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-black/20 font-mono">{counts.all}</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('exam'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'exam'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Exam Presets</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-zinc-800 font-mono text-zinc-300">{counts.exam}</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('photo'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'photo'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Resizers</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-zinc-800 font-mono text-zinc-300">{counts.photo}</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('signature'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'signature'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Signatures</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-zinc-800 font-mono text-zinc-300">{counts.signature}</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('pdf'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'pdf'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Suite</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-zinc-800 font-mono text-zinc-300">{counts.pdf}</span>
          </button>

          <button
            onClick={() => { setSelectedCategory('converter'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === 'converter'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Converters</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-zinc-800 font-mono text-zinc-300">{counts.converter}</span>
          </button>
        </div>

        {/* Featured Section (when on 'All') */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Featured &amp; Most Used Tools</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                TOP 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularTools.map((tool) => (
                <ToolCard key={`featured-${tool.id}`} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Main Tools Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>
                {searchQuery ? `Search Results (${filteredTools.length})` : selectedCategory === 'all' ? `All Available Tools (${filteredTools.length})` : `${selectedCategory.toUpperCase()} Tools (${filteredTools.length})`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              {filteredTools.length} Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <p className="text-sm font-bold text-zinc-300">No matching tool found for "{searchQuery}"</p>
              <p className="text-xs text-zinc-500">Try searching for "Name Date", "PAN", "Photo", or "SSC".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>

        {/* Telegram Conversion */}
        <TelegramBanner />
      </section>
    </div>
  );
}

function ToolCard({ tool }: { tool: FormiloTool }) {
  return (
    <Link
      href={tool.href}
      className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800/80 hover:border-emerald-500/60 transition-all duration-200 flex flex-col justify-between gap-4 group shadow-lg hover:shadow-emerald-950/30"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
            {tool.category === 'signature' ? (
              <PenTool className="w-4 h-4" />
            ) : tool.category === 'pdf' ? (
              <FileText className="w-4 h-4" />
            ) : tool.category === 'exam' ? (
              <GraduationCap className="w-4 h-4" />
            ) : tool.id.includes('name-date') ? (
              <Calendar className="w-4 h-4 text-amber-400" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                tool.badge === 'NEW 2026'
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}>
                {tool.badge}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
              {tool.sizeBadge}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors leading-snug">
          {tool.title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 group-hover:text-emerald-400 pt-2 border-t border-zinc-900 transition-colors">
        <span>Open Tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
