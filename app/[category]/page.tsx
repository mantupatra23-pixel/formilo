// app/[category]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, Zap, FileText, Image as ImageIcon, 
  PenTool, GraduationCap, RefreshCw, CheckCircle2, ShieldCheck, Search
} from 'lucide-react';
import { TOOLS, Tool } from '@/lib/tools';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, { 
  title: string; 
  categoryKey: string; 
  desc: string; 
  icon: any; 
  color: string;
  badgeBg: string;
  glowColor: string;
}> = {
  'photo-tools': {
    title: 'Photo Resize & Formatting Tools',
    categoryKey: 'photo',
    desc: 'Compress and resize photos strictly under exact KB limits (20 KB, 50 KB, 100 KB) and official passport dimensions.',
    icon: ImageIcon,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glowColor: 'bg-emerald-500/10'
  },
  'pdf-tools': {
    title: 'PDF Converter & Compression Suite',
    categoryKey: 'pdf',
    desc: 'Merge multiple images to PDF, convert PDF pages to high-resolution JPGs, and compress PDF documents safely in your browser.',
    icon: FileText,
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    glowColor: 'bg-rose-500/10'
  },
  'signature-tools': {
    title: 'Signature Resize & Cleaners',
    categoryKey: 'signature',
    desc: 'Resize scanned signatures strictly under 20 KB with crisp white contrast and transparent background tools.',
    icon: PenTool,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glowColor: 'bg-cyan-500/10'
  },
  'image-tools': {
    title: 'Image Format Converters & Modifiers',
    categoryKey: 'image',
    desc: 'Losslessly convert between JPG, PNG, WebP, and HEIC, adjust pixel dimensions, and optimize images without quality loss.',
    icon: RefreshCw,
    color: 'text-violet-400 border-violet-500/40 bg-violet-500/10',
    badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    glowColor: 'bg-violet-500/10'
  },
  'form-tools': {
    title: 'Government Exam & Portal Presets',
    categoryKey: 'form',
    desc: 'One-click application presets calibrated for SSC, UPSC, IBPS, Railways, State Police, NEET, and Visa portals.',
    icon: GraduationCap,
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glowColor: 'bg-amber-500/10'
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
    if (config.categoryKey === 'form') return tool.badge === 'Exam Preset' && tool.enabled;
    if (config.categoryKey === 'photo') return (tool.category === 'photo' || tool.badge === 'Exam Preset') && tool.enabled;
    return tool.category === config.categoryKey && tool.enabled;
  });

  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-black">
      {/* Mesh Ambient Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] ${config.glowColor} blur-[140px] pointer-events-none -z-10`} />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center text-xs text-zinc-400 gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Tools
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400 font-semibold">{config.title}</span>
        </nav>

        {/* Category Header */}
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${config.color}`}>
            <Icon className="w-4 h-4" /> Category Suite
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {config.title}
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            {config.desc}
          </p>
        </div>

        {/* Tools Grid Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Available Tools ({categoryTools.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => (
              <CategoryToolCard key={tool.slug} tool={tool} defaultColor={config.badgeBg} />
            ))}
          </div>
        </section>

        {/* Privacy Note */}
        <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side Processing • Your documents never leave your browser</span>
        </div>

      </div>
    </main>
  );
}

// ── HIGH-CONTRAST DARK CARD COMPONENT ────────────────────────────────────────
function CategoryToolCard({ tool, defaultColor }: { tool: Tool; defaultColor: string }) {
  const isExam = tool.badge === 'Exam Preset';

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative p-5 rounded-2xl bg-[#121215] border-2 border-zinc-800 hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
            isExam ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : defaultColor
          }`}>
            {isExam ? 'Exam Preset' : tool.category}
          </span>

          {tool.targetKB && (
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-zinc-800 text-white border border-zinc-700">
              &lt; {tool.targetKB >= 1000 ? `${tool.targetKB / 1000} MB` : `${tool.targetKB} KB`}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white mt-3.5 group-hover:text-emerald-400 transition-colors leading-snug">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDescription || tool.description}
        </p>

        {/* Target Dimensions */}
        {(tool.targetWidth && tool.targetHeight) && (
          <div className="mt-3 inline-flex items-center text-[10px] font-semibold text-zinc-300 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700/70">
            Dimensions: {tool.targetWidth} × {tool.targetHeight} px
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
        <span>Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
