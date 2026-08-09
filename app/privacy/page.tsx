export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        At Formilo, privacy is a core design requirement. Image and photo processing occurs directly inside your browser memory using HTML5 Canvas APIs.
      </p>
      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Browser-Side Processing</h2>
        <p>Your files are processed in your browser whenever possible and are not uploaded to our server for normal image operations.</p>
      </div>
    </main>
  );
}
