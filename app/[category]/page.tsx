import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Sparkles, FileText, Image as ImageIcon, PenTool, GraduationCap } from 'lucide-react';
import { TOOLS, Tool } from '@/lib/tools';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; categoryKey: string; desc: string; icon: any; color: string }> = {
  'photo-tools': {
    title: 'Photo Resize & Formatting Tools',
    categoryKey: 'photo',
    desc: 'Compress and resize photos to exact KB limits (20 KB, 50 KB, 100 KB) and passport dimensions.',
    icon: ImageIcon,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  },
  'pdf-tools': {
    title: 'PDF Converter & Compression Suite',
    categoryKey: 'pdf',
    desc: 'Merge multiple JPGs to PDF, convert PDF pages to high-res JPGs, and compress PDF file size safely in-browser.',
    icon: FileText,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  },
  'signature-tools': {
    title: 'Signature Resize & Enhancer Tools',
    categoryKey: 'signature',
    desc: 'Resize scanned signature photos strictly under 20 KB with crisp white contrast for online application portals.',
    icon: PenTool,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  },
  'image-tools': {
    title: 'Image Format Converters & Modifiers',
    categoryKey: 'image',
    desc: 'Losslessly convert between JPG, PNG, WebP, and HEIC, adjust pixel dimensions, and compress photos.',
    icon: Zap,
    color: 'text-violet-400 border-violet-500/30 bg-violet-500/10'
  },
  'exam-tools': {
    title: 'Government Exam & Portal Presets',
    categoryKey: 'exam',
    desc: 'One-click photo and signature formatting calibrated for SSC, UPSC, IBPS, Railways, Police, and Visa portals.',
    icon: GraduationCap,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  }
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const config = CATEGORY_MAP[category];
  if (!config) return {};

  return {
    title: `${config.title} — Free Online Tools | Formilo`,
    description: config.desc,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const config = CATEGORY_MAP[category];

  if (!config) {
    notFound();
  }

  const categoryTools = TOOLS.filter((tool) => {
    if (config.categoryKey === 'exam') return tool.badge === 'Exam Preset' && tool.enabled;
    return tool.category === config.categoryKey && tool.enabled;
  });

  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation */}
        <nav className="flex items-center text-xs text-zinc-400 gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Tools
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400 font-medium capitalize">{config.title}</span>
        </nav>

        {/* Category Header */}
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${config.color}`}>
            <Icon className="w-4 h-4" /> Category Toolkit
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {config.title}
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            {config.desc}
          </p>
        </div>

        {/* Tools Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white">
              Available Tools ({categoryTools.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative p-5 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-emerald-500/60 transition-all duration-200 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {tool.badge || tool.category}
                    </span>
                    {tool.targetKB && (
                      <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        &lt; {tool.targetKB >= 1000 ? `${tool.targetKB / 1000} MB` : `${tool.targetKB} KB`}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-3 group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {tool.shortDescription || tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <span className="font-semibold">Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
