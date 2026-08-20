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
  GraduationCap, 
  Image as ImageIcon, 
  PenTool, 
  Layers, 
  Flame, 
  Calendar, 
  SlidersHorizontal, 
  RefreshCw, 
  X, 
  Fingerprint
} from 'lucide-react';

export interface UnifiedTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'photo' | 'signature' | 'pdf' | 'converter' | 'exam';
  badge: string;
  targetKB?: number;
  dimensions?: string;
  isPopular?: boolean;
}

// 1. Core High-Demand Utilities & Dedicated KB Tools
const CORE_TOOLS: UnifiedTool[] = [
  {
    id: 'name-date-photo-generator',
    slug: '/name-date-on-photo',
    name: 'Name & Date on Photo (DOP / DOB) Generator',
    description: 'Add candidate name and photo date strip on passport photo strictly under 50 KB for SSC, RRB & Police forms.',
    category: 'photo',
    badge: 'NEW 2026',
    targetKB: 50,
    dimensions: '350 × 450 px',
    isPopular: true,
  },
  {
    id: 'photo-resizer-20kb-dedicated',
    slug: '/photo-resizer-20kb',
    name: 'Photo Resizer Under 20 KB',
    description: 'Compress and resize passport photos strictly under 20 KB for strict recruitment portals with zero blur.',
    category: 'photo',
    badge: '< 20 KB',
    targetKB: 20,
    dimensions: 'Aspect-Safe',
    isPopular: true,
  },
  {
    id: 'photo-resizer-30kb-dedicated',
    slug: '/photo-resizer-30kb',
    name: 'Photo Resizer Under 30 KB',
    description: 'Resize photos and official certificate crops under 30 KB for banking and state portal verification.',
    category: 'photo',
    badge: '< 30 KB',
    targetKB: 30,
    dimensions: 'Aspect-Safe',
    isPopular: true,
  },
  {
    id: 'photo-resizer-50kb-dedicated',
    slug: '/photo-resizer-50kb',
    name: 'Photo Resizer Under 50 KB',
    description: 'Universal government exam photo compressor for SSC, UPSC, and Railway forms under 50 KB.',
    category: 'photo',
    badge: '< 50 KB',
    targetKB: 50,
    dimensions: 'Aspect-Safe',
    isPopular: true,
  },
  {
    id: 'photo-resizer-100kb-dedicated',
    slug: '/photo-resizer-100kb',
    name: 'Photo Resizer Under 100 KB',
    description: 'High-resolution photo and handwritten declaration compressor under 100 KB.',
    category: 'photo',
    badge: '< 100 KB',
    targetKB: 100,
    dimensions: 'Aspect-Safe',
    isPopular: false,
  },
  {
    id: 'photo-resizer-150kb-dedicated',
    slug: '/photo-resizer-150kb',
    name: 'Photo Resizer Under 150 KB',
    description: 'Entrance examination and NTA candidate photo resizer under 150 KB.',
    category: 'photo',
    badge: '< 150 KB',
    targetKB: 150,
    dimensions: 'Aspect-Safe',
    isPopular: false,
  },
  {
    id: 'photo-resizer-200kb-dedicated',
    slug: '/photo-resizer-200kb',
    name: 'Photo Resizer Under 200 KB',
    description: 'Compress 4x6 postcard photos and full-page documents strictly under 200 KB.',
    category: 'photo',
    badge: '< 200 KB',
    targetKB: 200,
    dimensions: '480 × 720 px',
    isPopular: false,
  },
  {
    id: 'pan-card-photo-resizer',
    slug: '/exam/pan-card-photo-resizer',
    name: 'PAN Card Photo Resizer (213 x 213 px)',
    description: 'Resize passport photo to exact 213x213 px and 300 DPI for NSDL and UTIITSL online portal forms.',
    category: 'exam',
    badge: 'PAN NSDL',
    targetKB: 50,
    dimensions: '213 × 213 px',
    isPopular: true,
  },
  {
    id: 'pan-card-signature-resizer',
    slug: '/exam/pan-card-signature-resizer',
    name: 'PAN Card Signature Resizer (400 x 200 px)',
    description: 'Compress signature to exact 400x200 px, 300 DPI and under 30 KB with sharp black & white contrast.',
    category: 'signature',
    badge: 'PAN NSDL',
    targetKB: 30,
    dimensions: '400 × 200 px',
    isPopular: true,
  },
  {
    id: 'signature-resize-to-20kb',
    slug: '/exam/signature-resize-to-20kb',
    name: 'Signature Resize to 20 KB',
    description: 'Resize scanned signature photos strictly under 20 KB with sharp contrast on clean white background.',
    category: 'signature',
    badge: 'POPULAR',
    targetKB: 20,
    dimensions: '280 × 120 px',
    isPopular: true,
  },
  {
    id: 'nielit-ccc-exam-photo-sign',
    slug: '/exam/nielit-ccc-exam-photo-and-sign-resizer',
    name: 'NIELIT CCC Exam Photo & Sign Resizer',
    description: 'Format CCC form photos to 132x170 px and signature to 170x132 px (10 KB – 20 KB).',
    category: 'exam',
    badge: 'NIELIT',
    targetKB: 20,
    dimensions: '132 × 170 px',
    isPopular: true,
  },
  {
    id: 'online-watermark-stamp-remover',
    slug: '/exam/photo-watermark-remover',
    name: 'Online Watermark & Stamp Remover',
    description: 'Erase unwanted watermarks, dates, stamps, and text from photos using browser inpainting technology.',
    category: 'converter',
    badge: 'SMART TOOL',
    targetKB: 100,
    dimensions: 'Auto Clean',
    isPopular: true,
  },
  {
    id: 'jpg-to-pdf-converter',
    slug: '/tools/jpg-to-pdf-converter',
    name: 'JPG to PDF Converter',
    description: 'Combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    category: 'pdf',
    badge: 'PRO',
    targetKB: 500,
    dimensions: 'Multi-Page A4',
    isPopular: true,
  },
  {
    id: 'pdf-to-jpg-converter',
    slug: '/tools/pdf-to-jpg-converter',
    name: 'PDF to JPG Converter',
    description: 'Extract PDF document pages into high-resolution JPG images directly inside browser RAM.',
    category: 'converter',
    badge: 'FAST',
    dimensions: '300 DPI HD',
    isPopular: true,
  },
  {
    id: 'pdf-compressor-under-200kb',
    slug: '/tools/pdf-compressor-under-200kb',
    name: 'PDF Compressor (< 200 KB)',
    description: 'Compress large PDF certificates, marksheets, and caste documents strictly under 200 KB.',
    category: 'pdf',
    badge: 'SAFE',
    targetKB: 200,
    dimensions: 'Document Safe',
    isPopular: true,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Automatic Unique Matrix Engine (Zero Hardcoding)
  const allTools = useMemo<UnifiedTool[]>(() => {
    const toolMap = new Map<string, UnifiedTool>();

    // 1. Add Core tools
    CORE_TOOLS.forEach((tool) => {
      toolMap.set(tool.slug.toLowerCase().trim(), tool);
    });

    // 2. Track Base Exams to prevent duplicates
    const seenExamBases = new Set<string>();
    const rawList = Array.isArray(examToolsData) ? examToolsData : [];

    rawList.forEach((item: any) => {
      const rawSlug = String(item.slug || '').toLowerCase().trim();
      const baseSlug = rawSlug
        .replace(/-(passport-size-photo-resizer|passport-photo|photo-resizer|photo|signature-crop-compress|signature-resizer|signature|sign|left-thumb-impression-resizer|thumb-impression|thumb|postcard-size-photo-4x6-resizer|postcard-size-photo|postcard|under-20kb|under-50kb|20kb|50kb|resizer)$/gi, '')
        .trim();

      if (!baseSlug || seenExamBases.has(baseSlug)) {
        return;
      }
      seenExamBases.add(baseSlug);

      const rawTitle = String(item.title || item.name || '')
        .replace(/(Passport Size Photo|Photo|Signature|Left Thumb|Postcard Size Photo).*/i, '')
        .trim();
      const examTitle = rawTitle || baseSlug.replace(/-/g, ' ').toUpperCase();
      const board = item.badge || item.board || 'EXAM';

      const formatVariants = [
        {
          suffix: 'passport-size-photo-resizer',
          name: `${examTitle} Passport Size Photo Resizer`,
          desc: `Free online passport size photo resizer for ${examTitle}. Compress strictly between 20 KB to 50 KB (350x450 px).`,
          cat: 'exam' as const,
          badge: board,
          kb: 50,
          dim: '350 × 450 px',
        },
        {
          suffix: 'signature-crop-compress',
          name: `${examTitle} Signature Crop & Compress`,
          desc: `Free online signature crop & compress under 20 KB for ${examTitle}. Crop signature on clean white background.`,
          cat: 'signature' as const,
          badge: 'SIGN',
          kb: 20,
          dim: '280 × 120 px',
        },
        {
          suffix: 'left-thumb-impression-resizer',
          name: `${examTitle} Left Thumb Impression Resizer`,
          desc: `Format candidate thumb print impression to blue/black ink under 20 KB for ${examTitle}.`,
          cat: 'signature' as const,
          badge: 'THUMB',
          kb: 20,
          dim: '240 × 240 px',
        },
        {
          suffix: 'postcard-size-photo-4x6-resizer',
          name: `${examTitle} Postcard Size Photo (4x6 Inch) Resizer`,
          desc: `Resize full postcard size 4x6 photograph with white background under 200 KB for ${examTitle}.`,
          cat: 'photo' as const,
          badge: '< 200 KB',
          kb: 200,
          dim: '480 × 720 px',
        },
      ];

      formatVariants.forEach((v) => {
        const fullSlug = `/exam/${baseSlug}-${v.suffix}`;
        if (!toolMap.has(fullSlug)) {
          toolMap.set(fullSlug, {
            id: `${baseSlug}-${v.suffix}`,
            slug: fullSlug,
            name: v.name,
            description: v.desc,
            category: v.cat,
            badge: v.badge,
            targetKB: v.kb,
            dimensions: v.dim,
            isPopular: false,
          });
        }
      });
    });

    return Array.from(toolMap.values());
  }, []);

  // Real-Time Dynamic Counts
  const totalCount = allTools.length;
  const examCount = allTools.filter((t) => t.category === 'exam').length;
  const photoCount = allTools.filter((t) => t.category === 'photo').length;
  const signatureCount = allTools.filter((t) => t.category === 'signature').length;
  const pdfCount = allTools.filter((t) => t.category === 'pdf').length;
  const converterCount = allTools.filter((t) => t.category === 'converter').length;

  // Filter Logic
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allTools.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q) ||
        (tool.dimensions && tool.dimensions.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'exam') return tool.category === 'exam';
      if (selectedCategory === 'photo') return tool.category === 'photo';
      if (selectedCategory === 'signature') return tool.category === 'signature';
      if (selectedCategory === 'pdf') return tool.category === 'pdf';
      if (selectedCategory === 'converter') return tool.category === 'converter';

      return true;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return CORE_TOOLS.filter((t) => t.isPopular);
  }, []);

  const quickPresets = [
    { label: '⚡ Photo < 20 KB', query: '20 KB', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { label: '✍️ Signature < 20 KB', query: 'Signature', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
    { label: '📅 Name & Date (DOP)', query: 'Name Date', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { label: '🪪 PAN Card 213x213', query: 'PAN', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { label: '📄 JPG to PDF', query: 'PDF', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
    { label: '📦 Compress 50 KB', query: '50 KB', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Client-Side Engine &bull; {totalCount}+ Dynamic Online Tools &bull; Zero Server Upload</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Every Online Form File, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Resized &amp; Formatted in Seconds
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Instant government exam presets, exact KB size reducers, Name &amp; Date generators, watermark removers, and multi-page PDF conversion tools.
        </p>

        {/* Dynamic Search Bar */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search across ${totalCount} verified tools (e.g. Name Date, PAN, SSC, 20 KB photo, UPSC)...`}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-zinc-900/90 border-2 border-zinc-800 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 text-white placeholder-zinc-500 text-sm font-medium outline-none transition shadow-2xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSearchQuery(preset.query)}
                className={`text-xs px-3 py-1 rounded-xl border font-semibold transition-all hover:scale-105 cursor-pointer ${preset.color}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cyber Cafe Quick Desk Banner */}
      <section className="max-w-6xl mx-auto px-4 my-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0d0e] border border-zinc-800/90 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
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
                type="button"
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
            <Link href="/exam/ssc-cgl-2026-passport-size-photo-resizer" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              SSC CGL Photo &rarr;
            </Link>
            <Link href="/name-date-on-photo" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80 text-amber-300">
              Name &amp; Date Photo &rarr;
            </Link>
            <Link href="/exam/pan-card-photo-resizer" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              PAN NSDL Photo &rarr;
            </Link>
            <Link href="/exam/rrb-ntpc-2026-passport-size-photo-resizer" className="px-2.5 py-1 rounded-md bg-zinc-900/80 hover:text-emerald-400 border border-zinc-800/80">
              Railway NTPC &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 📸 Dedicated Photo Size & KB Tools Section */}
      <section className="max-w-6xl mx-auto px-4 my-8 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            📸 Photo Size &amp; KB Tools
          </h2>
          <span className="text-xs text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono">
            6 Preset Sizes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { kb: 20, label: '20 KB', title: 'Photo Resizer', slug: '/photo-resizer-20kb', desc: 'Strict SSC & Police' },
            { kb: 30, label: '30 KB', title: 'Photo Resizer', slug: '/photo-resizer-30kb', desc: 'Bank & State PSC' },
            { kb: 50, label: '50 KB', title: 'Photo Resizer', slug: '/photo-resizer-50kb', desc: 'Universal Standard' },
            { kb: 100, label: '100 KB', title: 'Photo Resizer', slug: '/photo-resizer-100kb', desc: 'High-Res Docs' },
            { kb: 150, label: '150 KB', title: 'Photo Resizer', slug: '/photo-resizer-150kb', desc: 'JEE, NEET & NTA' },
            { kb: 200, label: '200 KB', title: 'Photo Resizer', slug: '/photo-resizer-200kb', desc: '4x6 Postcard Photo' },
          ].map((tool) => (
            <Link
              key={tool.kb}
              href={tool.slug}
              className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group text-center"
            >
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-black font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {tool.label}
                </span>
                <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors pt-1">
                  {tool.title}
                </h3>
                <p className="text-[10px] text-zinc-500 line-clamp-1">{tool.desc}</p>
              </div>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Open &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dynamic Calculated Category Switcher Tabs */}
      <section className="max-w-6xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: '🔥 All Tools', count: totalCount },
            { id: 'exam', label: '🪪 Exam Presets', count: examCount },
            { id: 'photo', label: '📸 Photo Resizers', count: photoCount },
            { id: 'signature', label: '✍️ Signatures', count: signatureCount },
            { id: 'pdf', label: '📄 PDF Suite', count: pdfCount },
            { id: 'converter', label: '🔄 Converters', count: converterCount },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSearchQuery('');
              }}
              className={`text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
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

      {/* Main Grid Section */}
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-10">
        {searchQuery.trim() !== '' ? (
          <section className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Search Results ({filteredTools.length})
            </h2>

            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                No tools found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredTools.map((tool) => (
                  <UnifiedToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Featured Section */}
            {selectedCategory === 'all' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400 fill-emerald-400" /> 
                    Featured &amp; Most Used Tools
                  </h2>
                  <span className="text-xs text-emerald-400 font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    Top 10
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {popularTools.map((tool) => (
                    <UnifiedToolCard key={`featured-${tool.slug}`} tool={tool} isFeatured />
                  ))}
                </div>
              </section>
            )}

            {/* Format-Wise Tools Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  {selectedCategory === 'all' ? 'All Verified Formilo Tools' : `${selectedCategory.toUpperCase()} Tools`}
                </h2>
                <span className="text-xs text-zinc-400 font-mono">
                  {filteredTools.length} Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredTools.map((tool) => (
                  <UnifiedToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          </>
        )}

        <TelegramBanner />
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
          accentBar: 'bg-amber-500',
        };
      case 'pdf':
        return {
          cardBorder: 'hover:border-rose-500/70 hover:shadow-rose-500/10',
          iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
          icon: <FileText className="w-5 h-5" />,
          badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
          titleHover: 'group-hover:text-rose-300',
          btnText: 'text-rose-400',
          accentBar: 'bg-rose-500',
        };
      case 'signature':
        return {
          cardBorder: 'hover:border-cyan-500/70 hover:shadow-cyan-500/10',
          iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
          icon: tool.badge === 'THUMB' ? <Fingerprint className="w-5 h-5" /> : <PenTool className="w-5 h-5" />,
          badge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40',
          titleHover: 'group-hover:text-cyan-300',
          btnText: 'text-cyan-400',
          accentBar: 'bg-cyan-500',
        };
      case 'converter':
        return {
          cardBorder: 'hover:border-violet-500/70 hover:shadow-violet-500/10',
          iconBg: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
          icon: <RefreshCw className="w-5 h-5" />,
          badge: 'bg-violet-500/15 text-violet-300 border border-violet-500/40',
          titleHover: 'group-hover:text-violet-300',
          btnText: 'text-violet-400',
          accentBar: 'bg-violet-500',
        };
      case 'photo':
      default:
        return {
          cardBorder: 'hover:border-emerald-500/70 hover:shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
          icon: tool.id.includes('name-date') ? <Calendar className="w-5 h-5 text-amber-400" /> : <ImageIcon className="w-5 h-5" />,
          badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
          titleHover: 'group-hover:text-emerald-300',
          btnText: 'text-emerald-400',
          accentBar: 'bg-emerald-500',
        };
    }
  };

  const theme = getTheme();

  return (
    <Link
      href={tool.slug}
      className={`group relative p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden ${theme.cardBorder}`}
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
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-zinc-900 text-white border border-zinc-800">
                &lt; {tool.targetKB >= 1000 ? `${tool.targetKB / 1000} MB` : `${tool.targetKB} KB`}
              </span>
            )}
          </div>
        </div>

        <h3 className={`text-base font-bold text-white mt-4 leading-snug transition-colors line-clamp-1 ${theme.titleHover}`}>
          {tool.name}
        </h3>

        <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {tool.description}
        </p>

        {tool.dimensions && (
          <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 px-2 py-0.5 rounded-md bg-black border border-zinc-800">
            <span>Dimensions: {tool.dimensions}</span>
          </div>
        )}
      </div>

      <div className={`mt-5 pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-bold ${theme.btnText}`}>
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
      </div>
    </Link>
  );
}
