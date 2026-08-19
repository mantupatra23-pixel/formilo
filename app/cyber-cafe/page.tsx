// app/cyber-cafe/page.tsx
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function CyberCafePage() {
  const commonTools = [
    { title: 'SSC CGL Passport Photo (50 KB)', slug: 'ssc-cgl-passport-photo' },
    { title: 'SSC Signature Resizer (20 KB)', slug: 'ssc-gd-signature' },
    { title: 'UP Police Photo (50 KB)', slug: 'up-police-constable-passport-photo' },
    { title: 'Railway RRB Photo (50 KB)', slug: 'rrb-ntpc-passport-photo' },
    { title: 'UPSC Civil Services Photo (50 KB)', slug: 'upsc-cse-passport-photo' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> Cyber Cafe &amp; CSC Quick Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          High-Speed Form Tool for Cafe Operators
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Process multiple student photos and signatures in seconds without daily limits or server wait queues.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {commonTools.map((t) => (
          <Link
            key={t.slug}
            href={`/exam/${t.slug}`}
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/50 p-4 transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {t.title}
              </h3>
              <span className="text-xs text-zinc-500 font-mono">1-Click Local Resizer</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      <TelegramBanner />
    </div>
  );
}
