import { TOOLS, ToolCategory } from '@/lib/tools';
import ToolCard from '@/components/tools/ToolCard';
import Link from 'next/link';

interface CategoryViewProps {
  category: ToolCategory;
  title: string;
  description: string;
}

export default function CategoryView({ category, title, description }: CategoryViewProps) {
  const filteredTools = TOOLS.filter((t) => t.category === category && t.enabled);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <nav className="flex items-center text-xs text-slate-500 gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span className="capitalize font-medium text-slate-900 dark:text-white">{category} Tools</span>
      </nav>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </main>
  );
}
