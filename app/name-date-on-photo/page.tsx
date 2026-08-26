// app/name-date-on-photo/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import NameDatePhotoTool from '@/components/NameDatePhotoTool';
import TelegramBanner from '@/components/TelegramBanner';
import { ArrowLeft, FileCheck, CheckCircle2, AlertCircle, HelpCircle, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Add Name and Date on Photo Online Free (DOP Resizer Under 50 KB)',
  description: 'Add candidate name and date of photo (DOP) on passport size photo for SSC CGL, GD, RRB, and Police recruitment forms. 100% private in-browser generator.',
  alternates: {
    canonical: 'https://www.formilo.in/name-date-on-photo',
  },
};

export default function NameDatePhotoPage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>100% Private (No Upload)</span>
          </div>
        </div>

        <div className="text-center space-y-2 pt-2">
          <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 uppercase">
            Sarkari Form Requirement
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Add <span className="text-emerald-400">Name &amp; Date of Photo (DOP)</span> on Photo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Stamp official Name &amp; Date bottom bar and compress strictly under 50 KB for SSC, Railway, and State Bharti forms.
          </p>
        </div>

        <NameDatePhotoTool />

        <TelegramBanner />

        {/* Guidelines */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Photo Guidelines</span>
          </div>
          <ul className="space-y-2 list-disc list-inside text-zinc-400">
            <li>The date mentioned on the photograph must not be more than 3 months old from notification release date.</li>
            <li>The candidate name should be clearly visible in capital letters on a clean white strip.</li>
            <li>The face must cover at least 70% to 80% of the photograph area.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
