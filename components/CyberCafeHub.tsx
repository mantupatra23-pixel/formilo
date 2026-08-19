// components/CyberCafeHub.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Monitor, Bookmark, Zap, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CyberCafeHub() {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    alert('Press Ctrl + D (or Cmd + D on Mac) to bookmark Formilo for instant 1-click access daily!');
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 3000);
  };

  const topCafeExams = [
    { name: 'SSC CGL Photo', slug: 'ssc-cgl-passport-photo' },
    { name: 'SSC Signature', slug: 'ssc-cgl-signature' },
    { name: 'Railway NTPC', slug: 'rrb-ntpc-passport-photo' },
    { name: 'Police Bharti', slug: 'up-police-constable-passport-photo' },
    { name: 'UPSC CSE', slug: 'upsc-cse-passport-photo' },
    { name: 'Agniveer Rally', slug: 'army-agniveer-passport-photo' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 my-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#121216] to-zinc-950 border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Monitor className="w-3.5 h-3.5" /> Cyber Cafe & CSC Center Quick Hub
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Fast Document Formatting for CSC & Cafe Operators
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Formilo processes unlimited photos & signatures directly in browser memory without server queues, watermark, or daily limits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleBookmarkClick}
              className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {bookmarked ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-amber-400" />}
              <span>{bookmarked ? 'Press Ctrl + D' : 'Bookmark on PC (Ctrl+D)'}</span>
            </button>

            <Link
              href="/form-tools"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" /> All Exam Presets
            </Link>
          </div>
        </div>

        {/* Quick Fast Links Grid */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mr-2">
            Frequent Cafe Shortcuts:
          </span>
          {topCafeExams.map((exam) => (
            <Link
              key={exam.slug}
              href={`/exam/${exam.slug}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>{exam.name}</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
