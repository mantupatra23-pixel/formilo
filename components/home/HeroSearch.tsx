'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Zap, ArrowRight, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { getAllTools, getRegistryStats, ToolItem } from '@/lib/toolsData';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const allTools = useRef<ToolItem[]>([]);
  const stats = getRegistryStats();

  useEffect(() => {
    allTools.current = getAllTools();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    const clean = text.toLowerCase().trim();
    if (!clean) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = allTools.current.filter((tool) => {
      const matchTitle = tool.title.toLowerCase().includes(clean);
      const matchDesc = tool.description.toLowerCase().includes(clean);
      const matchExam = tool.exam?.toLowerCase().includes(clean);
      const matchBadge = tool.badge?.toLowerCase().includes(clean);
      return matchTitle || matchDesc || matchExam || matchBadge;
    }).slice(0, 8);

    setResults(filtered);
    setIsOpen(true);
  };

  const quickChips = [
    { label: 'Photo < 20 KB', href: '/photo-resizer-20kb' },
    { label: 'Photo < 50 KB', href: '/photo-resizer-50kb' },
    { label: 'Signature < 20 KB', href: '/exam/signature-resize-to-20kb' },
    { label: 'SSC CGL Photo', href: '/exam/ssc-cgl-passport-size-photo-resizer' },
    { label: 'NEET 4×6 Photo', href: '/exam/nta-neet-ug-postcard-size-photo-4x6-resizer' },
    { label: 'JPG to PDF', href: '/jpg-to-pdf-converter' },
    { label: 'Clean Signature', href: '/tools/make-background-white-of-signature' },
  ];

  return (
    <section className="w-full pt-6 sm:pt-10 pb-4 text-center space-y-5">
      
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE2DF] shadow-card text-[#162630] text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-[#00C98B] animate-pulse"></span>
        <span>⚡ 100% Free & Privacy-Focused • <strong>{stats.totalDisplay}</strong> Form Tools</span>
      </div>

      {/* Main H1 Headline */}
      <div className="space-y-2 max-w-3xl mx-auto px-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#162630] tracking-tight leading-[1.15]">
          Government Form Photos, Signatures & PDFs{' '}
          <span className="bg-gradient-to-r from-[#00C98B] to-[#00C7D9] bg-clip-text text-transparent">
            Ready in Seconds
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#65737A] leading-relaxed max-w-2xl mx-auto">
          Resize, compress, and format photos, signatures, and PDF documents to exact KB limits, dimensions, and specifications for online recruitment and entrance applications.
        </p>
      </div>

      {/* Hero Instant Search Bar */}
      <div className="max-w-2xl mx-auto relative px-2">
        <div className="relative flex items-center bg-white border border-[#DDE2DF] focus-within:border-[#00C98B] focus-within:ring-2 focus-within:ring-[#00C98B]/20 rounded-2xl shadow-card transition-all">
          <Search className="w-5 h-5 text-[#89959A] ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query && setIsOpen(true)}
            placeholder={`Search across ${stats.totalDisplay} Form Tools (e.g. SSC, 20 KB Photo, Signature, PDF...)`}
            className="w-full py-3.5 sm:py-4 px-3 text-xs sm:text-sm text-[#162630] bg-transparent focus:outline-none placeholder-[#89959A]"
          />
          {query ? (
            <button
              onClick={() => handleSearch('')}
              className="p-2 mr-2 text-[#89959A] hover:text-[#162630] transition"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block mr-4 px-2 py-0.5 text-[11px] font-mono text-[#89959A] bg-[#F7F7F3] border border-[#DDE2DF] rounded-md">
              /
            </kbd>
          )}
        </div>

        {/* Live Search Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-2 right-2 mt-2 bg-white border border-[#DDE2DF] rounded-2xl shadow-modal z-50 overflow-hidden text-left divide-y divide-[#E8EBE9] animate-in fade-in-50">
            <div className="p-2.5 bg-[#F7F7F3] text-[11px] font-bold text-[#65737A] uppercase tracking-wider flex justify-between">
              <span>Matching Tools ({results.length})</span>
              <span className="text-[#00C98B]">Instant Access</span>
            </div>
            {results.map((tool) => (
              <Link
                key={tool.id}
                href={tool.slug.startsWith('/') ? tool.slug : `/${tool.slug}`}
                onClick={() => setIsOpen(false)}
                className="p-3.5 hover:bg-[#F7F7F3] flex items-center justify-between gap-3 transition group block"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#162630] group-hover:text-[#00C98B] transition-colors truncate">
                      {tool.title}
                    </span>
                    {tool.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#00C98B]/10 text-[#00a874] border border-[#00C98B]/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#65737A] truncate">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#89959A] group-hover:text-[#00C98B] group-hover:translate-x-1 transition shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap px-2 pt-1">
        <span className="text-[11px] font-semibold text-[#89959A] mr-1 hidden sm:inline">Quick Shortcuts:</span>
        {quickChips.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className="px-3 py-1 rounded-full bg-white border border-[#DDE2DF] hover:border-[#00C98B] hover:text-[#00C98B] text-xs font-semibold text-[#65737A] shadow-sm transition"
          >
            {chip.label}
          </Link>
        ))}
      </div>

    </section>
  );
}
