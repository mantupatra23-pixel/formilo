import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Mail, Clock, ShieldCheck, Send, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Formilo',
  description: 'Contact Formilo support desk for queries, feedback, tool suggestions, or technical support.',
  alternates: {
    canonical: 'https://www.formilo.in/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] transition">Home</Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Contact Support &amp; Feedback
          </h1>
          <p className="text-[14px] text-[#53636A] leading-relaxed">
            Have a question regarding image formatting, tool suggestions, bug reports, or partnership inquiries? Get in touch with our team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Email Box */}
          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-4 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-[#00C98B]/15 border border-[#00C98B]/30 flex items-center justify-center text-[#008760]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#17262E]">Official Support Email</h2>
              <p className="text-[13px] text-[#53636A] mt-1">Send your queries or tool requests directly:</p>
              <a
                href="mailto:formilohelp@gmail.com"
                className="text-[15px] font-mono font-bold text-[#00A879] hover:underline mt-2 inline-block"
              >
                formilohelp@gmail.com
              </a>
            </div>
          </div>

          {/* Response Time Box */}
          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 space-y-4 shadow-card">
            <div className="w-10 h-10 rounded-xl bg-[#00C7D9]/15 border border-[#00C7D9]/30 flex items-center justify-center text-[#007D8B]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#17262E]">Response Time</h2>
              <p className="text-[13px] text-[#53636A] mt-1">
                We review emails daily. Typical response time is within <strong>24 to 48 business hours</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Common Topics Card */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-card text-[13.5px] text-[#53636A] leading-relaxed">
          <h2 className="text-[18px] font-bold text-[#17262E]">How Can We Help You?</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>New Exam Preset Requests:</strong> If an active examination notification specifies unique dimensions or KB limits not listed yet, email us the exam notification link.</li>
            <li><strong>Technical Issues:</strong> Facing issues during canvas downscaling or PDF merging? Mention your device and browser type.</li>
            <li><strong>Cyber Cafe &amp; CSC Operators:</strong> Bulk tool feature suggestions and keyboard shortcut requests are always welcome.</li>
            <li><strong>Privacy Inquiries:</strong> Questions regarding our zero-server data processing architecture.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
