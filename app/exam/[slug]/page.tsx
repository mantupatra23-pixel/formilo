// app/exam/[slug]/page.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ExamResizerTool from '@/components/ExamResizerTool';
import PanCardPhotoChecker from '@/components/PanCardPhotoChecker';
import { resolveToolConfig, normalizeSlug } from '@/lib/registryResolver';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = resolveToolConfig(`exam/${slug}`);

  return {
    title: config.seo.title,
    description: config.seo.description,
    alternates: {
      canonical: `https://www.formilo.in/${config.seo.canonicalSlug}`,
    },
    openGraph: {
      title: config.seo.title,
      description: config.seo.description,
      url: `https://www.formilo.in/${config.seo.canonicalSlug}`,
      siteName: 'Formilo',
      type: 'website',
      images: [
        {
          url: 'https://www.formilo.in/logo.png',
          width: 512,
          height: 512,
          alt: config.seo.h1,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.seo.title,
      description: config.seo.description,
      images: ['https://www.formilo.in/logo.png'],
    },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const rawSlug = normalizeSlug(slug);

  // Instant Intercept & Redirect to dedicated multi-file engines if applicable
  if (rawSlug.includes('jpg-to-pdf')) redirect('/jpg-to-pdf-converter');
  if (rawSlug.includes('pdf-to-jpg')) redirect('/pdf-to-jpg-converter');
  if (
    rawSlug.includes('pdf-compress') ||
    rawSlug.includes('compress-pdf') ||
    rawSlug.includes('pdf-size-reducer')
  ) {
    redirect('/pdf-compressor');
  }

  // Resolve isolated single-source-of-truth configuration
  const config = resolveToolConfig(`exam/${rawSlug}`);
  const isPanPhotoTool = rawSlug.includes('pan-card-photo');

  // Map configuration to interactive tool preset
  const toolPreset = {
    id: config.id,
    slug: config.slug,
    baseSlug: config.id,
    title: config.title,
    examName: config.examName || 'Official Exam',
    boardName: config.authorityName || 'Recruitment Authority',
    docType: config.category === 'signature' ? 'Signature Resizer' : 'Photo Resizer',
    targetKB: config.requirements.targetKB,
    maxKB: config.requirements.maxKB,
    minKB: config.requirements.minKB,
    width: config.requirements.width,
    height: config.requirements.height,
    dpi: config.requirements.dpi || 300,
    dimensionText: config.requirements.dimensions,
    aspectRatio: config.requirements.aspectRatio,
    format: config.requirements.format,
    bgColor: config.requirements.background || 'Plain White Background',
    toolType: config.toolType,
  };

  // Structured Data Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.formilo.in' },
      { '@type': 'ListItem', position: 2, name: 'Exam Presets', item: 'https://www.formilo.in/#exam-presets' },
      { '@type': 'ListItem', position: 3, name: config.seo.h1, item: `https://www.formilo.in/${config.slug}` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.seo.h1,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires HTML5 Canvas and JavaScript support',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: config.shortDescription,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link href="/#exam-presets" className="hover:text-emerald-400">Exam Presets</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">{config.seo.h1}</span>
        </nav>

        {/* 2. Header */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <span>
              {config.verificationStatus === 'verified'
                ? `Verified ${config.authorityName} Preset`
                : 'Application Preset (Verify Latest Notification)'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {config.seo.h1}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {config.shortDescription}
          </p>
        </header>

        {/* 3. Isolated Requirement Answer Box */}
        <section aria-labelledby="req-heading" className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-lg">
          <h2 id="req-heading" className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            {config.content.requirementHeading}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="py-2 pr-4">Requirement</th>
                  <th className="py-2 pr-4">Details</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Dimensions</td>
                  <td className="py-2.5 pr-4">{config.requirements.dimensions}</td>
                  <td className="py-2.5 text-emerald-400 font-medium">
                    {config.verificationStatus === 'verified' ? 'Verified' : 'Verify latest notification'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">File Size Limit</td>
                  <td className="py-2.5 pr-4">
                    {config.requirements.minKB} KB – {config.requirements.maxKB} KB
                  </td>
                  <td className="py-2.5 text-emerald-400 font-medium">
                    {config.verificationStatus === 'verified' ? 'Verified' : 'Verify latest notification'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">File Format</td>
                  <td className="py-2.5 pr-4">{config.requirements.format}</td>
                  <td className="py-2.5 text-emerald-400 font-medium">
                    {config.verificationStatus === 'verified' ? 'Verified' : 'Standard'}
                  </td>
                </tr>
                {config.requirements.background && (
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">Background</td>
                    <td className="py-2.5 pr-4">{config.requirements.background}</td>
                    <td className="py-2.5 text-emerald-400 font-medium">Standard</td>
                  </tr>
                )}
                {config.requirements.expressionOrInk && (
                  <tr>
                    <td className="py-2.5 pr-4 font-medium text-white">
                      {config.category === 'signature' ? 'Ink & Style' : 'Expression & Framing'}
                    </td>
                    <td className="py-2.5 pr-4">{config.requirements.expressionOrInk}</td>
                    <td className="py-2.5 text-emerald-400 font-medium">Standard</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Requirement Verification & Non-Affiliation Notice */}
        <aside className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
          <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Requirement Verification & Non-Affiliation Notice
          </div>
          <p>
            Application guidelines can vary between recruitment cycles. Formilo provides preparation assistance and is an independent utility not affiliated with or endorsed by {config.authorityName}. Always verify requirements against the current official notification before final submission.
          </p>
          {config.officialSource.portalUrl && config.officialSource.portalUrl !== '#' && (
            <div>
              <a
                href={config.officialSource.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 pt-1"
              >
                {config.officialSource.linkLabel} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </aside>

        {/* 5. Main Tool Container */}
        <section aria-label="Interactive Document Formatter Tool">
          {isPanPhotoTool ? (
            <PanCardPhotoChecker />
          ) : (
            <ExamResizerTool preset={toolPreset} config={toolPreset} />
          )}
        </section>

        {/* 6. Step-by-Step Instructions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              How Formilo&apos;s Resizer Works
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 leading-relaxed">
              {config.content.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mobile Instructions (Android / iOS)
            </h2>
            <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
              {config.content.mobileInstructions.map((step, idx) => (
                <li key={idx}>• {step}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Compliant Preparation & Failure Analysis */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white">
            How to Prepare Your Document Correctly & Avoid Portal Rejection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-emerald-400">Preparation Best Practices</h3>
              {config.content.preparationTips.map((tip, idx) => (
                <p key={idx}>• {tip}</p>
              ))}
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-rose-400">Common Rejection Reasons</h3>
              {config.content.rejectionReasons.map((reason, idx) => (
                <p key={idx}>• {reason}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Truthful Privacy Statement */}
        <section className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white">Client-Side Browser Processing</h3>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              Your image is processed directly in your browser using client-side HTML5 Canvas APIs. Formilo does not upload, transmit, or store original candidate files on remote servers.
            </p>
          </div>
        </section>

        {/* 9. Pre-Submission Checklist */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
          <h2 className="text-sm font-bold text-white">Before Uploading Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            {config.content.checklist.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
                <span className="text-emerald-400">☑</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Context-Aware Related Tools */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
          <h2 className="text-sm font-bold text-white">Related Preparation Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <Link
              href="/photo-resizer-50kb"
              className="p-3 rounded-xl bg-black border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-300 group-hover:text-emerald-400">Photo Resizer &lt; 50 KB</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
            </Link>
            <Link
              href="/photo-resizer-20kb"
              className="p-3 rounded-xl bg-black border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-300 group-hover:text-emerald-400">Photo Resizer &lt; 20 KB</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
            </Link>
            <Link
              href="/jpg-to-pdf-converter"
              className="p-3 rounded-xl bg-black border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-300 group-hover:text-emerald-400">JPG to PDF Converter</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
            </Link>
            <Link
              href="/pdf-compressor"
              className="p-3 rounded-xl bg-black border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-300 group-hover:text-emerald-400">PDF Compressor</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
            </Link>
            <Link
              href="/name-date-on-photo"
              className="p-3 rounded-xl bg-black border border-zinc-800 hover:border-emerald-500/50 flex items-center justify-between group transition-colors"
            >
              <span className="text-zinc-300 group-hover:text-emerald-400">Name & Date on Photo</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
            </Link>
          </div>
        </section>

        {/* 11. Isolated FAQs */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {config.content.faqs.map((faq, idx) => (
              <details key={idx} className="group p-3.5 rounded-xl bg-black border border-zinc-800/80 text-xs">
                <summary className="font-semibold text-zinc-200 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-2 text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
