// app/about/page.tsx
import { Metadata } from 'next';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Formilo',
  description: 'Learn about Formilo, the 100% private, client-side photo, signature, and PDF processing engine.',
};

export default function AboutPage() {
  return (
    <main className="min-h-[80vh] bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center sm:text-left border-b border-zinc-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> High Speed In-Browser Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-emerald-400">Formilo</span>
          </h1>
          <p className="mt-3 text-base text-zinc-300 leading-relaxed max-w-3xl">
            Formilo is a specialized client-side file formatting engine built for students, competitive exam candidates, and cyber cafes across India. We ensure your photos, signatures, and PDFs match exact government portal specifications on the first attempt.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your sensitive documents never get uploaded to any server. Everything is processed directly inside your browser memory using WebAssembly and HTML5 Canvas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Exact KB & Pixel Presets</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Preset ratios and byte boundaries for SSC, UPSC, IBPS, State Police, Railway, and NTA forms to eliminate portal upload rejections.
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Our Mission
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Filling government application forms is stressful when portals reject images for being 21 KB instead of 20 KB. Formilo eliminates software hurdles with instant, free, zero-upload tools accessible directly from any mobile or desktop.
          </p>
        </div>

      </div>
    </main>
  );
}
