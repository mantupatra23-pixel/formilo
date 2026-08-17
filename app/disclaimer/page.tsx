// app/disclaimer/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer — Formilo',
  description: 'Official non-affiliation disclaimer regarding recruitment boards, examination bodies, and government agencies.',
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white">Disclaimer</h1>
      <p className="text-xs text-zinc-500 mt-1">Last revised: August 2026</p>

      <div className="mt-8 space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">Non-Affiliation Notice</h2>
          <p>
            Formilo is an independent technical utility and is <strong>not affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Institute of Banking Personnel Selection (IBPS), National Testing Agency (NTA), or any other government authority.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">Exam Guidelines Reference</h2>
          <p>
            All exam names, recruitment marks, and portal references are registered trademarks of their respective holders. Use of these names does not imply any affiliation with or endorsement by them.
          </p>
        </section>
      </div>
    </main>
  );
}
