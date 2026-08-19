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
  ArrowLeft, 
  Cpu 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ExamPresetConfig {
  slug: string;
  examName: string;
  docType: string;
  maxKB: number;
  minKB: number;
  dimensions: { width: number; height: number; aspect: string; cm: string; dpi?: number };
  format: string;
  bgColor: string;
  metaTitle: string;
  metaDesc: string;
}

function getExamPreset(slug: string): ExamPresetConfig {
  const lower = (slug || '').toLowerCase();

  // 1. PAN Card (NSDL / UTIITSL) Photo
  if (lower.includes('pan') && (lower.includes('photo') || lower.includes('nsdl') || lower.includes('utiitsl')) && !lower.includes('sign')) {
    return {
      slug,
      examName: 'PAN Card (NSDL / UTIITSL)',
      docType: 'Passport Photo (213 x 213 px)',
      maxKB: 50,
      minKB: 15,
      dimensions: { width: 213, height: 213, aspect: '1:1', cm: '2.5 x 3.5 cm (213x213 px)', dpi: 300 },
      format: 'JPG / JPEG (300 DPI)',
      bgColor: 'Clean Light / White Background',
      metaTitle: 'PAN Card Photo Resizer 213x213 px (Under 50 KB) — NSDL / UTIITSL Free',
      metaDesc: 'Resize and crop photo for PAN card online application to exact 213x213 pixels, 300 DPI, and strictly under 50 KB. 100% private in-browser tool.',
    };
  }

  // 2. PAN Card Signature
  if (lower.includes('pan') && (lower.includes('signature') || lower.includes('sign'))) {
    return {
      slug,
      examName: 'PAN Card (NSDL / UTIITSL)',
      docType: 'Signature (400 x 200 px)',
      maxKB: 30,
      minKB: 10,
      dimensions: { width: 400, height: 200, aspect: '2:1', cm: '2 x 4.5 cm (400x200 px)', dpi: 300 },
      format: 'JPG / JPEG (300 DPI)',
      bgColor: 'Pure White Background with Black Ink',
      metaTitle: 'PAN Card Signature Resizer (Under 30 KB / 300 DPI) — NSDL Free',
      metaDesc: 'Format PAN card signature to exact 400x200 px / 300 DPI and under 30 KB for NSDL & UTIITSL form upload.',
    };
  }

  // 3. NIELIT CCC Exam Photo & Signature
  if (lower.includes('ccc') || lower.includes('nielit')) {
    const isSign = lower.includes('sign');
    return {
      slug,
      examName: 'NIELIT CCC Exam',
      docType: isSign ? 'Signature (170 x 132 px)' : 'Passport Photo (132 x 170 px)',
      maxKB: 20,
      minKB: 10,
      dimensions: isSign 
        ? { width: 170, height: 132, aspect: '170:132', cm: '170 x 132 px' }
        : { width: 132, height: 170, aspect: '132:170', cm: '132 x 170 px' },
      format: 'JPG / JPEG',
      bgColor: isSign ? 'White Paper with Black/Blue Ink' : 'Light / White Background',
      metaTitle: `NIELIT CCC ${isSign ? 'Signature' : 'Photo'} Resizer (10 KB – 20 KB) Online`,
      metaDesc: `Compress CCC examination form ${isSign ? 'signature' : 'photo'} strictly between 10 KB to 20 KB with correct pixel dimensions.`,
    };
  }

  // 4. Default Govt Exam Logic (SSC, UPSC, Railway, State Police, Banking)
  const isSignature = lower.includes('signature') || lower.includes('sign');
  const isThumb = lower.includes('thumb');
  const docType = isSignature ? 'Signature' : isThumb ? 'Thumb Impression' : 'Passport Size Photo';
  
  const rawName = lower
    .replace(/-(passport-photo|photo|signature|sign|thumb-impression|thumb)$/i, '')
    .replace(/-/g, ' ');
    
  const examName = rawName.toUpperCase() || 'GOVT EXAM';
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
    bgColor: isSignature ? 'Clean White Background with Dark Ink' : 'Light / White Background',
    metaTitle: `${examName} ${docType} Resizer (Strictly < ${maxKB} KB) — 100% Free`,
    metaDesc: `Compress and resize ${examName} ${docType} strictly between ${minKB} KB to ${maxKB} KB without losing quality. In-browser private processing.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  return {
    title: preset.metaTitle,
    description: preset.metaDesc,
    alternates: {
      canonical: `https://formilo-jzcl.vercel.app/exam/${slug}`,
    },
    openGraph: {
      title: preset.metaTitle,
      description: preset.metaDesc,
      url: `https://formilo-jzcl.vercel.app/exam/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: preset.metaTitle,
      description: preset.metaDesc,
    },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: preset.metaTitle,
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: preset.metaDesc,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the required format for ${preset.examName} ${preset.docType}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The file must be in ${preset.format} format, sized between ${preset.minKB} KB and ${preset.maxKB} KB with dimensions of ${preset.dimensions.cm}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Are documents uploaded to a remote server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Formilo processes everything locally in RAM via HTML5 Canvas. Your ID cards, photos, and signatures never leave your device.',
        },
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Breadcrumb */}
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

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 uppercase">
            Official 2026 Preset
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            {preset.examName} <span className="text-emerald-400">{preset.docType}</span> Resizer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Compress strictly between <span className="text-white font-bold">{preset.minKB} KB – {preset.maxKB} KB</span> ({preset.dimensions.cm}) for 100% error-free form submission.
          </p>
        </div>

        {/* Resizer Tool Component */}
        <ExamResizerTool preset={preset} />

        {/* Telegram Conversion Banner */}
        <TelegramBanner />

        {/* Guidelines Specifications */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Portal Guidelines for {preset.examName}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">File Size Limit</span>
              <p className="font-bold text-emerald-400">{preset.minKB} KB – {preset.maxKB} KB</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Resolution / Dimensions</span>
              <p className="font-bold text-zinc-200">{preset.dimensions.cm}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Output Format</span>
              <p className="font-bold text-zinc-200">{preset.format}</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-zinc-500">Required Background</span>
              <p className="font-bold text-zinc-200">{preset.bgColor}</p>
            </div>
          </div>
        </div>

        {/* Rejection Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>How to Download</span>
            </div>
            <ul className="space-y-2 list-disc list-inside">
              <li>Upload image from phone or computer.</li>
              <li>Auto-crop sets the exact required aspect ratio automatically.</li>
              <li>Fine-tune the compression quality slider if needed.</li>
              <li>Click Download to save the portal-ready file.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Important Rejection Checks</span>
            </div>
            <ul className="space-y-2 list-disc list-inside">
              <li>For PAN NSDL forms, enforce exact 213x213 resolution.</li>
              <li>Signatures must have high contrast without mobile camera shadow.</li>
              <li>Face must be straight and clearly visible without glare.</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-bold text-zinc-200">Will this document pass the official portal validation?</p>
              <p className="text-zinc-400">Yes. Formilo strictly matches the required MIME type, dimensions, and file size limits specified in government notifications.</p>
            </div>
            <div>
              <p className="font-bold text-zinc-200">Are my files saved on your servers?</p>
              <p className="text-zinc-400">No. Processing takes place directly inside your device's browser memory (RAM) with zero network uploads.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
