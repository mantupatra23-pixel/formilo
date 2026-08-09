export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        At Formilo, privacy is a fundamental design requirement. Most image and photo tools process your files directly inside your browser memory using JavaScript and Web APIs.
      </p>
      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. File Processing</h2>
        <p>Your files are processed in your browser whenever possible and are not uploaded to our server for normal processing.</p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Analytics</h2>
        <p>We may use anonymous telemetry to track basic operational metrics (e.g. usage count) without ever logging or storing your file data.</p>
      </div>
    </main>
  );
}
