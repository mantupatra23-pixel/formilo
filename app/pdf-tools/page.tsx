import { TOOL_REGISTRY } from '@/config/tools';
import ToolCard from '@/components/tools/ToolCard';

export default function PdfToolsPage() {
  const tools = TOOL_REGISTRY.filter((t) => t.category === 'pdf' && t.enabled);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">PDF Tools</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm">Convert images to PDF, extract pages, and optimize PDF documents.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </main>
  );
}
