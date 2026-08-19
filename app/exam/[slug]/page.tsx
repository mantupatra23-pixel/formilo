// app/exam/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import ExamResizerTool from '@/components/ExamResizerTool';
import { FileCheck, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getExamPreset(slug: string) {
  const isSignature = slug.includes('signature') || slug.includes('sign');
  const isThumb = slug.includes('thumb');
  
  const docType = isSignature ? 'Signature' : isThumb ? 'Thumb Impression' : 'Passport Size Photo';
  const rawName = (slug || 'Govt Exam')
    .replace(/-(passport-photo|photo|signature|sign|thumb-impression|thumb)$/i, '')
    .replace(/-/g, ' ');
    
  const examName = rawName.toUpperCase();
  const maxKB = isSignature ? 20 : isThumb ? 30 : 50;
  const minKB = isSignature ? 5 : isThumb ? 10 : 20;
  const dimensions = isSignature 
    ? { width: 350, height: 150, aspect: '7:3', cm: '3.5 x 1.5 cm' }
    : { width: 350, height: 450, aspect: '3.5:4.5', cm: '3.5 x 4.5 cm' };

  return {
    slug,
    examName,
    docType,
    maxKB,
    minKB,
    dimensions,
    format: 'JPG / JPEG',
    bgColor: isSignature ? 'Clean White Background' : 'Light / White Background',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  return {
    title: `${preset.examName} ${preset.docType} Resizer (Strictly < ${preset.maxKB} KB)`,
    description: `Compress and format ${preset.examName} ${preset.docType} strictly between ${preset.minKB} KB to ${preset.maxKB} KB.`,
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = getExamPreset(slug);

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
            <span>100% In-Browser Private</span>
          </div>
        </div>

        <div className="text-center space-y-2 pt-2">
          <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 uppercase">
            Official Preset
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {preset.examName} <span className="text-emerald-400">{preset.docType}</span> Resizer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Compress strictly between <span className="text-white font-bold">{preset.minKB} KB – {preset.maxKB} KB</span> for error-free form submission.
          </p>
        </div>

        {/* Tool */}
        <ExamResizerTool preset={preset} />

        {/* Telegram Banner */}
        <TelegramBanner />

        {/* Specs */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Required Specifications</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Max Size</span>
              <p className="font-bold text-emerald-400">{preset.minKB} KB – {preset.maxKB} KB</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Dimensions</span>
              <p className="font-bold text-zinc-200">{preset.dimensions.cm}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Format</span>
              <p className="font-bold text-zinc-200">{preset.format}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Background</span>
              <p className="font-bold text-zinc-200">{preset.bgColor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
