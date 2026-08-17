// app/contact/page.tsx
import { Metadata } from 'next';
import { Mail, MessageSquare, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Support — Formilo',
  description: 'Reach out to the Formilo technical support team for tool suggestions, custom presets, or issue reports.',
};

export default function ContactPage() {
  return (
    <main className="min-h-[80vh] bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Contact & Support</h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Have questions, feedback, or need a specific exam tool preset added? We are here to help.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Direct Email Support</h3>
              <p className="text-sm text-emerald-400 font-mono mt-1 font-semibold">support@formilo.app</p>
              <p className="text-xs text-zinc-400 mt-2">
                Send queries regarding conversion issues, dimension presets, or feature requests.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Turnaround Time</h3>
              <p className="text-sm text-zinc-300 mt-1">Typical response within 24 to 48 business hours.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
