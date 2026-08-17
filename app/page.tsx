'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Zap, ShieldCheck, ArrowRight, Search, 
  FileText, Image as ImageIcon, Smartphone, 
  Flame, Briefcase, RefreshCw, Layers
} from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Search Filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter((tool) => {
      const q = searchQuery.toLowerCase();
      return (
        tool.enabled && (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(q)))
        )
      );
    });
  }, [searchQuery]);

  // Curated Categories for Clean UI
  const popularTools = TOOLS.filter(t => ['photo-resize-20kb', 'photo-resize-50kb', 'signature-resize-20kb', 'jpg-to-pdf', 'image-compressor', 'passport-photo-resizer'].includes(t.slug));
  
  const pdfTools = TOOLS.filter(t => t.category === 'pdf').slice(0, 6);
  
  const converterTools = TOOLS.filter(t => t.badge === 'Converter').slice(0, 6);
  
  const examTools = TOOLS.filter(t => t.badge === 'Exam Preset');
  const topExamTools = examTools.slice(0, 6);
  const restExamTools = examTools.slice(6);

  const kbTools = TOOLS.filter(t => t.name.startsWith('Photo Resize to') && !['photo-resize-20kb', 'photo-resize-50kb'].includes(t.slug));

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide">
          <Zap className="w-3.5 h-3.5" /> 100% Client-Side Engine • Zero Server Uploads
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Free Online Tools for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500">
            Photos, Signatures & PDFs
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
          Resize exam photos, format signatures, compress files, and convert documents instantly inside your browser memory.
        </p>

        {/* Live Search */}
        <div className="max-w-2xl mx-auto pt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a tool (e.g., 20kb photo, SSC signature, JPG to PDF)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-zinc-500 text-sm outline-none transition shadow-xl"
          />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        
        {/* Search Results Display */}
        {searchQuery.trim() !== '' ? (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" /> Search Results ({searchResults.length})
            </h2>
            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                No tools found for "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            )}
          </section>
        ) : (
          /* Curated Layout View */
          <>
            {/* 1. Most Popular Tools */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-400" /> Essential Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>

            {/* 2. PDF Suite */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> PDF Toolkit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pdfTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>

            {/* 3. Image Converters */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" /> Image Converters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {converterTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </section>

            {/* 4. Exam Presets (Mixed Cards + Chips) */}
            <section className="space-y-4 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <div className="flex flex-col space-y-1 mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" /> Government Exam Presets
                </h2>
                <p className="text-xs text-zinc-400">One-click standard dimension & size locks for official portals.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topExamTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800 flex flex-wrap gap-2">
                {restExamTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-medium text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </section>

            {/* 5. Quick Exact Size Links (Chips) */}
            <section className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Exact File Size Resizers
              </h2>
              <div className="flex flex-wrap gap-2">
                {kbTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 transition"
                  >
                    {tool.targetKB && tool.targetKB < 1000 ? `${tool.targetKB} KB` : 'Custom Size'}
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Features Section */}
        <section className="pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Instant Processing</h3>
            <p className="text-xs text-zinc-400">Everything runs directly in your browser memory. No queue.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Private</h3>
            <p className="text-xs text-zinc-400">Documents and photos are never uploaded to our servers.</p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Mobile Ready</h3>
            <p className="text-xs text-zinc-400">Perfectly optimized for seamless use on smartphones.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

// Compact Tool Card Component
function ToolCard({ tool }: { tool: any }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900/90 transition-all shadow-lg flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            {tool.category}
          </span>
          {tool.targetKB && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              &lt; {tool.targetKB} KB
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
          {tool.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDescription || tool.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 group-hover:text-emerald-300 transition-colors font-medium">
        <span>Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
