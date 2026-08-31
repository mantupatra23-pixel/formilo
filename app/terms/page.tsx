import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Formilo',
  description: 'Terms and Conditions for using Formilo document and photo preparation tools.',
  alternates: {
    canonical: 'https://www.formilo.in/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] transition">Home</Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">Terms of Service</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-[12px] text-[#66777D] font-mono">Effective Date: August 2026</p>
        </div>

        {/* Body */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-card text-[13.5px] text-[#53636A] leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Formilo (https://www.formilo.in), you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">2. Use of Online Tools</h2>
            <p>
              Formilo provides free browser-based tools to help users format, resize, compress, and convert photos, signatures, and document files. You agree to use these tools only for lawful purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">3. User Responsibility &amp; Verification</h2>
            <p>
              While Formilo strives to keep all exam dimensions and KB limits updated according to official exam notifications, guidelines can change. Users are solely responsible for verifying their resized documents with the official recruitment board instructions prior to submission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">4. Disclaimer of Warranties</h2>
            <p>
              The tools and services on Formilo are provided &quot;as is&quot; without warranties of any kind, either express or implied. Formilo does not guarantee that resized documents will be accepted by third-party government application portals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">5. Contact Us</h2>
            <p>
              For any questions regarding these Terms, please email us at <strong>formilohelp@gmail.com</strong>.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
