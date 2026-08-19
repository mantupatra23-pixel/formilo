// components/TopShareBar.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Send, Copy } from 'lucide-react';

export default function TopShareBar() {
  const [copied, setCopied] = useState(false);

  const handleWhatsAppShare = () => {
    const text = "⚡ Formilo — Free Sarkari Exam Photo, Signature & PDF Resizer (Under 20KB/50KB):\nhttps://formilo-jzcl.vercel.app";
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href || 'https://formilo-jzcl.vercel.app');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#08090a] border-b border-zinc-800/80 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Notice */}
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="text-emerald-400 font-bold">⚡</span>
          <span className="font-semibold text-[11px] sm:text-xs">
            100% Free &amp; Private — Resize &amp; Format Form Documents in Seconds!
          </span>
        </div>

        {/* Right 3 Action Buttons */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-1 rounded-md bg-[#00e676] hover:bg-[#00c853] text-black font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-black text-transparent" />
            <span>WhatsApp</span>
          </button>

          {/* Telegram Channel */}
          <a
            href="https://t.me/formilo_alerts_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-md bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-white text-transparent" />
            <span>Telegram</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
