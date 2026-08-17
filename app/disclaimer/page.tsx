// app/disclaimer/page.tsx
import { Metadata } from 'next';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer — Formilo',
  description: 'Official non-affiliation disclaimer regarding recruitment boards and government examination bodies.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-[80vh] bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <AlertTriangle className="w-3.5 h-3.5" /> Official Notice
          </div>
          <h1 className="text-3xl font-extrabold text-white">Non-Affiliation Disclaimer</h1>
          <p className="text-xs text-zinc-400 mt-1">Last Revised: August 2026</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">Independent Utility Notice</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Formilo is an independent web utility and is <strong>not affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Institute of Banking Personnel Selection (IBPS), National Testing Agency (NTA), Railway Recruitment Boards (RRB), or any government examination authority.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                All exam names, recruitment marks, and portal references are registered trademarks of their respective holders. The use of these trademarks is solely for identification and educational convenience.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
