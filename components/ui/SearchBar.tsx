'use client';

import React, { useState } from 'react';
import { TOOL_REGISTRY, ToolConfig } from '@/config/tools';
import ToolCard from '@/components/tools/ToolCard';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const filteredTools = query.trim() === ''
    ? []
    : TOOL_REGISTRY.filter((tool) => {
        const q = query.toLowerCase();
        return (
          tool.enabled &&
          (tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.keywords.some((k) => k.toLowerCase().includes(q)))
        );
      });

  return (
    <div className="w-full max-w-2xl mx-auto relative space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools... (e.g. 20 kb, pdf, signature)"
          className="w-full py-3.5 pl-11 pr-4 text-sm sm:text-base rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <svg
          className="w-5 h-5 absolute left-4 top-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 0 0114 0z" />
        </svg>
      </div>

      {/* Live Search Results */}
      {query.trim() !== '' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Search Results ({filteredTools.length})
          </p>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-2">
              No tools matching &quot;{query}&quot; found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
