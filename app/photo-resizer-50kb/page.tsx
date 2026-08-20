import { Metadata } from 'next';
import Link from 'next/link';
import GenericPhotoKbResizer from '@/components/GenericPhotoKbResizer';
import TelegramBanner from '@/components/TelegramBanner';
import { KB_PRESETS_DATA } from '@/data/kbPresetsData';
import { CheckCircle2, Zap, Layers } from 'lucide-react';

const data = KB_PRESETS_DATA[50];

export const metadata: Metadata = {
  title: data.seoTitle,
  description: data.metaDescription,
  alternates: { canonical: `https://formilo-jzcl.vercel.app/${data.slug}` }
};

export default function PhotoResizer50KbPage() {
  const otherSizes = [20, 30, 100, 150, 200];

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link href="/#photo-resizers" className="hover:text-emerald-400">Photo Tools</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">{data.h1}</span>
        </nav>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Universal Government Exam Standard: &le; 50 KB</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">{data.h1}</h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">{data.intro}</p>
        </div>

        <GenericPhotoKbResizer initialTargetKB={50} />

        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supported Application Portals</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {data.bestFor.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-black border border-zinc-800/80 flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-xs">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Other Photo Size Presets</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {otherSizes.map((kb) => (
              <Link
                key={kb}
                href={`/photo-resizer-${kb}kb`}
                className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-emerald-400 text-xs font-mono font-bold transition-all"
              >
                Photo &le; {kb} KB &rarr;
              </Link>
            ))}
          </div>
        </div>

        <TelegramBanner />
      </div>
    </main>
  );
}
