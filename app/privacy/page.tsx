// app/privacy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Formilo',
  description: 'Formilo privacy policy detailing zero-storage client-side operations and third-party advertising disclosures.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 prose prose-invert">
      <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      <p className="text-xs text-zinc-500">Last updated: August 2026</p>

      <div className="mt-8 space-y-6 text-sm text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Zero Server-Side File Storage</h2>
          <p>
            Formilo processes all uploaded images, PDFs, signatures, and government documents strictly on the client side inside your web browser engine. Your files are never transmitted, saved, or analyzed on remote backend servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Analytics & Cookies</h2>
          <p>
            We may use anonymous telemetry tools to measure general site traffic, page load performance, and error frequencies. These metrics do not collect or correlate personally identifiable information (PII).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Third-Party Advertising & AdSense</h2>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on prior visits to this and other websites. Users may opt out of personalized advertising by visiting Google's Ad Settings.
          </p>
        </section>
      </div>
    </main>
  );
}
