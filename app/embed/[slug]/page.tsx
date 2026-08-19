// app/embed/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import examToolsData from '@/data/exam-presets.json';
import UniversalExamToolClient from '@/app/exam/[slug]/UniversalExamToolClient';
import { ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return examToolsData.map((item) => ({ slug: item.slug }));
}

export default async function EmbedToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = examToolsData.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {tool.examName} Official Preset
            </span>
            <h1 className="text-base font-bold text-white">{tool.title}</h1>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono font-bold">
            &lt; {tool.targetKB} KB
          </span>
        </div>

        <UniversalExamToolClient tool={tool} />
      </div>

      {/* Mandatory Dofollow SEO Backlink Strip */}
      <footer className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span>100% Client-Side Private Tool</span>
        <Link
          href={`https://formilo-jzcl.vercel.app/exam/${tool.slug}`}
          target="_blank"
          rel="dofollow"
          className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
        >
          Powered by Formilo <ExternalLink className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
