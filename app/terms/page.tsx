// app/terms/page.tsx
import { Metadata } from 'next';
import { FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — Formilo',
  description: 'Terms and conditions governing the usage of Formilo browser formatting tools.',
};

export default function TermsPage() {
  return (
    <main className="min-h-[80vh] bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-zinc-400 mt-1">Effective Date: August 2026</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              By accessing and using Formilo, you accept and agree to be bound by these terms. If you disagree with any part, you may discontinue use of the platform.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white">2. User Responsibility</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Formilo provides conversion presets matching common examination board guidelines. However, users are strictly responsible for verifying final file clarity, dimensions, and size before official portal submissions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white">3. Service Availability</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Formilo tools are provided on an "as is" and "as available" basis without warranties of any kind. We reserve the right to improve, modify, or update tool presets at any time.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
