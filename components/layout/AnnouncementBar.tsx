'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('https://www.formilo.in');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent('https://www.formilo.in');
      const text = encodeURIComponent('⚡ Formilo — Free Online Govt Form Photo, Signature & PDF Resizer Tool (100% Private): ');
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  return (
    <div className="w-full bg-[#102630] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#1f3847]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
        
        {/* Left Notice Text */}
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C98B] animate-pulse shrink-0"></span>
          <span className="font-semibold text-[#00C98B] shrink-0">⚡ 100% Free &amp; Privacy-Focused:</span>
          <span className="text-neutral-300 truncate hidden xs:inline">Prepare Government Form Files in Seconds</span>
        </div>

        {/* Right Action Badges (WhatsApp, Telegram, Copy Link) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* WhatsApp Button with Official Logo */}
          <button
            type="button"
            onClick={shareOnWhatsApp}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            title="Share on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Telegram Button with Official Logo */}
          <a
            href="https://t.me/formilo_alerts_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/40 text-[#29b6f6] text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            title="Join Telegram Channel"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            <span>Telegram</span>
          </a>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-neutral-200 text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
            title="Copy Formilo Link"
          >
            {copied ? <Check className="w-3 h-3 text-[#00C98B]" /> : <Share2 className="w-3 h-3" />}
            <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy Link'}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
