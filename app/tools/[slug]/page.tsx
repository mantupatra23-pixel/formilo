// app/tools/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

import { TOOLS, getToolBySlug } from '@/lib/tools';
import ImageResizeTool from '@/components/tools/ImageResizeTool';
import JpgToPdfTool from '@/components/tools/JpgToPdfTool';
import PdfToJpgTool from '@/components/tools/PdfToJpgTool';
import PdfCompressorTool from '@/components/tools/PdfCompressorTool';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = tool.seoTitle || `${tool.name} — Free Online Tool | Formilo`;
  const description = tool.seoDescription || tool.description;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/tools/${tool.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/tools/${tool.slug}`,
      siteName: 'Formilo',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DynamicToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const rawSlug = (slug || '').toLowerCase().trim();
  const toolSlug = (tool.slug || '').toLowerCase().trim();

  const isJpgToPdf = rawSlug === 'jpg-to-pdf' || toolSlug === 'jpg-to-pdf' || toolSlug === 'jpg-to-pdf-converter' || toolSlug.includes('to-pdf');
  const isPdfToJpg = rawSlug === 'pdf-to-jpg' || toolSlug === 'pdf-to-jpg' || toolSlug === 'pdf-to-jpg-converter' || toolSlug === 'pdf-to-png';
  const isPdfCompressor = rawSlug === 'pdf-compressor' || toolSlug.includes('pdf-compress');

  const relatedTools = TOOLS.filter(
    (t) => Array.isArray(tool.relatedTools) && tool.relatedTools.includes(t.slug) && t.enabled
  ).slice(0, 6);

  const toolProps: any = {
    ...tool,
    title: tool.name,
    toolType: isJpgToPdf ? 'jpg-to-pdf' : 'image-target-kb',
    icon: tool.icon || 'ImageIcon',
    keywords: tool.keywords || [],
    acceptedMime: tool.acceptedMime || ['image/jpeg', 'image/png', 'image/webp'],
  };

  const renderToolWorkspace = () => {
    if (isJpgToPdf) return <JpgToPdfTool />;
    if (isPdfToJpg) return <PdfToJpgTool />;
    if (isPdfCompressor) return <PdfCompressorTool />;
    return <ImageResizeTool tool={toolProps} />;
  };

  // ── JSON-LD STRUCTURED DATA SCHEMAS FOR GOOGLE ─────────────────────────────
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'url': `${BASE_URL}/tools/${tool.slug}`,
    'description': tool.description,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires HTML5 Canvas and WASM support',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': tool.category ? `${tool.category.toUpperCase()} Tools` : 'Tools',
        'item': `${BASE_URL}/${tool.category ? `${tool.category}-tools` : 'tools'}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': `${BASE_URL}/tools/${tool.slug}`
      }
    ]
  };

  const faqSchema = tool.faq && tool.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': tool.faq.map((item) => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      {/* Google SEO JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-emerald-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex flex-wrap items-center text-xs text-zinc-400 gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href={`/${tool.category ? `${tool.category}-tools` : 'photo-tools'}`} className="hover:text-emerald-400 transition-colors capitalize">
            {tool.category || 'Tools'}
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400 font-medium">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> {tool.badge || tool.category || 'Tool'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {tool.name}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
            {tool.description}
          </p>
        </div>

        {/* Processing Workspace */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-8 backdrop-blur-md shadow-2xl">
          {renderToolWorkspace()}

          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-wrap gap-6 justify-center text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-4 h-4" /> 100% Client-Side Processing
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Files never leave your browser
            </div>
          </div>
        </section>

        {/* How to use */}
        {tool.instructions && tool.instructions.length > 0 && (
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              How to use {tool.name}
            </h2>
            <ol className="list-decimal list-inside space-y-2.5 text-sm text-zinc-300">
              {tool.instructions.map((step, idx) => (
                <li key={idx} className="pl-1 leading-relaxed">
                  <span className="text-zinc-200">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* FAQs */}
        {tool.faq && tool.faq.length > 0 && (
          <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 divide-y divide-zinc-800">
              {tool.faq.map((item, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                  <h3 className="text-sm font-semibold text-zinc-100">{item.question}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Related Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <Link
                  key={relTool.slug}
                  href={`/tools/${relTool.slug}`}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/50 transition-colors block"
                >
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{relTool.category}</span>
                  <h4 className="text-sm font-bold text-white mt-1">{relTool.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{relTool.shortDescription || relTool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
