// app/terms/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Formilo',
  description: 'Terms and conditions governing the use of Formilo client-side formatting tools.',
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      <p className="text-xs text-zinc-500 mt-1">Effective Date: August 2026</p>

      <div className="mt-8 space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Use of Services</h2>
          <p>
            By accessing Formilo, you agree to use our client-side tools exclusively for lawful document preparation and file formatting tasks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Accuracy & Responsibility</h2>
          <p>
            While Formilo implements strict compliance filters based on official government portal guidelines, candidates are ultimately responsible for verifying final dimensions, file sizes, and clarity before submission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Intellectual Property</h2>
          <p>
            The software design, interfaces, and proprietary compression algorithms of Formilo are protected under intellectual property laws. Users maintain complete ownership over any files they process locally.
          </p>
        </section>
      </div>
    </main>
  );
}
