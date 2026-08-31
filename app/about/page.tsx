import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Zap, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Formilo Document & Photo Tools',
  description: 'Learn about Formilo — free, high-speed, browser-native document formatting and image resizing platform for online government job applications.',
  alternates: {
    canonical: 'https://www.formilo.in/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#53636A]">
          <Link href="/" className="hover:text-[#00A879] transition">Home</Link>
          <span>/</span>
          <span className="text-[#17262E] font-bold">About Us</span>
        </nav>

        {/* Hero */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C98B]/15 border border-[#00C98B]/30 text-[#008760] text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#00C98B]" />
            <span>ABOUT FORMILO PLATFORM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17262E] tracking-tight">
            Empowering Candidates with Fast, Private Document Tools
          </h1>
          <p className="text-[14px] text-[#53636A] leading-relaxed">
            Formilo is a modern web-based document processing utility built to simplify candidate file preparation for online examinations, recruitment applications, and entrance portals across India.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
          <h2 className="text-[20px] font-bold text-[#17262E]">Our Mission</h2>
          <p className="text-[13.5px] text-[#53636A] leading-relaxed">
            Applying for government and entrance examinations often requires strictly bounded file weights (such as under 20 KB, 50 KB, or 200 KB), specific pixel ratios, and formatted signatures. Many candidates face form rejections due to minor file formatting errors.
          </p>
          <p className="text-[13.5px] text-[#53636A] leading-relaxed">
            Formilo eliminates this friction by offering pre-calibrated, 1-click tools for passport photos, signatures, handwritten declarations, thumb impressions, and multi-page PDF documents.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#00A879]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Instant &amp; Free</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              No subscription, registration, or hidden paywalls. Unlimited document preparation directly in your browser.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#007D8B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Client-Side Privacy</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              All image resizing and PDF compilation runs locally inside your device RAM. Your identity documents are never uploaded to remote servers.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F7F7F3] border border-[#E8EBE9] flex items-center justify-center text-[#A85A20]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[15px] text-[#17262E]">Requirement Accurate</h3>
            <p className="text-[13px] text-[#53636A] leading-relaxed">
              Calibrated strictly to technical specifications published in official recruitment guidelines.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-[#FFFFFF] border border-[#DDE2DF] rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#17262E]">Have feedback or questions?</h3>
            <p className="text-[13px] text-[#53636A]">Reach out to our support desk directly via email.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#138F79] hover:bg-[#0E7764] text-white font-bold text-[13px] transition flex items-center gap-1.5"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}
