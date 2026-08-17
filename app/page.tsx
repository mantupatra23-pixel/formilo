'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, Search, 
  FileText, Image as ImageIcon, PenTool, Smartphone, 
  CheckCircle2, Flame, Layers
} from 'lucide-react';
import { TOOLS, ToolCategory } from '@/lib/tools';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter tools based on search query and category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.keywords && tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      return tool.enabled && matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return TOOLS.filter((t) => ['photo-resize-20kb', 'photo-resize-50kb', 'signature-resize-20kb', 'jpg-to-pdf', 'image-compressor', 'passport-photo-resizer'].includes(t.slug));
  }, []);

  const photoTools = useMemo(() => TOOLS.filter((t) => t.category === 'photo' && t.enabled), []);
  const pdfTools = useMemo(() => TOOLS.filter((t) => t.category === 'pdf' && t.enabled), []);
  const otherTools = useMemo(() => TOOLS.filter((t) => ['signature', 'image'].includes(t.category) && t.enabled), []);

  const quickPresets = [
    { label: 'SSC Photo (20-50 KB)', slug: 'photo-resize-20kb' },
    { label: 'Signature (< 20 KB)', slug: 'signature-resize-20kb' },
    { label: 'Passport (3.5x4.5 cm)', slug: 'passport-photo-resizer' },
    { label: 'JPG to PDF', slug: 'jpg-to-pdf' },
    { label: 'Compress PDF', slug: 'pdf-compressor' },
    { label: 'Photo < 100 KB', slug: 'photo-resize-100kb' }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* Mesh Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide shadow-inner">
          <Zap className="w-3.5 h-3.5" /> 100% Client-Side Engine • Zero Server Uploads • Instant Results
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Free Online Tools for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500">
            Photos, Signatures & PDFs
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
          Resize passport photos, format signatures under 20 KB, and merge multiple documents into PDF instantly inside your browser memory.
        </p>

        {/* Live Search & Quick Filter */}
        <div className="max-w-2xl mx-auto space-y-3 pt-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tool (e.g. 20 kb photo, ssc signature, jpg to pdf)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-zinc-500 text-sm outline-none transition shadow-xl"
            />
          </div>

          {/* Quick Presets Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-zinc-500 font-medium">Quick Presets:</span>
            {quickPresets.map((preset, idx) => (
              <Link
                key={idx}
                href={`/tools/${preset.slug}`}
                className="text-xs px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-emerald-500/60 hover:text-emerald-400 transition"
              >
                {preset.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-14">
        
        {/* If user is actively searching */}
        {searchQuery.trim() !== '' ? (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Search Results ({filteredTools.length})
            </h2>

            {filteredTools.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                No tools found for "{searchQuery}". Try searching "20 kb", "signature", or "pdf".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Category Tab Selector */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All Tools' },
                { id: 'photo', label: 'Photo Tools' },
                { id: 'pdf', label: 'PDF Tools' },
                { id: 'signature', label: 'Signature Tools' },
                { id: 'image', label: 'Image Tools' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/10'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Popular Tools Section */}
            {selectedCategory === 'all' && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400" /> Popular Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} isPopular />
                  ))}
                </div>
              </section>
            )}

            {/* Photo Tools Section */}
            {(selectedCategory === 'all' || selectedCategory === 'photo') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-400" /> Photo Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* PDF Tools Section */}
            {(selectedCategory === 'all' || selectedCategory === 'pdf') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" /> PDF Toolkit
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pdfTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Signature & Image Tools */}
            {(selectedCategory === 'all' || selectedCategory === 'signature' || selectedCategory === 'image') && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-emerald-400" /> Image & Signature Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Why Formilo Feature Cards */}
        <section className="pt-8 border-t border-zinc-800/80">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-white">Why Use Formilo?</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Engineered for speed, strict client-side security, and effortless form submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Instant Client Processing</h3>
              <p className="text-xs text-zinc-400">
                Binary search compression runs directly in your browser memory with zero waiting queue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Private & Secure</h3>
              <p className="text-xs text-zinc-400">
                Your private certificates, signatures, and photos are never uploaded or stored on any server.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Mobile Optimized</h3>
              <p className="text-xs text-zinc-400">
                Built specifically for seamless photo and PDF preparation on mobile screens and Android devices.
              </p>
            </div>
          </div>
        </section>

        {/* Global FAQ */}
        <section className="p-6 sm:p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <h3 className="text-sm font-bold text-white">Is Formilo completely free?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes, all compression, resizing, and PDF conversion tools are free with no watermarks or registration required.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <h3 className="text-sm font-bold text-white">Are my uploaded documents safe?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes, everything runs in your local browser using HTML5 Canvas and WASM APIs. No file ever leaves your device.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950 py-10 px-4 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wider text-sm">FORMILO</span>
            <span>• Free Tools. Instant Results.</span>
          </div>
          <p>© 2026 Formilo. All rights reserved. 100% Client-Side Secure.</p>
        </div>
      </footer>
    </div>
  );
}

// Sub-component for individual Tool Card
function ToolCard({ tool, isPopular }: { tool: any; isPopular?: boolean }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-900/90 transition-all duration-200 shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            {tool.category}
          </span>
          {tool.targetKB && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              &lt; {tool.targetKB} KB
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white mt-3.5 group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
          {tool.shortDescription || tool.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400 group-hover:text-emerald-300 transition-colors">
        <span className="font-medium">Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
