'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface ToolFAQProps {
  faqs: { q: string; a: string }[];
}

export default function ToolFAQ({ faqs }: ToolFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 font-bold text-white text-sm">
        <HelpCircle className="w-4 h-4 text-emerald-400" />
        <span>Frequently Asked Questions</span>
      </div>

      <div className="space-y-3 text-xs text-zinc-400">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-black border border-zinc-850 space-y-1 transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left font-bold text-white text-[13px] hover:text-emerald-400 flex justify-between items-center transition cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="pr-2">{faq.q}</span>
                <span className="text-zinc-500 font-mono text-base ml-2 shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
