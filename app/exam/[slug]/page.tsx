// app/exam/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import ExamResizerTool from '@/components/ExamResizerTool';
import { getToolBySlug } from '@/lib/toolsData';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  HelpCircle,
  Lock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export interface ExamPresetConfig {
  id: string;
  slug: string;
  baseSlug: string;
  title: string;
  examName: string;
  boardName: string;
  docType: string;
  targetKB: number;
  maxKB: number;
  minKB: number;
  width: number;
  height: number;
  dpi: number;
  dimensionText: string;
  aspectRatio: string;
  format: string;
  bgColor: string;
}

function resolveExamPreset(rawSlug: string): ExamPresetConfig {
  const cleanSlug = decodeURIComponent(rawSlug || 'govt-exam-photo').toLowerCase().trim();
  
  // 1. Check if exact tool exists in verified registry
  const matchedTool = getToolBySlug(cleanSlug);

  // 2. Target KB Detection
  let targetKB = matchedTool?.targetKB || 50;
  let minKB = matchedTool?.minKB || 20;

  if (cleanSlug.includes('20kb') || cleanSlug.includes('20-kb') || cleanSlug.includes('under-20kb')) {
    targetKB = 20;
    minKB = 5;
  } else if (cleanSlug.includes('30kb') || cleanSlug.includes('30-kb')) {
    targetKB = 30;
    minKB = 10;
  } else if (cleanSlug.includes('100kb') || cleanSlug.includes('100-kb')) {
    targetKB = 100;
    minKB = 30;
  } else if (cleanSlug.includes('200kb') || cleanSlug.includes('200-kb') || cleanSlug.includes('postcard') || cleanSlug.includes('4x6')) {
    targetKB = 200;
    minKB = 50;
  } else if (cleanSlug.includes('500kb') || cleanSlug.includes('500-kb')) {
    targetKB = 500;
    minKB = 100;
  }

  // 3. Document Type & Dimension Configuration
  const isSignature = cleanSlug.includes('signature') || cleanSlug.includes('sign');
  const isThumb = cleanSlug.includes('thumb');
  const isPostcard = cleanSlug.includes('postcard') || cleanSlug.includes('4x6');
  const isPan = cleanSlug.includes('pan');
  const isCCC = cleanSlug.includes('ccc') || cleanSlug.includes('nielit');
  const isDeclaration = cleanSlug.includes('declaration');

  let width = matchedTool?.width || 350;
  let height = matchedTool?.height || 450;
  let dpi = matchedTool?.dpi || 300;
  let docType = 'Passport Size Photo';
  let aspectRatio = '3.5:4.5';
  let dimensionText = `${width} × ${height} px`;

  if (isDeclaration) {
    docType = 'Handwritten Declaration';
    width = 800;
    height = 400;
    targetKB = 100;
    minKB = 50;
    aspectRatio = '2:1';
    dimensionText = '800 × 400 px';
  } else if (isPan && isSignature) {
    docType = 'Signature (400 x 200 px)';
    width = 400;
    height = 200;
    targetKB = 30;
    minKB = 5;
    aspectRatio = '2:1';
    dimensionText = '400 × 200 px (300 DPI)';
  } else if (isPan) {
    docType = 'Passport Photo (213 x 213 px)';
    width = 213;
    height = 213;
    targetKB = 50;
    minKB = 10;
    aspectRatio = '1:1';
    dimensionText = '213 × 213 px (300 DPI)';
  } else if (isCCC && isSignature) {
    docType = 'Signature (170 x 132 px)';
    width = 170;
    height = 132;
    targetKB = 20;
    minKB = 10;
    aspectRatio = '170:132';
    dimensionText = '170 × 132 px';
  } else if (isCCC) {
    docType = 'Passport Photo (132 x 170 px)';
    width = 132;
    height = 170;
    targetKB = 20;
    minKB = 10;
    aspectRatio = '132:170';
    dimensionText = '132 × 170 px';
  } else if (isPostcard) {
    docType = 'Postcard Size Photo (4x6 Inch)';
    width = 480;
    height = 720;
    targetKB = 200;
    minKB = 50;
    aspectRatio = '4:6';
    dimensionText = '480 × 720 px (4 × 6 Inch)';
  } else if (isSignature) {
    docType = 'Signature Crop & Compress';
    width = 280;
    height = 120;
    targetKB = 20;
    minKB = 5;
    aspectRatio = '7:3';
    dimensionText = '280 × 120 px';
  } else if (isThumb) {
    docType = 'Left Thumb Impression';
    width = 240;
    height = 240;
    targetKB = 20;
    minKB = 5;
    aspectRatio = '1:1';
    dimensionText = '240 × 240 px';
  }

  // 4. Base Slug and Exam Name Parsing
  const baseSlug = cleanSlug
    .replace(/-(passport-size-photo-resizer|passport-photo|photo-resizer|photo|signature-crop-compress|signature-resizer|signature|sign|left-thumb-impression-resizer|thumb-impression|thumb|postcard-size-photo-4x6-resizer|postcard-size-photo|postcard|handwritten-declaration-resizer|declaration|under-20kb|under-50kb|20kb|50kb|resizer)$/gi, '');

  const words = (baseSlug || 'Govt Exam').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const examName = words.join(' ');

  // 5. Board Name Detection
  const boardName = cleanSlug.includes('odisha') 
    ? 'OPRB' 
    : cleanSlug.includes('maharashtra') 
    ? 'Maharashtra Police Recruitment Board' 
    : cleanSlug.includes('telangana') || cleanSlug.includes('tspsc') 
    ? 'TSPSC / TSLPRB' 
    : cleanSlug.includes('ap-police') || cleanSlug.includes('andhra') 
    ? 'SLPRB Andhra Pradesh' 
    : cleanSlug.includes('ssc') 
    ? 'Staff Selection Commission (SSC)' 
    : cleanSlug.includes('upsc') 
    ? 'Union Public Service Commission (UPSC)' 
    : cleanSlug.includes('rrb') || cleanSlug.includes('railway')
    ? 'Railway Recruitment Board (RRB)'
    : cleanSlug.includes('ibps') || cleanSlug.includes('sbi') || cleanSlug.includes('rbi')
    ? 'Institute of Banking Personnel Selection'
    : isPan 
    ? 'Income Tax Department (NSDL / UTIITSL)' 
    : isCCC 
    ? 'NIELIT' 
    : 'Official Examination Authority';

  return {
    id: matchedTool?.id || cleanSlug,
    slug: cleanSlug,
    baseSlug,
    title: matchedTool?.title || `${examName} ${docType} Resizer`,
    examName,
    boardName,
    docType,
    targetKB,
    maxKB: targetKB,
    minKB,
    width,
    height,
    dpi,
    dimensionText: matchedTool?.dimensionText || dimensionText,
    aspectRatio,
    format: 'JPG / JPEG',
    bgColor: isSignature 
      ? 'Clean White Background with Black/Blue Ink' 
      : isThumb 
      ? 'Clean White Paper with Blue/Black Impression' 
      : 'Light / Crisp White Background',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = resolveExamPreset(slug);

  return {
    title: `${preset.examName} ${preset.docType} Resizer (Strictly < ${preset.targetKB} KB) - Formilo`,
    description: `Free online ${preset.docType.toLowerCase()} resizer for ${preset.examName} conducted by ${preset.boardName}. Compress strictly between ${preset.minKB} KB to ${preset.targetKB} KB with ${preset.dimensionText}. 100% private in-browser tool.`,
    alternates: {
      canonical: `https://formilo.vercel.app/exam/${preset.slug}`,
    },
    openGraph: {
      title: `${preset.examName} ${preset.docType} Resizer`,
      description: `Format official document strictly under ${preset.targetKB} KB (${preset.dimensionText}) with zero server upload.`,
      type: 'website',
    }
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = resolveExamPreset(slug);

  const relatedFormats = [
    { title: `${preset.examName} Passport Photo`, slug: `${preset.baseSlug}-passport-size-photo-resizer`, sizeText: '< 50 KB' },
    { title: `${preset.examName} Signature Crop & Compress`, slug: `${preset.baseSlug}-signature-crop-compress`, sizeText: '< 20 KB' },
    { title: `${preset.examName} Left Thumb Impression`, slug: `${preset.baseSlug}-left-thumb-impression-resizer`, sizeText: '< 20 KB' },
    { title: `${preset.examName} Postcard Photo (4x6 Inch)`, slug: `${preset.baseSlug}-postcard-size-photo-4x6-resizer`, sizeText: '< 200 KB' },
  ].filter(item => item.slug !== preset.slug);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium overflow-x-auto pb-1">
          <Link href="/" className="hover:text-emerald-400 transition-colors shrink-0">Home</Link>
          <span>/</span>
          <Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors shrink-0">Exam Presets</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold truncate">{preset.examName}</span>
        </nav>

        {/* Header Section */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
            <span>Official Dimension &amp; Size Lock: &lt; {preset.targetKB} KB</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {preset.examName} <span className="text-emerald-400">{preset.docType}</span> Resizer
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            Free online {preset.docType.toLowerCase()} resizer and format compressor for <strong>{preset.examName}</strong> conducted by {preset.boardName}. Automatically locks file size strictly between {preset.minKB} KB to {preset.targetKB} KB ({preset.dimensionText}) in JPG/JPEG format with 100% private in-browser processing.
          </p>
        </div>

        {/* Top Ad Container */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Interactive Resizer Engine */}
        <ExamResizerTool preset={preset} config={preset} />

        {/* Bottom Ad Container */}
        <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
            Sponsored / Advertisement
          </span>
        </div>

        {/* Official Upload Guidelines Specifications */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{preset.examName} Official Upload Guidelines</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Board / Authority</span>
              <p className="font-bold text-white text-xs truncate">{preset.boardName}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Allowed File Size</span>
              <p className="font-bold text-emerald-400 text-xs">{preset.minKB} KB - {preset.targetKB} KB</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Exact Dimensions</span>
              <p className="font-bold text-white text-xs truncate">{preset.width} &times; {preset.height} px</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-black border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500">Resolution &amp; DPI</span>
              <p className="font-bold text-emerald-400 text-xs">{preset.dpi} DPI</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-850 flex items-start gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-zinc-200">Background &amp; Quality Requirement:</p>
              <p>{preset.bgColor}. Make sure candidate facial features or signature strokes are crisp, evenly lit, and free from blur before submitting.</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions & FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>How to Resize for {preset.examName}</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 leading-relaxed">
              <li>Click <strong>&quot;Choose Image&quot;</strong> or drop your document into the box above.</li>
              <li>Use the zoom and alignment slider to frame the document correctly.</li>
              <li>Click <strong>&quot;Generate &amp; Download&quot;</strong> to instantly get your verified file under {preset.targetKB} KB.</li>
            </ol>
          </div>

          <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Server Upload Guarantee</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              All images and documents are processed locally inside your web browser RAM using HTML5 Canvas. No confidential identity documents or personal photographs are ever uploaded to any cloud server.
            </p>
          </div>
        </div>

        {/* Related Exam Format Presets */}
        {relatedFormats.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              RELATED {preset.examName.toUpperCase()} FORMAT PRESETS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedFormats.map((f) => (
                <Link
                  key={f.slug}
                  href={`/exam/${f.slug}`}
                  className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {f.title}
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-400">{f.sizeText}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 group-hover:text-emerald-400 font-medium">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Telegram Community Banner */}
        <TelegramBanner />

      </div>
    </div>
  );
}
