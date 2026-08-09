import Link from 'next/link';
import { TOOL_REGISTRY } from '@/config/tools';
import ToolCard from '@/components/tools/ToolCard';
import SearchBar from '@/components/ui/SearchBar';

export default function HomePage() {
  const popularSlugs = [
    'photo-resize-20kb',
    'photo-resize-50kb',
    'photo-resize-100kb',
    'signature-resize-20kb',
    'image-compressor',
    'jpg-to-pdf',
    'pdf-to-jpg',
  ];

  const popularTools = TOOL_REGISTRY.filter((t) => popularSlugs.includes(t.slug) && t.enabled);
  const photoTools = TOOL_REGISTRY.filter((t) => t.category === 'photo' && t.enabled);
  const pdfTools = TOOL_REGISTRY.filter((t) => t.category === 'pdf' && t.enabled);
  const imageTools = TOOL_REGISTRY.filter((t) => t.category === 'image' && t.enabled);
  const signatureTools = TOOL_REGISTRY.filter((t) => t.category === 'signature' && t.enabled);

  return (
    <main className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12">
        <span className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
          Free Tools. Instant Results.
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Free Online Tools for Photos, PDFs &amp; Forms
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Resize, compress, convert and prepare your files for online applications quickly and privately in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="#popular-tools"
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition shadow-sm text-center"
          >
            Start Using Tools
          </a>
          <a
            href="#all-tools"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm transition text-center"
          >
            Browse All Tools
          </a>
        </div>

        {/* Global Search Component */}
        <div className="pt-6">
          <SearchBar />
        </div>
      </section>

      {/* Popular Tools Section */}
      <section id="popular-tools" className="space-y-6 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Photo Tools Section */}
      <section id="all-tools" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Photo Tools</h2>
          <Link href="/photo-tools" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photoTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">PDF Tools</h2>
          <Link href="/pdf-tools" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Image & Signature Tools Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Image &amp; Signature Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...imageTools, ...signatureTools].map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Why Formilo Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Why Formilo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Instant Results</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No signup required. Upload, process, and download your files in seconds.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
              🔒
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Client-Side Privacy</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your files are processed directly inside your browser whenever possible without uploading private photos to servers.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              📱
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mobile Optimized</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed specifically for seamless use on smartphones, tablets, and desktop displays.
            </p>
          </div>
        </div>
      </section>

      {/* Homepage FAQ Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Is Formilo completely free?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, all online tools provided on Formilo are free to use without any account registration.
            </p>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Are my uploaded documents safe?</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. Image and photo tools execute locally in your browser memory using HTML5 Canvas APIs.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
