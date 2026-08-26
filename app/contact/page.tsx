// app/contact/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Clock, ShieldCheck, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Support — Formilo',
  description: 'Have questions, feedback, or need a specific exam preset tool added? Contact the Formilo support team.',
  alternates: {
    canonical: 'https://www.formilo.in/contact',
  },
};

export default function ContactPage() {
  const contactEmail = 'formilohelp@gmail.com';

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">Contact & Support</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Fast Candidate & User Helpdesk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Have questions, feedback, bug reports, or need a specific government exam preset added? We are here to help.
          </p>
        </div>

        {/* Support Cards Grid */}
        <div className="space-y-4">
          {/* Direct Email Card */}
          <a
            href={`mailto:${contactEmail}`}
            className="group block p-6 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-emerald-500/60 transition-all shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Direct Email Support
                </h3>
                <p className="text-emerald-400 font-mono font-semibold text-sm">
                  {contactEmail}
                </p>
                <p className="text-xs text-zinc-400 pt-1">
                  Send queries regarding file compression, new exam requests, or AdSense/partnership inquiries.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 self-center" />
            </div>
          </a>

          {/* Turnaround Time Card */}
          <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Turnaround Time
                </h3>
                <p className="text-xs text-zinc-400">
                  Typical response time is within <strong className="text-zinc-200">24 to 48 business hours</strong>. For urgent exam portal fixes, please mention the exam name in the subject line.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="p-6 rounded-2xl bg-[#121215] border border-zinc-800 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Privacy & Data Inquiries
                </h3>
                <p className="text-xs text-zinc-400">
                  Formilo processes all photos and PDFs client-side in your browser memory. We never store, collect, or upload your private certificates or identity photos.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
