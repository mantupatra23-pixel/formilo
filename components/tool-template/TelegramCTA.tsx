import React from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { TELEGRAM_CHANNEL_URL } from '@/lib/toolPageHelper';

export default function TelegramCTA() {
  return (
    <div className="w-full rounded-3xl bg-[#0c0d0e] border border-zinc-800 p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
          <Send className="w-3 h-3" />
          <span>LIVE TELEGRAM CHANNEL &bull; Instant Form Alerts</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
          Sarkari Exam Photo &amp; Signature 1-Click Presets
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Naye govt forms release hote hi exact KB requirements ke direct resizer tool links aur shortcuts paane ke liye official Telegram channel join karein.
        </p>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
          <span>⚡ 100% Free</span>
          <span>&bull;</span>
          <span>🔒 Zero Uploads (Private)</span>
        </div>
      </div>

      <a
        href={TELEGRAM_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition shrink-0 active:scale-95 cursor-pointer"
      >
        <span>Join @formilo_alerts_hub</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
