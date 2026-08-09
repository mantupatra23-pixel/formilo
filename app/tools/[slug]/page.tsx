import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOL_REGISTRY } from '@/config/tools';
import ImageResizeTool from '@/components/tools/ImageResizeTool';
import ToolCard from '@/components/tools/ToolCard';
import JsonLd from '@/components/seo/JsonLd';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export async function generateStaticParams() {
  return TOOL_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = TOOL_REGISTRY.find((t) => t.slug === params.slug && t.enabled);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: { canonical: `${BASE_URL}/tools/${tool.slug}` },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `${BASE_URL}/tools/${tool.slug}`,
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

export default function DynamicToolPage({ params }: PageProps) {
  const tool = TOOL_REGISTRY.find((t) => t.slug === params.slug && t.enabled);

  if (!tool) {
    notFound();
  }

  const relatedTools = TOOL_REGISTRY.filter(
    (t) => tool.relatedTools.includes(t.slug) && t.enabled
  );

  return (
    <>
      <JsonLd tool={tool} />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:underline">Tools</Link>
            <span>/</span>
            <span className="capitalize">{tool.category}</span>
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

          {/* Dynamic Tool Component */}
          <section className="my-8">
            <ImageResizeTool tool={tool} />
          </section>

          {/* Step-by-Step Instructions */}
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
