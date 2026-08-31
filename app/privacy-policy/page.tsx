import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Formilo',
  description: 'Formilo Privacy Policy — Learn how we prioritize user privacy through client-side in-browser file processing and standard web analytics.',
  alternates: {
    canonical: 'https://www.formilo.in/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] transition">Home</Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">Privacy Policy</span>
        </nav>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[12px] text-[#66777D] font-mono">Last Updated: August 2026</p>
        </div>

        {/* Content Body */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-card text-[13.5px] text-[#53636A] leading-relaxed">
          
          <div className="p-4 bg-[#F0F3F2] border border-[#D8DEDC] rounded-xl flex items-center gap-3 text-xs text-[#17262E]">
            <ShieldCheck className="w-5 h-5 text-[#008760] shrink-0" />
            <span><strong>Zero Server Storage Guarantee:</strong> Formilo processes all candidate photographs, signatures, and PDF marksheets locally in your browser memory (RAM). We do not store or transmit your documents to external databases.</span>
          </div>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">1. Overview</h2>
            <p>
              At Formilo (accessible at https://www.formilo.in), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of information collected and how it is used.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">2. Document &amp; File Processing (Client-Side)</h2>
            <p>
              All image editing, bi-cubic downscaling, cropping, signature whitening, and PDF merging engines operate using client-side JavaScript (HTML5 Canvas &amp; WebAssembly). Your files remain strictly inside your device session and are discarded immediately upon page refresh or tab closure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">3. Log Files &amp; Web Analytics</h2>
            <p>
              Like most standard websites, Formilo utilizes standard log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, and referring/exit pages. These are not linked to any personally identifiable identity information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">4. Google DoubleClick DART Cookies &amp; Advertising</h2>
            <p>
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">5. Third-Party Privacy Policies</h2>
            <p>
              Formilo&apos;s Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of third-party ad servers for more detailed information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-[17px] font-bold text-[#17262E]">6. Contact Information</h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>formilohelp@gmail.com</strong>.
            </p>
          </section>

        </div>

      </div>
    </main>
  );
}
