// app/privacy/page.tsx
import { Metadata } from 'next';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Formilo',
  description: 'Formilo client-side privacy policy and data security disclosures.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[80vh] bg-[#09090b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy First Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-zinc-400 mt-1">Last Updated: August 2026</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" /> 1. Zero Server-Side File Storage
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Formilo operates entirely client-side. When you resize a photo, crop a signature, or convert a PDF, all operations are executed strictly within your web browser using HTML5 Canvas and JavaScript. No document or image is ever uploaded to or stored on our servers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-400" /> 2. Anonymous Telemetry & Analytics
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We may collect standard, non-personally identifiable diagnostic information (such as browser version, page load performance, and error crash logs) to maintain tool reliability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            <h2 className="text-lg font-bold text-white">3. Third-Party Advertising & Cookies</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We partner with third-party advertising networks like Google AdSense. These networks may use cookies to serve relevant advertisements based on prior visits. Users can manage personalized ad preferences via Google Ad Settings.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
