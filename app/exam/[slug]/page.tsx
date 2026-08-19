// app/exam/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TelegramBanner from '@/components/TelegramBanner';
import ExamResizerTool from '@/components/ExamResizerTool';
import { 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft, 
  FileCheck, 
  Cpu, 
  AlertCircle 
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Preset parser helper to support 330+ dynamic exam slugs
function getExamPreset(slug: string) {
  const isSignature = slug.includes('signature') || slug.includes('sign');
  const isThumb = slug.includes('thumb');
  
  const docType = isSignature ? 'Signature' : isThumb ? 'Thumb Impression' : 'Passport Size Photo';
  
  // Format exam name from slug
  const rawName = slug
    .replace(/-(passport-photo|photo|signature|sign|thumb-impression|thumb)$/i, '')
    .replace(/-/g, ' ');
    
  const examName = rawName.toUpperCase();

  // Specs based on standard government guidelines
  const maxKB = isSignature ? 20 : isThumb ? 30 : 50;
  const minKB = isSignature ? 5 : isThumb ? 10 : 20;
  const dimensions = isSignature 
    ? { width: 350, height: 150, aspect: '7:3', cm: '3.5 x 1.5 cm' }
    : { width: 350, height: 450, aspect: '3.5:4.5', cm: '3.5 x 4.5 cm' };

  return {
    slug,
    examName: examName || 'GOVT EXAM',
    docType,
    maxKB,
    minKB,
    dimensions,
    format: 'JPG / JPEG',
    bgColor: isSignature ? 'White Background with Black/Blue Ink' : 'Light / White Background',
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getExamPreset(slug);

  const title = `${preset.examName} ${preset.docType} Resizer (Strictly < ${preset.maxKB} KB)`;
  const description = `Compress and resize ${preset.examName} ${preset.docType} strictly between ${preset.minKB} KB to ${preset.maxKB} KB. 100% private in-browser tool with zero server uploads.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://formilo-jzcl.vercel.app/exam/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://formilo-jzcl.vercel.app/exam/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const preset = getExamPreset(slug);

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${preset.examName} ${preset.docType} Resizer`,
    operatingSystem: 'Any (Web Browser)',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: `Online tool to format and compress ${preset.examName} ${preset.docType} strictly under ${preset.maxKB} KB.`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the required size for ${preset.examName} ${preset.docType}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${preset.docType} must be between ${preset.minKB} KB and ${preset.maxKB} KB in JPG/JPEG format with clear visibility on a clean background.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is my uploaded document stored on Formilo servers?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `No. All compression and cropping are performed 100% locally in your device's browser memory (RAM). Your files never leave your device.`,
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
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Exam Tools</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Local Browser Engine (100% Private)</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-emerald-400 uppercase tracking-wide">
            Official 2026 Format Preset
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {preset.examName} <span className="text-emerald-400">{preset.docType}</span> Resizer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Compress and format your {preset.docType.toLowerCase()} strictly between{' '}
            <span className="text-white font-bold">{preset.minKB} KB – {preset.maxKB} KB</span> according to official notification guidelines.
          </p>
        </div>

        {/* Core Tool Component */}
        <div className="relative">
          <ExamResizerTool preset={preset} />
        </div>

        {/* Telegram Conversion Banner */}
        <TelegramBanner />

        {/* Specification Table */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Required File Specifications for {preset.examName}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 font-medium">Target File Size</span>
              <p className="font-bold text-emerald-400 text-sm">{preset.minKB} KB – {preset.maxKB} KB</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 font-medium">Recommended Dimensions</span>
              <p className="font-bold text-zinc-200 text-sm">{preset.dimensions.cm}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 font-medium">Accepted File Format</span>
              <p className="font-bold text-zinc-200 text-sm">{preset.format}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
              <span className="text-zinc-500 font-medium">Background / Quality</span>
              <p className="font-bold text-zinc-200 text-sm">{preset.bgColor}</p>
            </div>
          </div>
        </div>

        {/* Instructions & Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-400">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>How to Use 1-Click Resizer</span>
            </div>
            <ul className="space-y-2 list-disc list-inside">
              <li>Upload your original photo, signature, or document file.</li>
              <li>Adjust the cropping bounding box to keep the subject centered.</li>
              <li>Set quality slider if you need exact custom KB output.</li>
              <li>Click <b>Download Resized Document</b> to save the verified file.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Rejection Prevention Checklist</span>
            </div>
            <ul className="space-y-2 list-disc list-inside">
              <li>Ensure the face occupies at least 70% of the passport photo frame.</li>
              <li>Signatures must be done on clean white paper using dark blue or black ink.</li>
              <li>Avoid wearing dark glasses, caps, or having heavy shadows across the face.</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-zinc-200">
                Will this document pass the official portal validation?
              </h4>
              <p className="text-zinc-400">
                Yes. Formilo strictly encodes images to standard JPEG MIME formats while enforcing header-level compression under {preset.maxKB} KB to prevent portal rejection.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-zinc-200">
                Is it safe to upload personal ID documents here?
              </h4>
              <p className="text-zinc-400">
                Formilo runs entirely via HTML5 Canvas API inside your browser memory. No images or signatures are sent over the internet or saved to remote databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
