// app/about/page.tsx
import { Metadata } from 'next';
import { ShieldCheck, Zap, Lock, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Formilo Tools',
  description: 'Learn about Formilo, the 100% private, client-side photo, signature, and PDF processing engine.',
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-emerald-400">Formilo</span>
          </h1>
          <p className="mt-3 text-base text-zinc-400 leading-relaxed">
            Formilo is an ultra-fast, browser-based file formatting suite tailored for government job applicants, students, and competitive exam candidates across India.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">100% Private & Client-Side</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Your photos, signatures, and certificates never upload to remote servers. Everything runs entirely within your device's browser memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="p-2.5 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Exact File Constraints</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Built-in presets for SSC CGL, UPSC CSE, IBPS PO, State Police, and NTA forms guarantee correct dimension and KB thresholds on the first try.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
          <h2 className="text-lg font-bold text-white">Our Mission</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Form application portals frequently reject candidate uploads due to strict size requirements like "under 20 KB" or non-standard pixel dimensions. Formilo eliminates complicated software setups with automated, instantaneous client-side compression algorithms.
          </p>
        </div>
      </div>
    </main>
  );
}
