import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TelegramBanner from '@/components/TelegramBanner';
import ExamResizerTool from '@/components/ExamResizerTool';
import PanCardPhotoChecker from '@/components/PanCardPhotoChecker';
import { getToolBySlug } from '@/lib/toolsData';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  Lock,
  HelpCircle,
  Layers
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

// 1. Recursive Slug Sanitizer to Eliminate Corrupted & Nested Suffix Loops
function cleanBaseSlug(raw: string): string {
  let s = String(raw || '').toLowerCase().trim();
  
  const suffixes = [
    '-postcard-photo-4x6-postcard-size-photo-4x6-resizer',
    '-postcard-size-photo-4x6-postcard-size-photo-4x6-resizer',
    '-postcard-photo-4x6-signature-crop-compress',
    '-postcard-photo-4x6-left-thumb-impression-resizer',
    '-postcard-photo-4x6-passport-size-photo-resizer',
    '-postcard-size-photo-4x6-resizer',
    '-postcard-size-photo-4x6',
    '-postcard-size-photo',
    '-postcard-photo-4x6',
    '-postcard-photo',
    '-postcard',
    '-4x6',
    '-passport-size-photo-resizer',
    '-passport-size-photo',
    '-passport-photo-resizer',
    '-passport-photo',
    '-photo-resizer',
    '-photo',
    '-signature-resize-to-20kb-signature-crop-compress',
    '-signature-crop-compress-signature-crop-compress',
    '-signature-crop-compress',
    '-signature-resizer',
    '-signature',
    '-sign-resizer',
    '-sign',
    '-left-left-thumb-impression-resizer',
    '-left-thumb-impression-resizer',
    '-thumb-impression-resizer',
    '-thumb-impression',
    '-left-thumb',
    '-thumb',
    '-handwritten-declaration-resizer',
    '-declaration',
    '-under-20kb',
    '-under-30kb',
    '-under-50kb',
    '-under-100kb',
    '-under-200kb',
    '-20kb',
    '-30kb',
    '-50kb',
    '-100kb',
    '-200kb',
    '-resizer',
  ];

  let matched = true;
  while (matched) {
    matched = false;
    for (const suf of suffixes) {
      if (s.endsWith(suf)) {
        s = s.slice(0, -suf.length);
        matched = true;
      }
    }
  }

  return s.replace(/-(left|postcard|photo|sign|pre)$/gi, '').replace(/^-+|-+$/g, '');
}

// 2. Normalizes Any Malformed URL into the Clean Standard Variant
function getCanonicalNormalizedSlug(rawSlug: string): string {
  const clean = decodeURIComponent(rawSlug || '').toLowerCase().trim();

  if (
    clean === 'pan-card-photo-resizer' || 
    clean === 'pan-card-signature-resizer' || 
    clean === 'signature-resize-to-20kb' || 
    clean === 'nielit-ccc-exam-photo-and-sign-resizer' || 
    clean === 'photo-watermark-remover'
  ) {
    return clean;
  }
  if (clean.includes('pan-card-postcard')) return 'pan-card-photo-resizer';
  if (clean.includes('signature-resize-to-20kb')) return 'signature-resize-to-20kb';

  const base = cleanBaseSlug(clean);
  if (!base) return 'govt-exam-photo-resizer';

  if (clean.includes('thumb')) {
    return `${base}-left-thumb-impression-resizer`;
  }
  if (clean.includes('signature') || clean.includes('sign')) {
    return `${base}-signature-crop-compress`;
  }
  if (clean.includes('postcard') || clean.includes('4x6')) {
    return `${base}-postcard-size-photo-4x6-resizer`;
  }

  return `${base}-passport-size-photo-resizer`;
}

function resolveExamPreset(rawSlug: string): ExamPresetConfig {
  const cleanSlug = getCanonicalNormalizedSlug(rawSlug);
  const matchedTool = getToolBySlug(cleanSlug);

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

  const baseSlug = cleanBaseSlug(cleanSlug);
  const words = (baseSlug || 'Govt Exam').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
  const examName = words.join(' ');

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
  const canonicalSlug = getCanonicalNormalizedSlug(slug);
  const preset = resolveExamPreset(canonicalSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.formilo.in';

  return {
    title: `${preset.examName} ${preset.docType} Resizer (Strictly < ${preset.targetKB} KB) - Formilo`,
    description: `Free online ${preset.docType.toLowerCase()} resizer for ${preset.examName} conducted by ${preset.boardName}. Compress strictly between ${preset.minKB} KB to ${preset.targetKB} KB with ${preset.dimensionText}. 100% private in-browser tool.`,
    alternates: {
      canonical: `${siteUrl}/exam/${canonicalSlug}`,
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
  const canonicalSlug = getCanonicalNormalizedSlug(slug);

  // Auto 301 Permanent Redirect for any duplicate or corrupted slugs
  if (slug !== canonicalSlug) {
    redirect(`/exam/${canonicalSlug}`);
  }

  const preset = resolveExamPreset(canonicalSlug);
  const isPanPhotoTool = preset.slug === 'pan-card-photo-resizer' || preset.slug.includes('pan-card-photo');

  // Automated Google Rich Snippet Schemas (Position 0 & WebApplication)
  const faqSchema = generateFAQSchema({
    toolName: `${preset.examName} ${preset.docType}`,
    slug: `/exam/${canonicalSlug}`,
    targetKB: preset.targetKB,
    dimensions: preset.dimensionText,
    description: `Official ${preset.docType.toLowerCase()} resizer and format compressor for ${preset.examName}.`
  });

  const appSchema = generateAppSchema({
    toolName: `${preset.examName} ${preset.docType} Resizer`,
    slug: `/exam/${canonicalSlug}`,
    description: `Format official document strictly under ${preset.targetKB} KB (${preset.dimensionText}) with zero server upload.`
  });

  const relatedFormats = [
    { title: `${preset.examName} Passport Photo`, slug: `${preset.baseSlug}-passport-size-photo-resizer`, sizeText: '< 50 KB', badge: 'EXAM' },
    { title: `${preset.examName} Signature Crop & Compress`, slug: `${preset.baseSlug}-signature-crop-compress`, sizeText: '< 20 KB', badge: 'SIGN' },
    { title: `${preset.examName} Left Thumb Impression`, slug: `${preset.baseSlug}-left-thumb-impression-resizer`, sizeText: '< 20 KB', badge: 'THUMB' },
    { title: `${preset.examName} Postcard Photo (4x6 Inch)`, slug: `${preset.baseSlug}-postcard-size-photo-4x6-resizer`, sizeText: '< 200 KB', badge: '< 200 KB' },
  ].filter(item => item.slug !== preset.slug);

  const faqList = [
    {
      q: `What is the official photo & signature file size limit for ${preset.examName}?`,
      a: `For ${preset.examName}, the allowed file size for ${preset.docType.toLowerCase()} is strictly between ${preset.minKB} KB and ${preset.targetKB} KB in JPG/JPEG format with exact dimensions of ${preset.dimensionText}.`
    },
    {
      q: `Will resizing my photo or signature reduce image clarity or cause rejection?`,
      a: `No. Formilo uses high-precision bi-cubic step-down downscaling and dynamic quality locking to ensure facial features and ink strokes remain razor sharp while staying strictly under ${preset.targetKB} KB.`
    },
    {
      q: `Is my personal identity document or photo uploaded to any server?`,
      a: `No. All cropping, aspect framing, and JPEG compression algorithms run 100% locally inside your device RAM using client-side HTML5 Canvas. Zero data is sent to external servers.`
    }
  ];

  return (
    <>
      {/* Structured Google Search JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <main className="w-full min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* 1. Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium overflow-x-auto pb-1">
            <Link href="/" className="hover:text-emerald-400 transition-colors shrink-0">Home</Link>
            <span>/</span>
            <Link href="/#exam-presets" className="hover:text-emerald-400 transition-colors shrink-0">Exam Presets</Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold truncate">{preset.examName}</span>
          </nav>

          {/* 2. Header Section with Spec Badge */}
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

          {/* 3. Top Ad Container */}
          <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
              Sponsored / Advertisement
            </span>
          </div>

          {/* 4. Interactive Tool Box */}
          {isPanPhotoTool ? (
            <PanCardPhotoChecker />
          ) : (
            <ExamResizerTool preset={preset} config={preset} />
          )}

          {/* 5. Bottom Ad Container */}
          <div className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-center p-4">
            <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
              Sponsored / Advertisement
            </span>
          </div>

          {/* 6. Official Upload Guidelines Specifications (4-Box Grid) */}
          <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4 shadow-xl">
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

            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-855 flex items-start gap-3 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Background &amp; Quality Requirement:</p>
                <p>{preset.bgColor}. Ensure candidate facial features or signature strokes are crisp, evenly lit, and free from blur before submitting.</p>
              </div>
            </div>
          </div>

          {/* 7. Step-by-Step Instructions & Privacy Guarantee (2-Box Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>How to Resize for {preset.examName}</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400 leading-relaxed">
                <li>Tap <strong>&quot;Choose Document&quot;</strong> and select your photo or signature.</li>
                <li>Use the zoom and directional alignment controls to center your subject.</li>
                <li>Click <strong>&quot;Download Verified Document&quot;</strong> to get your compliant file under {preset.targetKB} KB.</li>
              </ol>
            </div>

            <div className="p-5 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Zero Server Upload Guarantee</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                All images and documents are processed locally inside your web browser RAM using HTML5 Canvas. No confidential identity documents or personal photographs are ever uploaded or stored on any server.
              </p>
            </div>
          </div>

          {/* 8. Related Format Presets */}
          {relatedFormats.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  RELATED {preset.examName.toUpperCase()} FORMAT PRESETS
                </h3>
                <span className="text-xs text-zinc-500 font-mono">Quick Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedFormats.map((f) => (
                  <Link
                    key={f.slug}
                    href={`/exam/${f.slug}`}
                    className="p-4 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {f.badge}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {f.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-850 text-xs">
                      <span className="font-mono text-emerald-400 text-[11px] font-bold">{f.sizeText}</span>
                      <span className="text-zinc-400 group-hover:text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 9. Frequently Asked Questions Section */}
          <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Frequently Asked Questions</span>
            </div>

            <div className="space-y-3 text-xs text-zinc-400">
              {faqList.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-black border border-zinc-850 space-y-1">
                  <p className="font-bold text-white text-[13px]">{faq.q}</p>
                  <p className="leading-relaxed text-zinc-400 text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Telegram Conversion Banner */}
          <TelegramBanner />

        </div>
      </main>
    </>
  );
}
