import { TOOL_REGISTRY } from '@/config/tools';
import ToolCard from '@/components/tools/ToolCard';
import SearchBar from '@/components/ui/SearchBar';

export default function AllToolsPage() {
  const activeTools = TOOL_REGISTRY.filter((t) => t.enabled);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">All Online Utilities</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
          Browse our complete library of free photo, image, PDF, and form tools.
        </p>
      </div>

      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </main>
  );
}
