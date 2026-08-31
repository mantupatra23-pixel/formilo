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
    <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-5 sm:p-7 space-y-4 shadow-card">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-[#00A879]" />
        <h3 className="font-extrabold text-[18px] sm:text-[20px] text-[#17262E]">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#F7F7F3] border border-[#DDE2DF] rounded-xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 text-left text-[13.5px] font-bold text-[#17262E] hover:text-[#00A879] flex justify-between items-center transition cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="pr-2">{faq.q}</span>
                <span className="text-[#66777D] text-lg font-mono ml-2 shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-[13px] text-[#53636A] border-t border-[#DDE2DF] leading-relaxed">
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
