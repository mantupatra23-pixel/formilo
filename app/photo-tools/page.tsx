import { TOOLS } from '@/lib/tools';
import ToolCard from '@/components/tools/ToolCard';

export default function PhotoToolsPage() {
  const tools = TOOLS.filter((t) => t.category === 'photo' && t.enabled);
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Photo Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </main>
  );
}
