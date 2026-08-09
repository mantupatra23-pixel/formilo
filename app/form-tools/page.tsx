import Link from 'next/link';

export default function FormToolsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Form Utilities</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        Form utility generators are currently in active development.
      </p>
      <div className="p-6 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Status</span>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Coming Soon</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Form generators (HTML Form Builder, Contact Form Generator) will be available in the next release.
        </p>
        <Link href="/" className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline">
          ← Back to Available Tools
        </Link>
      </div>
    </main>
  );
}
