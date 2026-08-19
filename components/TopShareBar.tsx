// components/TopShareBar.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Copy } from 'lucide-react';

export default function TopShareBar() {
  const [copied, setCopied] = useState(false);

  const shareText = "⚡ Formilo — Free Sarkari Exam Photo, Signature & PDF Resizer (Under 20KB/50KB):\nhttps://formilo-jzcl.vercel.app";

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
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
    <div className="w-full bg-zinc-950/90 border-b border-zinc-800/80 px-4 py-2 text-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-[11px] sm:text-xs">
            100% Free Client-Side Tool for Students &amp; Cyber Cafes
          </span>
        </div>

        {/* Share Action Buttons */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp Share</span>
          </button>

          {/* Copy Web URL */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-[11px] flex items-center gap-1.5 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
