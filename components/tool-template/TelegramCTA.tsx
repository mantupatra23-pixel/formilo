import React from 'react';
import { Send, Sparkles, ArrowRight } from 'lucide-react';
import { TELEGRAM_CHANNEL_URL } from '@/lib/toolPageHelper';

export default function TelegramCTA() {
  return (
    <div className="w-full bg-[#102630] border border-[#1f3847] rounded-2xl p-5 sm:p-7 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
      <div className="space-y-1.5 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30 text-[11px] font-bold uppercase tracking-wider">
          <Send className="w-3 h-3" />
          <span>FORMILO COMMUNITY &amp; ALERTS</span>
        </div>

        <h3 className="text-[18px] sm:text-[20px] font-extrabold text-white tracking-tight leading-snug">
          Recruitment Photo &amp; Signature 1-Click Presets
        </h3>

        <p className="text-[13px] text-[#B8C5C9] leading-relaxed">
          Get direct links to newly released exam tools, document preparation shortcuts, and verified recruitment size guidelines directly on Telegram.
        </p>
      </div>

      <a
        href={TELEGRAM_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00C98B] hover:bg-[#00b37c] text-[#102630] font-bold text-[13px] flex items-center justify-center gap-2 shadow-md shadow-[#00C98B]/20 transition shrink-0 cursor-pointer active:scale-[0.99]"
      >
        <span>Join on Telegram</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
