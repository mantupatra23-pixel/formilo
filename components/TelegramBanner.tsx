// components/TelegramBanner.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Send, BellRing, ShieldCheck, Zap } from 'lucide-react';

export default function TelegramBanner() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-8">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-950/90 border border-emerald-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl group hover:border-emerald-400/50 transition-all duration-300">
        {/* Neon Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left Info Section */}
          <div className="flex items-start gap-4 text-left w-full md:w-auto">
            <div className="relative shrink-0 mt-0.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform duration-300">
                <Send className="w-6 h-6 -rotate-12 translate-x-0.5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
              </span>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono tracking-wider font-semibold text-emerald-400 uppercase">
                  Live Telegram Channel
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                  <BellRing className="w-3 h-3 text-emerald-400" /> Instant Form Alerts
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Sarkari Exam Photo & Signature 1-Click Presets
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                Naye govt forms release hote hi exact KB requirements ke direct resizer tool links turant paane ke liye official Telegram channel join karein.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400/90">
                  <Zap className="w-3.5 h-3.5" /> 100% Free
                </span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-1 text-cyan-400/90">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zero Uploads (Private)
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="https://t.me/formilo_alerts_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <span>Join @formilo_alerts_hub</span>
            <Send className="w-4 h-4 text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
