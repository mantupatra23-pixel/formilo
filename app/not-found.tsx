import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-4xl">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
        The tool or page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
        >
          Back to Home
        </Link>
        <Link
          href="/tools"
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm transition"
        >
          Browse All Tools
        </Link>
      </div>
    </main>
  );
}
