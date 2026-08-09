import Link from 'next/link';
import { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool | any;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {tool.name}
        </h3>
        <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full capitalize font-medium">
          {tool.category}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
        {tool.shortDescription || tool.description}
      </p>
      <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400">
        Use Tool
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
