// app/exam/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import examToolsData from '@/data/exam-presets.json';
import UniversalExamToolClient from './UniversalExamToolClient';
import { ShieldCheck, Zap, Sparkles, CheckCircle2, ArrowRight, Share2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return examToolsData.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = examToolsData.find((t) => t.slug === slug);
  if (!tool) return {};

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';
  const url = `${BASE_URL}/exam/${tool.slug}`;

  return {
    title: `${tool.title} — Online Resizer (${tool.targetKB} KB)`,
    description: tool.description,
    keywords: [
      `${tool.examName} photo resize`,
      `${tool.examName} signature resize`,
      `${tool.examName} photo size under ${tool.targetKB}kb`,
      `${tool.examName} dimension format`,
      'online form photo resizer 2026'
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.title} | Formilo`,
      description: tool.description,
      url,
      type: 'website',
    },
  };
}

export default async function ExamToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = examToolsData.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  // Related exam tools for internal linking
  const relatedTools = examToolsData
    .filter((t) => t.examName === tool.examName && t.slug !== tool.slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: tool.description,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the required photo/signature size for ${tool.examName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `According to ${tool.org} official notification, the required file size must be strictly between ${tool.minKB} KB to ${tool.targetKB} KB with dimensions of ${tool.dimensions}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is this ${tool.title} tool safe to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Formilo operates 100% client-side inside your browser. No files or documents are ever uploaded to any server.',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Structured Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link href="/form-tools" className="hover:text-emerald-400">Exam Presets</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold truncate">{tool.examName}</span>
        </nav>

        {/* Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Official Preset Locked: &lt; {tool.targetKB} KB
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {tool.title}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Interactive Client-side Processor Engine */}
        <UniversalExamToolClient tool={tool} />

        {/* Specification Table */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {tool.examName} Official Upload Guidelines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block">Exam Board</span>
              <span className="text-zinc-200 font-bold mt-1 block truncate">{tool.org}</span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block">Max File Size</span>
              <span className="text-emerald-400 font-bold mt-1 block">{tool.targetKB} KB</span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block">Required Dimensions</span>
              <span className="text-zinc-200 font-bold mt-1 block">{tool.dimensions}</span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
              <span className="text-zinc-500 block">Resolution</span>
              <span className="text-zinc-200 font-bold mt-1 block">{tool.dpi} DPI</span>
            </div>
          </div>
        </div>

        {/* Related Exam Tools (Internal SEO Mesh) */}
        {relatedTools.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              Other {tool.examName} Tools
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/exam/${rel.slug}`}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all flex flex-col justify-between group"
                >
                  <p className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400">
                    {rel.title}
                  </p>
                  <span className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
                    Open Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
