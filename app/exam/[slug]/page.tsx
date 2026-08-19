// app/exam/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import ExamResizerTool from '@/components/ExamResizerTool';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  Zap,
  ShieldCheck 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ExamPresetConfig {
  slug: string;
  baseSlug: string;
  examName: string;
  boardName: string;
  docType: string;
  maxKB: number;
  minKB: number;
  dimensions: { width: number; height: number; aspect: string; cm: string; dpi: number };
  format: string;
  bgColor: string;
}

function getExamPreset(slug: string): ExamPresetConfig {
  const lower = (slug || 'govt-exam-photo').toLowerCase();

  const isSignature = lower.includes('signature') || lower.includes('sign');
  const isThumb = lower.includes('thumb');
  const isPostcard = lower.includes('postcard') || lower.includes('4x6');
  
  const docType = isPostcard 
    ? 'Postcard Size Photo (4x6 Inch)' 
    : isSignature 
    ? 'Signature Crop & Compress' 
    : isThumb 
    ? 'Left Thumb Impression' 
    : 'Passport Size Photo';

  const baseSlug = lower
    .replace(/-(passport-photo|photo|signature|sign|thumb-impression|thumb|postcard-size-photo|postcard)$/i, '');

  const words = baseSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const examName = words.join(' ') || 'Govt Recruitment Exam';
  
  const boardName = lower.includes('odisha') 
    ? 'OPRB' 
    : lower.includes('maharashtra') 
    ? 'Maharashtra Police' 
    : lower.includes('telangana') || lower.includes('ts') 
    ? 'TSLPRB' 
    : lower.includes('ap-police') || lower.includes('andhra') 
    ? 'SLPRB AP' 
    : lower.includes('ssc') 
    ? 'Staff Selection Commission' 
    : lower.includes('upsc') 
    ? 'UPSC' 
    : lower.includes('pan') 
    ? 'NSDL / UTIITSL' 
    : 'Official Examination Board';

  const maxKB = isPostcard ? 200 : isSignature ? 20 : isThumb ? 20 : 50;
  const minKB = isPostcard ? 50 : isSignature ? 5 : isThumb ? 10 : 20;

  const dimensions = isPostcard
    ? { width: 480, height: 720, aspect: '4:6', cm: '4 x 6 Inch (480x720 px)', dpi: 300 }
    : isSignature
    ? { width: 280, height: 120, aspect: '7:3', cm: '3.5 x 1.5 cm (280x120 px)', dpi: 300 }
    : isThumb
    ? { width: 240, height: 240, aspect: '1:1', cm: '3 x 3 cm (240x240 px)', dpi: 300 }
    : { width: 350, height: 450, aspect: '3.5:4.5', cm: '3.5 x 4.5 cm (350x450 px)', dpi: 300 };

  return {
    slug,
    baseSlug,
    examName,
    boardName,
    docType,
    maxKB,
    minKB,
    dimensions,
    format: 'JPG / JPEG',
    bgColor: isSignature ? 'Clean White Background with Blue/Black Ink' : 'Light / White Background',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  return {
    title: `${preset.examName} ${preset.docType} Resizer (< ${preset.maxKB} KB)`,
    description: `Free online ${preset.docType.toLowerCase()} resizer for ${preset.examName} conducted by ${preset.boardName}. Compress strictly between ${preset.minKB} KB to ${preset.maxKB} KB with ${preset.dimensions.cm}. 100% private in-browser tool.`,
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  // Other related formats for this specific exam
  const otherFormats = [
    { title: `${preset.examName} Passport Photo`, type: 'Passport Photo', slug: `${preset.baseSlug}-passport-photo`, maxKB: 50 },
    { title: `${preset.examName} Signature Crop & Compress`, type: 'Signature', slug: `${preset.baseSlug}-signature`, maxKB: 20 },
    { title: `${preset.examName} Left Thumb Impression`, type: 'Thumb', slug: `${preset.baseSlug}-thumb-impression`, maxKB: 20 },
    { title: `${preset.examName} Postcard Size Photo (4x6 Inch)`, type: 'Postcard Photo', slug: `${preset.baseSlug}-postcard-size-photo`, maxKB: 200 },
  ].filter(item => item.slug !== preset.slug);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb matching Image 70840 */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors">Exam Presets</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold truncate">{preset.examName}</span>
        </nav>

        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Official Dimension &amp; Size Lock: &lt; {preset.maxKB} KB</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {preset.examName} <span className="text-emerald-400">{preset.docType}</span> Resizer
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Free online {preset.docType.toLowerCase()} resizer for {preset.examName} conducted by {preset.boardName}. Compress and resize official document strictly between {preset.minKB} KB to {preset.maxKB} KB with {preset.dimensions.cm}. 100% private in-browser tool.
          </p>
        </div>

        {/* Sponsored / Ad Placeholder 1 */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Resizer Tool Box */}
        <ExamResizerTool preset={preset} />

        {/* Sponsored / Ad Placeholder 2 */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Official Upload Guidelines Card */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{preset.examName} Official Upload Guidelines</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500">Exam Board</span>
              <p className="font-bold text-white text-xs truncate">{preset.boardName}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500">Max File Size</span>
              <p className="font-bold text-emerald-400 text-xs">&lt; {preset.maxKB} KB</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500">Dimensions</span>
              <p className="font-bold text-white text-xs truncate">{preset.dimensions.width} &times; {preset.dimensions.height} px</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-1">
              <span className="text-zinc-500">DPI Resolution</span>
              <p className="font-bold text-emerald-400 text-xs">{preset.dimensions.dpi} DPI</p>
            </div>
          </div>
        </div>

        {/* Other Exam Format Presets Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            OTHER {preset.examName.toUpperCase()} FORMAT PRESETS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherFormats.map((f) => (
              <Link
                key={f.slug}
                href={`/exam/${f.slug}`}
                className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {f.title}
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">&lt; {f.maxKB} KB</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-emerald-400 font-medium">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Telegram Conversion */}
        <TelegramBanner />

      </div>
    </div>
  );
}
