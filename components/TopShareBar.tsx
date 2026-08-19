// components/TopShareBar.tsx
'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Sparkles, Send } from 'lucide-react';

export default function TopShareBar() {
  const [copied, setCopied] = useState(false);

  const shareToWhatsApp = () => {
    const text = "⚡ Formilo — Free Online Photo, Signature & PDF Tools for all Exam & Govt Forms (100% Private, No Upload): https://formilo-jzcl.vercel.app";
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=https://formilo-jzcl.vercel.app&text=${encodeURIComponent("⚡ Free Online Photo & Signature Resizer under 20 KB / 50 KB:")}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-emerald-950/80 border-b border-emerald-500/30 px-3 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-white text-[11px] sm:text-xs">
            100% Free & Private — Resize & Format Form Documents in Seconds!
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={shareToWhatsApp}
            className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#22c35e] text-black font-extrabold text-[11px] flex items-center gap-1.5 shadow-md shadow-[#25D366]/20 cursor-pointer transition-transform active:scale-95"
          >
            <Share2 className="w-3 h-3" /> WhatsApp
          </button>

          <button
            onClick={shareToTelegram}
            className="px-2.5 py-1 rounded-lg bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-[#229ED9]/20 cursor-pointer transition-transform active:scale-95"
          >
            <Send className="w-3 h-3" /> Telegram
          </button>

          <button
            onClick={copyLink}
            className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-[11px] flex items-center gap-1 border border-zinc-700 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
