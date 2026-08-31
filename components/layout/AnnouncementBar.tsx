'use client';

import React, { useState } from 'react';
import { Zap, Share2, Check } from 'lucide-react';

export default function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText('https://www.formilo.in');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#102630] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#1f3847]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
        
        {/* Left Value Proposition */}
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C98B] animate-pulse shrink-0"></span>
          <span className="font-semibold text-[#00C98B] shrink-0">⚡ 100% Free & Privacy-Focused:</span>
          <span className="text-neutral-300 truncate">Prepare Government Form Files in Seconds</span>
        </div>

        {/* Right Shortcuts */}
        <div className="flex items-center gap-3 shrink-0 text-neutral-300">
          <a
            href="https://t.me/formilo_alerts_hub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00C98B] transition-colors hidden sm:inline"
          >
            Telegram Alerts
          </a>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-[#00C98B] transition-colors cursor-pointer"
            title="Copy Formilo Link"
          >
            {copied ? <Check className="w-3 h-3 text-[#00C98B]" /> : <Share2 className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
