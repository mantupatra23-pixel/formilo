'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, 
  X, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  UploadCloud, 
  GraduationCap, 
  FileText, 
  Image as ImageIcon, 
  Layers 
} from 'lucide-react';
import { getAllTools, getRegistryStats } from '@/lib/toolsData';
import { examsData } from '@/data/exams';
import ToolCard from '@/components/tools/ToolCard';

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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'presets' | 'photo' | 'signature' | 'pdf'>('all');
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

  // Dynamic 1,017+ Registry Evaluation
  const allTools = useMemo(() => getAllTools(), []);
  const stats = useMemo(() => getRegistryStats(), []);

  // Keyboard shortcut '/'
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

  // Filter Tools Dynamically
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
      if (selectedCategory === 'presets') return tool.slug.startsWith('exam/');
      return tool.category === selectedCategory;
    });
  }, [allTools, searchQuery, selectedCategory]);

  const popularTools = useMemo(() => {
    return allTools.filter((t) => t.popular);
  }, [allTools]);

  // Checker Validation
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
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-6 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-10">

        {/* 1. HERO & INSTANT SEARCH */}
        <section className="text-center space-y-4 pt-4 sm:pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDE2DF] shadow-sm text-[#17262E] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00C98B] animate-pulse"></span>
            <span>⚡ 100% Free &amp; Privacy-Focused • <strong>{stats.totalDisplay}</strong> Form Tools</span>
          </div>

          <div className="space-y-2 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17262E] tracking-tight leading-[1.15]">
              Government Form Photos, Signatures &amp; PDFs{' '}
              <span className="bg-gradient-to-r from-[#00C98B] to-[#00C7D9] bg-clip-text text-transparent">
                Ready in Seconds
              </span>
            </h1>
            <p className="text-[13.5px] sm:text-[14px] text-[#53636A] leading-relaxed max-w-2xl mx-auto">
              Resize, compress, and format photos, signatures, and PDF documents to the required KB, dimensions, and formats for online applications and government recruitment forms.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative px-2">
            <div className="relative flex items-center bg-[#FFFFFF] border border-[#D5DCDA] focus-within:border-[#00B987] focus-within:ring-[3px] focus-within:ring-[#00C98B]/10 rounded-2xl shadow-card transition-all">
              <Search className="w-5 h-5 text-[#66777D] ml-4 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search across ${stats.totalDisplay} Form Tools (e.g. SSC CGL, 20 KB Photo, Signature, PDF...)`}
                className="w-full py-3.5 sm:py-4 px-3 text-[13px] sm:text-[14px] text-[#17262E] bg-transparent focus:outline-none placeholder-[#718087]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 mr-2 text-[#66777D] hover:text-[#17262E] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block mr-4 px-2 py-0.5 text-[11px] font-mono text-[#66777D] bg-[#F7F7F3] border border-[#DDE2DF] rounded-md">
                  /
                </kbd>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3">
              <span className="text-[11px] font-semibold text-[#66777D] mr-1 hidden sm:inline">Quick:</span>
              {quickPresets.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSearchQuery(chip.query)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold border transition shadow-sm cursor-pointer ${
                    searchQuery === chip.query
                      ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white border-transparent'
                      : 'bg-[#FFFFFF] border-[#D8DEDC] text-[#46565C] hover:border-[#00C98B] hover:text-[#00A879]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. CYBER CAFE & CSC CENTER WORKSPACE */}
        <section className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-7 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00C98B]/15 text-[#008760] border border-[#00C98B]/30 text-[11px] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-[#00C98B]" />
              <span>CYBER CAFE &amp; CSC CENTER WORKSPACE</span>
            </div>

            <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#17262E] tracking-tight">
              Fast Form Document Formatting for Cyber Cafes
            </h2>

            <p className="text-[13px] text-[#53636A] leading-relaxed">
              Prepare candidate photos, signatures, handwritten declarations, and marksheets quickly from one high-speed browser-based workspace.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/exam/ssc-cgl-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] text-[12px] font-semibold border border-[#DDE2DF] transition">
                SSC CGL Photo &rarr;
              </Link>
              <Link href="/name-date-on-photo" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] text-[12px] font-semibold border border-[#DDE2DF] transition">
                Name &amp; Date DOP &rarr;
              </Link>
              <Link href="/exam/pan-card-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] text-[12px] font-semibold border border-[#DDE2DF] transition">
                PAN 213×213 px &rarr;
              </Link>
              <Link href="/exam/rrb-ntpc-passport-size-photo-resizer" className="px-2.5 py-1 rounded-lg bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] text-[12px] font-semibold border border-[#DDE2DF] transition">
                Railway NTPC &rarr;
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href="/cyber-cafe"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-[13px] sm:text-[14px] text-center shadow-md shadow-[#00C98B]/20 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <span>Open Cyber Cafe Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => { setSelectedCategory('presets'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-[#F7F7F3] hover:bg-[#E8EBE9] text-[#17262E] font-bold text-[12px] text-center border border-[#DDE2DF] transition cursor-pointer"
            >
              View Exam Presets ({stats.presetsCount})
            </button>
          </div>
        </section>

        {/* 3. FEATURED TOOLS SECTION (2 COLUMNS DESKTOP) */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#00A879]" />
                <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#17262E]">
                  ⚡ Featured &amp; Most Used Tools
                </h2>
              </div>
              <span className="text-[11px] text-[#008760] font-bold px-2.5 py-0.5 rounded-lg bg-[#00C98B]/15 border border-[#00C98B]/30 font-mono">
                Top Presets
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTools.slice(0, 6).map((tool) => (
                <ToolCard
                  key={`popular-${tool.id}`}
                  title={tool.title}
                  description={tool.description}
                  slug={tool.slug}
                  badge={tool.badge}
                  category={tool.category}
                  targetKB={tool.targetKB}
                  dimensions={tool.width && tool.height ? `${tool.width} × ${tool.height} px` : undefined}
                  popular={tool.popular}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. DYNAMIC CATEGORY TABS & MAIN 2-COLUMN TOOLS GRID */}
        <section className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#DDE2DF]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Tools', count: stats.total },
                { id: 'presets', label: 'Exam Presets', count: stats.presetsCount },
                { id: 'photo', label: 'Photo Resizers', count: stats.photoCount },
                { id: 'signature', label: 'Signature Tools', count: stats.signatureCount },
                { id: 'pdf', label: 'PDF Tools', count: stats.pdfCount },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.id as any); setSearchQuery(''); }}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white shadow-sm font-bold'
                      : 'bg-[#FFFFFF] text-[#46565C] hover:text-[#17262E] border border-[#D8DEDC]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-[#F0F3F2] text-[#66777D]'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            <span className="text-[12px] text-[#66777D] font-mono">
              {filteredTools.length} Tools Available
            </span>
          </div>

          {/* 2-Column Responsive Grid on Desktop, 1-Column on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.slice(0, 16).map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                slug={tool.slug}
                badge={tool.badge}
                category={tool.category}
                targetKB={tool.targetKB}
                dimensions={tool.width && tool.height ? `${tool.width} × ${tool.height} px` : undefined}
                popular={tool.popular}
              />
            ))}
          </div>

          {filteredTools.length > 16 && (
            <div className="text-center pt-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] border border-[#DDE2DF] hover:border-[#00C98B] text-[13px] font-bold text-[#17262E] hover:text-[#00A879] shadow-sm transition"
              >
                <span>Browse All {stats.totalDisplay} Tools &rarr;</span>
              </Link>
            </div>
          )}
        </section>

        {/* 5. EXAM FORM PRESETS (2 COLUMNS DESKTOP) */}
        <section id="exam-presets" className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE2DF] pb-2">
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-extrabold text-[#17262E] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#00A879]" />
                <span>🎓 Popular Exam Form Presets</span>
              </h2>
              <p className="text-[13px] text-[#53636A]">Pre-calibrated specifications for active recruitment portals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examsData.slice(0, 6).map((exam) => (
              <div
                key={exam.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#DDE2DF] hover:border-[#00C98B] shadow-sm hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition flex flex-col justify-between min-h-[180px] gap-3.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F0F3F2] text-[#46565C] border border-[#D8DEDC]">
                      {exam.board}
                    </span>
                    <span className="text-[11px] font-mono text-[#66777D]">
                      Photo • Sign • Thumb
                    </span>
                  </div>
                  <h3 className="font-bold text-[16px] text-[#17262E] leading-snug pt-1">
                    {exam.title} Tools Suite
                  </h3>
                  <p className="text-[13px] text-[#53636A] line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="pt-1">
                  <Link
                    href={`/exam/${exam.id}-passport-size-photo-resizer`}
                    className="w-full h-[42px] sm:h-[44px] rounded-xl bg-[#138F79] hover:bg-[#0E7764] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Open Exam Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FORM FILE CHECKER */}
        <section className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#008760]">
              <CheckCircle2 className="w-4 h-4" />
              <span>INSTANT REQUIREMENT VALIDATOR</span>
            </div>
            <h2 className="text-[22px] sm:text-[24px] font-extrabold text-[#17262E] tracking-tight">
              Is Your Form File Ready?
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#53636A]">
              Select your exam and upload your candidate photo or signature to verify size and format requirements before final submission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-[13px] font-bold text-[#17262E] shrink-0">Select Target Form Requirement:</label>
            <select
              value={selectedCheckerKey}
              onChange={(e) => setSelectedCheckerKey(e.target.value)}
              className="w-full sm:w-auto flex-1 bg-[#F7F7F3] border border-[#D5DCDA] rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-[#17262E] focus:outline-none focus:border-[#00B987]"
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
              className="border-2 border-dashed border-[#D5DCDA] hover:border-[#00C98B] rounded-2xl p-6 sm:p-8 text-center bg-[#F7F7F3] cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
            >
              <UploadCloud className="w-10 h-10 text-[#53636A] group-hover:text-[#00A879] transition-colors" />
              <p className="text-[14px] font-bold text-[#17262E]">
                Tap to Upload Photo or Signature to Test
              </p>
              <p className="text-[12px] text-[#66777D]">Supports JPG, JPEG, PNG • 100% Client-Side Instant Validation</p>
            </div>
          ) : (
            <div className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE2DF]">
                <span className="text-[13px] font-bold text-[#17262E] truncate max-w-xs">{checkerFile.name}</span>
                {isReady ? (
                  <span className="px-3 py-1 rounded-full bg-[#00C98B]/15 text-[#008760] border border-[#00C98B]/30 text-[12px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ READY TO UPLOAD</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#FDF2E9] text-[#A85A20] border border-[#EBAA78]/50 text-[12px] font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>⚠ NEEDS FIXING</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#DDE2DF]">
                  <span className="text-[11px] text-[#66777D] block">Current File Size</span>
                  <span className={`font-bold font-mono text-[14px] ${isSizeValid ? 'text-[#008760]' : 'text-[#A85A20]'}`}>
                    {checkerFile.sizeKB} KB
                  </span>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#DDE2DF]">
                  <span className="text-[11px] text-[#66777D] block">Allowed Rule Limit</span>
                  <span className="font-bold text-[#17262E] font-mono text-[14px]">
                    {activeRule.minKB}–{activeRule.maxKB} KB
                  </span>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#DDE2DF]">
                  <span className="text-[11px] text-[#66777D] block">Image Resolution</span>
                  <span className="font-bold text-[#17262E] font-mono text-[14px]">
                    {checkerFile.width}×{checkerFile.height} px
                  </span>
                </div>
                <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#DDE2DF]">
                  <span className="text-[11px] text-[#66777D] block">File Format</span>
                  <span className="font-bold text-[#008760] font-mono text-[14px]">{checkerFile.format}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => checkerInputRef.current?.click()}
                  className="text-[12px] font-semibold text-[#53636A] hover:underline cursor-pointer"
                >
                  Check Another File
                </button>
                {!isReady && (
                  <Link
                    href={activeRule.fixUrl}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C98B] to-[#00C7D9] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-sm shadow-[#00C98B]/20"
                  >
                    <span>Fix &amp; Compress to &lt; {activeRule.maxKB} KB Automatically</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 7. TRUST & PRIVACY */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#00A879]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Browser-Native</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              Fast processing directly in your browser where supported with zero server queuing.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#007D8B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Privacy First</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              No account required for basic tools. Client-side tools do not need remote file storage.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#A85A20]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Requirement Focused</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              Tools designed and calibrated around real government form-upload requirements.
            </p>
          </div>
        </section>

        {/* 8. STRUCTURED SEO INFORMATION */}
        <section className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-4 text-[13px] text-[#53636A] leading-relaxed">
          <h3 className="text-[16px] font-bold text-[#17262E]">
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
