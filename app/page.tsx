'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, 
  X, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  UploadCloud, 
  GraduationCap, 
  FileText, 
  Image as ImageIcon, 
  PenTool, 
  RefreshCw, 
  Calendar, 
  Fingerprint, 
  SlidersHorizontal, 
  Flame, 
  Lock, 
  Layers 
} from 'lucide-react';
import { getAllTools, getRegistryStats, ToolItem } from '@/lib/toolsData';
import { examsData } from '@/data/exams';

interface ExamRule {
  name: string;
  maxKB: number;
  minKB: number;
  reqWidth: number;
  reqHeight: number;
  fixUrl: string;
}

const CHECKER_RULES: Record<string, ExamRule> = {
  'ssc-photo': { name: 'SSC Photo (CGL/CHSL/GD)', maxKB: 50, minKB: 20, reqWidth: 350, reqHeight: 450, fixUrl: '/photo-resizer-50kb' },
  'ssc-sign': { name: 'SSC Signature', maxKB: 20, minKB: 10, reqWidth: 280, reqHeight: 120, fixUrl: '/exam/signature-resize-to-20kb' },
  'rrb-photo': { name: 'Railway RRB Photo', maxKB: 50, minKB: 20, reqWidth: 350, reqHeight: 450, fixUrl: '/photo-resizer-50kb' },
  'neet-postcard': { name: 'NEET Postcard Photo (4x6)', maxKB: 200, minKB: 50, reqWidth: 480, reqHeight: 720, fixUrl: '/photo-resizer-200kb' },
  'pan-photo': { name: 'PAN Card Photo (213x213 px)', maxKB: 50, minKB: 10, reqWidth: 213, reqHeight: 213, fixUrl: '/exam/pan-card-photo-resizer' },
  'pan-sign': { name: 'PAN Card Signature (400x200 px)', maxKB: 30, minKB: 5, reqWidth: 400, reqHeight: 200, fixUrl: '/exam/pan-card-signature-resizer' },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'photo' | 'signature' | 'pdf' | 'exam'>('all');
  const [selectedCheckerKey, setSelectedCheckerKey] = useState('ssc-photo');
  const [checkerFile, setCheckerFile] = useState<{
    name: string;
    sizeKB: number;
    width: number;
    height: number;
    format: string;
  } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const checkerInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Registry Integration
  const allTools = useMemo(() => getAllTools(), []);
  const stats = useMemo(() => getRegistryStats(), []);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Tools
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allTools.filter((tool) => {
      const matchesQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.exam && tool.exam.toLowerCase().includes(q)) ||
        (tool.badge && tool.badge.toLowerCase().includes(q));

      if (!matchesQuery) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'exam') return tool.slug.startsWith('exam/');
      return tool.category === selectedCategory;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return allTools.filter((t) => t.popular);
  }, [allTools]);

  // Checker Validation Logic
  const activeRule = CHECKER_RULES[selectedCheckerKey];
  const isSizeValid = checkerFile ? checkerFile.sizeKB >= activeRule.minKB && checkerFile.sizeKB <= activeRule.maxKB : false;
  const isReady = checkerFile && isSizeValid;

  const handleCheckerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      setCheckerFile({
        name: file.name,
        sizeKB: Math.round(file.size / 1024),
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.replace('image/', '').toUpperCase() || 'JPG',
      });
    };
  };

  const quickPresets = [
    { label: 'Photo < 20 KB', query: '20 KB' },
    { label: 'Photo < 50 KB', query: '50 KB' },
    { label: 'Signature < 20 KB', query: 'Signature' },
    { label: 'Name & Date (DOP)', query: 'Name & Date' },
    { label: 'PAN Card 213x213', query: 'PAN Card' },
    { label: 'JPG to PDF', query: 'JPG to PDF' },
    { label: 'PDF Compressor', query: 'PDF Compressor' },
  ];

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-10">

        {/* 1. HERO & INSTANT SEARCH */}
        <section className="text-center space-y-5 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE2DF] shadow-sm text-[#162630] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00C98B] animate-pulse"></span>
            <span>⚡ 100% Free &amp; Privacy-Focused • <strong>{stats.totalDisplay}</strong> Form Tools</span>
          </div>

          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#162630] tracking-tight leading-[1.15]">
              Government Form Photos, Signatures &amp; PDFs{' '}
              <span className="bg-gradient-to-r from-[#00C98B] to-[#00C7D9] bg-clip-text text-transparent">
                Ready in Seconds
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#65737A] leading-relaxed max-w-2xl mx-auto">
              Resize, compress, and format photos, signatures, and PDF documents to the required KB, dimensions, and formats for online applications and government recruitment forms.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative px-2">
            <div className="relative flex items-center bg-white border border-[#DDE2DF] focus-within:border-[#00C98B] focus-within:ring-2 focus-within:ring-[#00C98B]/20 rounded-2xl shadow-card transition-all">
              <Search className="w-5 h-5 text-[#89959A] ml-4 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search across ${stats.totalDisplay} Form Tools (e.g. SSC CGL, 20 KB Photo, Signature, PDF...)`}
                className="w-full py-3.5 sm:py-4 px-3 text-xs sm:text-sm text-[#162630] bg-transparent focus:outline-none placeholder-[#89959A]"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
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

            {/* Quick Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3">
              <span className="text-[11px] font-semibold text-[#89959A] mr-1 hidden sm:inline">Quick:</span>
              {quickPresets.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(chip.query)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition shadow-sm ${
                    searchQuery === chip.query
                      ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white border-transparent'
                      : 'bg-white border-[#DDE2DF] text-[#65737A] hover:border-[#00C98B] hover:text-[#00C98B]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. CYBER CAFE & CSC CENTER WORKSPACE */}
        <section className="bg-white border border-[#DDE2DF] rounded-card p-5 sm:p-7 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00C98B]/10 text-[#00a874] border border-[#00C98B]/20 text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#00C98B]" />
              <span>CYBER CAFE &amp; CSC CENTER WORKSPACE</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-[#162630] tracking-tight">
              Fast Form Document Formatting for Cyber Cafes
            </h2>

            <p className="text-xs text-[#65737A] leading-relaxed">
              Prepare candidate photos, signatures, handwritten declarations, and marksheets quickly from one high-speed browser-based workspace.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/exam/ssc-cgl-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
                SSC CGL Photo &rarr;
              </Link>
              <Link href="/name-date-on-photo" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
                Name &amp; Date DOP &rarr;
              </Link>
              <Link href="/exam/pan-card-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
                PAN 213×213 px &rarr;
              </Link>
              <Link href="/exam/rrb-ntpc-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] text-[11px] font-semibold border border-[#DDE2DF] transition">
                Railway NTPC &rarr;
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/cyber-cafe"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-xs sm:text-sm text-center shadow-md shadow-[#00C98B]/20 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <span>Open Cyber Cafe Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => { setSelectedCategory('exam'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#162630] font-bold text-xs text-center border border-[#DDE2DF] transition cursor-pointer"
            >
              View Exam Presets
            </button>
          </div>
        </section>

        {/* 3. DEDICATED PHOTO SIZE & KB TOOLS ROW */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00C98B]" />
              <h2 className="text-lg font-extrabold text-[#162630]">
                📸 Photo Size &amp; KB Tools
              </h2>
            </div>
            <span className="text-xs text-[#00a874] font-bold px-2.5 py-0.5 rounded-lg bg-[#00C98B]/10 border border-[#00C98B]/20 font-mono">
              6 Preset Sizes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { kb: 20, label: '< 20 KB', title: 'Photo Resizer', slug: '/photo-resizer-20kb', desc: 'Strict SSC & Police' },
              { kb: 30, label: '< 30 KB', title: 'Photo Resizer', slug: '/photo-resizer-30kb', desc: 'Bank & State PSC' },
              { kb: 50, label: '< 50 KB', title: 'Photo Resizer', slug: '/photo-resizer-50kb', desc: 'Universal Standard' },
              { kb: 100, label: '< 100 KB', title: 'Photo Resizer', slug: '/photo-resizer-100kb', desc: 'High-Res Docs' },
              { kb: 150, label: '< 150 KB', title: 'Photo Resizer', slug: '/photo-resizer-150kb', desc: 'JEE, NEET & NTA' },
              { kb: 200, label: '< 200 KB', title: 'Postcard Photo', slug: '/photo-resizer-200kb', desc: '4x6 Postcard (NEET)' },
            ].map((tool) => (
              <Link
                key={tool.kb}
                href={tool.slug}
                className="p-4 rounded-card bg-white border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition flex flex-col justify-between gap-3 text-center group"
              >
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-black font-mono bg-[#00C98B]/10 text-[#00a874] border border-[#00C98B]/25">
                    {tool.label}
                  </span>
                  <h3 className="text-xs font-bold text-[#162630] group-hover:text-[#00C98B] transition-colors pt-1">
                    {tool.title}
                  </h3>
                  <p className="text-[10px] text-[#65737A] line-clamp-1">{tool.desc}</p>
                </div>
                <span className="text-[11px] font-bold text-[#00C98B] flex items-center justify-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. DYNAMIC CATEGORY TABS & MAIN TOOLS GRID */}
        <section className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#DDE2DF]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: '🔥 All Tools', count: stats.total },
                { id: 'exam', label: '🪪 Exam Presets', count: examsData.length * 4 },
                { id: 'photo', label: '📸 Photo Resizers', count: stats.photoCount },
                { id: 'signature', label: '✍️ Signatures', count: stats.signatureCount },
                { id: 'pdf', label: '📄 PDF Suite', count: stats.pdfCount },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id as any); setSearchQuery(''); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white shadow-sm shadow-[#00C98B]/20'
                      : 'bg-white text-[#65737A] hover:text-[#162630] border border-[#DDE2DF]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-[#F7F7F3] text-[#89959A]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-[#89959A] font-mono">
              {filteredTools.length} Tools Available
            </span>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.slice(0, 15).map((tool) => {
              const href = tool.slug.startsWith('/') ? tool.slug : `/${tool.slug}`;
              return (
                <Link
                  key={tool.id}
                  href={href}
                  className="group bg-white rounded-card p-5 border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-4 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {tool.badge && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border ${
                          tool.popular ? 'bg-[#EBAA78]/15 text-[#c97b40] border-[#EBAA78]/35 font-bold' : 'bg-[#00C98B]/10 text-[#00a874] border-[#00C98B]/25'
                        }`}>
                          {tool.badge}
                        </span>
                      )}
                      {tool.targetKB && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border bg-[#F7F7F3] text-[#65737A] border-[#DDE2DF]">
                          &lt; {tool.targetKB} KB
                        </span>
                      )}
                    </div>
                    {tool.popular && (
                      <span className="text-[10px] font-bold text-[#c97b40] flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-[#EBAA78] text-[#EBAA78]" />
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-[#162630] group-hover:text-[#00C98B] transition-colors line-clamp-1">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#65737A] leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8EBE9] text-xs">
                    <span className="text-[11px] font-mono text-[#89959A]">
                      {tool.width && tool.height ? `${tool.width}×${tool.height} px` : 'Aspect-Safe'}
                    </span>
                    <span className="text-xs font-bold text-[#00C98B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredTools.length > 15 && (
            <div className="text-center pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#DDE2DF] hover:border-[#00C98B] text-xs font-bold text-[#162630] hover:text-[#00C98B] shadow-sm transition"
              >
                <span>Browse All {stats.totalDisplay} Tools &rarr;</span>
              </Link>
            </div>
          )}
        </section>

        {/* 5. EXAM FORM PRESETS */}
        <section id="exam-presets" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#162630] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00C98B]" />
                <span>🎓 Popular Exam Form Presets</span>
              </h2>
              <p className="text-xs text-[#65737A]">Standardized specifications for active recruitment portals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {examsData.slice(0, 6).map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}-passport-size-photo-resizer`}
                className="group bg-white rounded-card p-5 border border-[#DDE2DF] hover:border-[#00C98B] hover:shadow-card-hover transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F7F7F3] text-[#65737A] border border-[#DDE2DF]">
                    {exam.board}
                  </span>
                  <h3 className="font-bold text-sm text-[#162630] group-hover:text-[#00C98B] transition-colors">
                    {exam.title} Tools Suite
                  </h3>
                  <p className="text-xs text-[#65737A] line-clamp-2">
                    {exam.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E8EBE9] text-xs">
                  <span className="text-[11px] font-mono text-[#89959A]">Photo • Sign • Thumb</span>
                  <span className="text-xs font-bold text-[#00C98B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. FORM FILE CHECKER (IS YOUR FILE READY?) */}
        <section className="bg-white border border-[#DDE2DF] rounded-card p-5 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C98B]">
              <CheckCircle2 className="w-4 h-4" />
              <span>INSTANT REQUIREMENT VALIDATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#162630] tracking-tight">
              Is Your Form File Ready?
            </h2>
            <p className="text-xs sm:text-sm text-[#65737A]">
              Select your exam and upload your candidate photo or signature to verify size and format requirements before final submission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-bold text-[#162630] shrink-0">Select Target Form Requirement:</label>
            <select
              value={selectedCheckerKey}
              onChange={(e) => setSelectedCheckerKey(e.target.value)}
              className="w-full sm:w-auto flex-1 bg-[#F7F7F3] border border-[#DDE2DF] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#162630] focus:outline-none focus:border-[#00C98B]"
            >
              {Object.entries(CHECKER_RULES).map(([key, rule]) => (
                <option key={key} value={key}>
                  {rule.name} (Limit: {rule.minKB}–{rule.maxKB} KB)
                </option>
              ))}
            </select>
          </div>

          <input
            type="file"
            ref={checkerInputRef}
            accept="image/*"
            onChange={handleCheckerUpload}
            className="hidden"
          />

          {!checkerFile ? (
            <div
              onClick={() => checkerInputRef.current?.click()}
              className="border-2 border-dashed border-[#DDE2DF] hover:border-[#00C98B] rounded-2xl p-6 sm:p-8 text-center bg-[#F7F7F3] cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
            >
              <UploadCloud className="w-10 h-10 text-[#89959A] group-hover:text-[#00C98B] transition-colors" />
              <p className="text-xs sm:text-sm font-bold text-[#162630]">
                Tap to Upload Photo or Signature to Test
              </p>
              <p className="text-[11px] text-[#89959A]">100% Client-Side Instant Rule Validation</p>
            </div>
          ) : (
            <div className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE2DF]">
                <span className="text-xs font-bold text-[#162630] truncate max-w-xs">{checkerFile.name}</span>
                {isReady ? (
                  <span className="px-3 py-1 rounded-full bg-[#00C98B]/15 text-[#00a874] border border-[#00C98B]/30 text-xs font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ READY TO UPLOAD</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#EBAA78]/20 text-[#c97b40] border border-[#EBAA78]/40 text-xs font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠ NEEDS FIXING</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
                  <span className="text-[10px] text-[#89959A] block">Current File Size</span>
                  <span className={`font-bold font-mono text-sm ${isSizeValid ? 'text-[#00C98B]' : 'text-[#c97b40]'}`}>
                    {checkerFile.sizeKB} KB
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
                  <span className="text-[10px] text-[#89959A] block">Allowed Rule Limit</span>
                  <span className="font-bold text-[#162630] font-mono text-sm">
                    {activeRule.minKB}–{activeRule.maxKB} KB
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
                  <span className="text-[10px] text-[#89959A] block">Image Resolution</span>
                  <span className="font-bold text-[#162630] font-mono text-sm">
                    {checkerFile.width}×{checkerFile.height} px
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#DDE2DF]">
                  <span className="text-[10px] text-[#89959A] block">File Format</span>
                  <span className="font-bold text-[#00C98B] font-mono text-sm">{checkerFile.format}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => checkerInputRef.current?.click()}
                  className="text-xs font-semibold text-[#65737A] hover:underline cursor-pointer"
                >
                  Check Another File
                </button>
                {!isReady && (
                  <Link
                    href={activeRule.fixUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-[#00C98B]/20"
                  >
                    <span>Fix &amp; Compress to &lt; {activeRule.maxKB} KB Automatically</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 7. TRUST & PRIVACY GUARANTEE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#DDE2DF] rounded-card p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#00C98B]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#162630]">Browser-Native Engine</h3>
            <p className="text-xs text-[#65737A] leading-relaxed">
              Fast image downscaling and bi-cubic rendering executed directly within device RAM with zero server processing delay.
            </p>
          </div>

          <div className="bg-white border border-[#DDE2DF] rounded-card p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#00C7D9]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#162630]">Privacy First Guarantee</h3>
            <p className="text-xs text-[#65737A] leading-relaxed">
              No registration or account needed. Client-side tools do not store or transmit confidential identity files to external servers.
            </p>
          </div>

          <div className="bg-white border border-[#DDE2DF] rounded-card p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#EBAA78]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#162630]">Requirement Focused</h3>
            <p className="text-xs text-[#65737A] leading-relaxed">
              Presets calibrated to verified official recruitment standards across SSC, UPSC, Railway, Banking, Police, and NTA portals.
            </p>
          </div>
        </section>

        {/* 8. SEO INFORMATION & RECRUITMENT GUIDANCE */}
        <section className="bg-white border border-[#DDE2DF] rounded-card p-6 sm:p-8 space-y-4 text-xs text-[#65737A] leading-relaxed">
          <h3 className="text-sm font-bold text-[#162630]">
            About Formilo Government Form Document Preparation Platform
          </h3>
          <p>
            Formilo provides browser-based image and PDF formatting utilities tailored for candidate document uploads. Online recruitment portals such as SSC (Staff Selection Commission), UPSC, Railway RRB, State Police Boards, and NTA mandate strict limits on candidate photograph dimensions, file weight (such as strictly under 20 KB or 50 KB), and signature clarity.
          </p>
          <p>
            Using HTML5 client-side canvas algorithms, Formilo downscales images with bi-cubic smoothing to preserve facial features, candidate name strips (DOP/DOB), and ink stroke legibility while staying within byte restrictions.
          </p>
        </section>

      </div>
    </main>
  );
}
