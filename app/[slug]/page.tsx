import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOL_REGISTRY, ToolConfig } from '@/config/tools';
import ImageResizeTool from '@/components/tools/ImageResizeTool';
import ToolCard from '@/components/tools/ToolCard';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

const CATEGORY_MAP: Record<string, { title: string; category: string; description: string }> = {
  'photo-tools': {
    title: 'Free Online Photo Tools & Resizers | Formilo',
    category: 'photo',
    description: 'Compress and resize photos to 20 KB, 50 KB, 100 KB, and passport dimensions online for free.',
  },
  'image-tools': {
    title: 'Online Image Tools, Resizer & Compressor | Formilo',
    category: 'image',
    description: 'Free image dimension resizer, quality compressor, and pixel tools.',
  },
  'pdf-tools': {
    title: 'Free PDF Tools, Converters & Compressors | Formilo',
    category: 'pdf',
    description: 'Convert JPG to PDF, extract PDF pages to JPG, and compress PDF files online.',
  },
  'signature-tools': {
    title: 'Online Signature Resizer to 20 KB | Formilo',
    category: 'signature',
    description: 'Resize scanned signature photos for online application forms safely.',
  },
};

export async function generateStaticParams() {
  const toolSlugs = TOOL_REGISTRY.map((tool) => ({ slug: tool.slug }));
  const categorySlugs = Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
  return [...toolSlugs, ...categorySlugs];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = TOOL_REGISTRY.find((t) => t.slug === params.slug && t.enabled);
  
  if (tool) {
    return {
      title: tool.seoTitle,
      description: tool.seoDescription,
      keywords: tool.keywords,
      alternates: { canonical: `${BASE_URL}/${tool.slug}` },
      openGraph: {
        title: tool.seoTitle,
        description: tool.seoDescription,
        url: `${BASE_URL}/${tool.slug}`,
        siteName: 'Formilo',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: tool.seoTitle,
        description: tool.seoDescription,
      },
    };
  }

  const categoryInfo = CATEGORY_MAP[params.slug];
  if (categoryInfo) {
    return {
      title: categoryInfo.title,
      description: categoryInfo.description,
      alternates: { canonical: `${BASE_URL}/${params.slug}` },
    };
  }

  return {};
}

export default function DynamicSlugPage({ params }: PageProps) {
  // 1. Check if the URL slug is a Tool
  const tool = TOOL_REGISTRY.find((t) => t.slug === params.slug && t.enabled);

  if (tool) {
    const relatedTools = TOOL_REGISTRY.filter((t) => tool.relatedTools.includes(t.slug) && t.enabled);

    return (
      <>
        <JsonLd tool={tool} />
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-10">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="capitalize">{tool.category} Tools</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-slate-200 font-medium">{tool.name}</span>
            </nav>

            {/* Hero Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {tool.description}
              </p>
            </div>

            {/* Tool Interface Component */}
            <section className="my-8">
              <ImageResizeTool tool={tool} />
            </section>

            {/* Instructions */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to use {tool.name}
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {tool.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1 leading-relaxed">{step}</li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            {tool.faq && tool.faq.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {tool.faq.map((item, idx) => (
                    <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.question}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.map((relTool) => (
                    <ToolCard key={relTool.slug} tool={relTool} />
                  ))}
                </div>
              </section>
            )}

          </div>
        </main>
      </>
    );
  }

  // 2. Check if the URL slug is a Category Page
  const categoryInfo = CATEGORY_MAP[params.slug];
  if (categoryInfo) {
    const categoryTools = TOOL_REGISTRY.filter((t) => t.category === categoryInfo.category && t.enabled);

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 font-medium capitalize">{categoryInfo.category} Tools</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white capitalize">
              {categoryInfo.category} Tools
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {categoryInfo.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  notFound();
}
