// app/contact/page.tsx
import { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Support — Formilo',
  description: 'Reach out to the Formilo development and support team for tool suggestions or bug reports.',
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white">Get in Touch</h1>
      <p className="mt-2 text-zinc-400 text-sm">
        Have feedback, noticed a bug, or want a custom exam preset added? Let us know.
      </p>

      <div className="mt-8 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-400">Direct Support Email</h3>
            <p className="text-base font-bold text-white mt-0.5">support@formilo.app</p>
            <p className="text-xs text-zinc-500 mt-1">Typical response time: 24 - 48 hours</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-400">Technical Issue Reporting</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Include your device type, browser, and the specific tool name when reporting issues with file conversions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
