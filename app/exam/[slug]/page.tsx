import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ExamResizerTool from '@/components/ExamResizerTool';
import PanCardPhotoChecker from '@/components/PanCardPhotoChecker';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, HelpCircle, ExternalLink, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = String(slug || '').toLowerCase();
  const isRbi = rawSlug.includes('rbi-grade-b');

  const title = isRbi
    ? 'RBI Grade B Passport Size Photo Resizer – Size & KB | Formilo'
    : `${resolveToolPageData(rawSlug).title} - Formilo`;

  const description = isRbi
    ? 'Prepare your RBI Grade B application photo with the required dimensions, file size and format. Free browser-based photo resizer with no server upload.'
    : `Resize and crop compliant application photos for official submissions with client-side browser processing.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.formilo.in/exam/${rawSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.formilo.in/exam/${rawSlug}`,
      siteName: 'Formilo',
      type: 'website',
      images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512, alt: title }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.formilo.in/logo.png'],
    },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const rawSlug = String(slug || '').toLowerCase();

  if (rawSlug.includes('jpg-to-pdf')) redirect('/jpg-to-pdf-converter');
  if (rawSlug.includes('pdf-to-jpg')) redirect('/pdf-to-jpg-converter');
  if (rawSlug.includes('pdf-compress') || rawSlug.includes('compress-pdf') || rawSlug.includes('pdf-size-reducer')) {
    redirect('/pdf-compressor');
  }

  const toolData = resolveToolPageData(rawSlug);
  const isPanPhotoTool = rawSlug.includes('pan-card-photo');
  const isRbi = rawSlug.includes('rbi-grade-b');

  // RBI Grade B verified standards: 200 x 230 px, 20-50 KB
  const width = isRbi ? 200 : (toolData.dimensions?.match(/(\d+)\s*[x×*]\s*(\d+)/)?.[1] ? parseInt(toolData.dimensions.match(/(\d+)\s*[x×*]\s*(\d+)/)![1], 10) : 350);
  const height = isRbi ? 230 : (toolData.dimensions?.match(/(\d+)\s*[x×*]\s*(\d+)/)?.[2] ? parseInt(toolData.dimensions.match(/(\d+)\s*[x×*]\s*(\d+)/)![2], 10) : 450);
  const targetKB = isRbi ? 50 : (toolData.targetKB || 50);
  const minKB = isRbi ? 20 : (toolData.minKB || 10);
  const dimensionText = isRbi ? '200 × 230 px' : (toolData.dimensions || `${width} × ${height} px`);

  const legacyPreset = {
    id: toolData.id,
    slug: toolData.slug,
    baseSlug: toolData.id,
    title: isRbi ? 'RBI Grade B Passport Size Photo Resizer' : toolData.title,
    examName: isRbi ? 'RBI Grade B Officer Recruitment' : (toolData.examName || 'Government Exam'),
    boardName: isRbi ? 'Reserve Bank of India (RBI)' : (toolData.boardName || 'Official Authority'),
    docType: 'Photo Resizer',
    targetKB,
    maxKB: targetKB,
    minKB,
    width,
    height,
    dpi: 300,
    dimensionText,
    aspectRatio: `${width}:${height}`,
    format: 'JPG / JPEG',
    bgColor: 'Light or Plain White Background',
  };

  // Structured Data Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.formilo.in' },
      { '@type': 'ListItem', position: 2, name: 'Exam Presets', item: 'https://www.formilo.in/#exam-presets' },
      { '@type': 'ListItem', position: 3, name: legacyPreset.title, item: `https://www.formilo.in/exam/${rawSlug}` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: legacyPreset.title,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires HTML5 support',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description: 'Browser-based utility to resize, crop, and compress photographs to RBI Grade B recruitment standards.',
  };

  const rbiFaqs = [
    {
      q: 'What is the required photo size for RBI Grade B Officer recruitment?',
      a: 'The official guideline specifies dimensions of 200 × 230 pixels (width × height) with a required file size strictly between 20 KB and 50 KB.',
    },
    {
      q: 'What is the maximum and minimum photo file size permitted?',
      a: 'The photo file must be a minimum of 20 KB and cannot exceed 50 KB. Files larger than 50 KB are automatically rejected by the RBI/IBPS application portal.',
    },
    {
      q: 'Which image format is accepted on the RBI portal?',
      a: 'Only JPG or JPEG image formats are accepted. Files in PNG, WEBP, or PDF will fail during upload in the photograph field.',
    },
    {
      q: 'Can I resize my RBI Grade B photo on a mobile device?',
      a: 'Yes. Formilo processes the photo directly inside mobile web browsers (Chrome, Safari) using client-side Canvas APIs, allowing you to crop and save the file directly to your downloads.',
    },
    {
      q: 'Will compression reduce photo clarity or cause rejection?',
      a: 'No. Formilo utilizes iterative step-down scaling to preserve sharp facial contours, eyes, and background contrast while adjusting the binary file weight under 50 KB.',
    },
    {
      q: 'Does Formilo upload my confidential photo to an external server?',
      a: 'No. All cropping and byte compression execute 100% locally within your device RAM. The photo is never sent to or stored on Formilo servers.',
    },
    {
      q: 'Why can a photo be rejected even when the file size is under 50 KB?',
      a: 'Rejections often occur due to non-white/dark backgrounds, shadows across the face, wearing caps or dark glasses, blurry face capture, or an incorrect aspect ratio (distorted stretching).',
    },
    {
      q: 'Should I verify requirements with the official notification?',
      a: 'Yes. Guidelines can be updated between annual recruitment cycles. Always refer to the latest official notification on the Reserve Bank of India website before submitting your form.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rbiFaqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-6 px-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>/</span>
          <Link href="/#exam-presets" className="hover:text-emerald-400">Exam Presets</Link>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">{legacyPreset.title}</span>
        </nav>

        {/* 2. Header & Above-The-Fold Summary */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <span>Verified Officer Exam Preset</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {legacyPreset.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            Prepare, crop, and compress candidate photographs strictly to official dimensions and file-size specifications for Reserve Bank of India recruitment portals.
          </p>
        </header>

        {/* 3. Verified Requirement Answer Box */}
        <section aria-labelledby="rbi-req-heading" className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3 shadow-lg">
          <h2 id="rbi-req-heading" className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            RBI Grade B Photo Requirements
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
                  <td className="py-2.5 pr-4">200 × 230 pixels (approx. 3.5 × 4.5 cm)</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Verified</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">File Size Limit</td>
                  <td className="py-2.5 pr-4">20 KB – 50 KB</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Verified</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">File Format</td>
                  <td className="py-2.5 pr-4">JPG / JPEG</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Verified</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Background</td>
                  <td className="py-2.5 pr-4">Light-coloured, preferably white</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Verified</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Expression & Headwear</td>
                  <td className="py-2.5 pr-4">Neutral face, eyes visible; no caps or dark glasses</td>
                  <td className="py-2.5 text-emerald-400 font-medium">Verified</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Requirement Verification / Non-Affiliation Notice */}
        <aside className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
          <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Requirement Verification & Non-Affiliation
          </div>
          <p>
            Application requirements can change between recruitment cycles. Formilo provides preparation assistance and is an independent utility not affiliated with or endorsed by the Reserve Bank of India. Always verify requirements against the current official notification before submission.
          </p>
          <div>
            <a
              href="https://www.rbi.org.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2 pt-1"
            >
              Official RBI Recruitment Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* 5. Main Photo Resizer Tool */}
        <section aria-label="Interactive Resizer Tool">
          {isPanPhotoTool ? (
            <PanCardPhotoChecker />
          ) : (
            <ExamResizerTool preset={legacyPreset} config={legacyPreset} />
          )}
        </section>

        {/* 6. Step-by-Step Practical Instructions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              How Formilo&apos;s Resizer Works
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 leading-relaxed">
              <li><strong className="text-white">Select Image:</strong> Choose an existing photo from your device.</li>
              <li><strong className="text-white">Local Browser Processing:</strong> The image is loaded into your browser RAM.</li>
              <li><strong className="text-white">Resize & Align:</strong> Framing locks into the 200 × 230 pixel ratio.</li>
              <li><strong className="text-white">Compression Cycle:</strong> The tool balances byte weight strictly between 20 KB and 50 KB.</li>
              <li><strong className="text-white">Download:</strong> Save your verified compliant file directly.</li>
            </ol>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mobile Instructions (Android / iOS)
            </h2>
            <ul className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
              <li>• Tap <strong>Choose Image</strong> and pick a photo from your gallery or file manager.</li>
              <li>• Use the <strong>Zoom & Scale</strong> slider to center your face within the preview boundary.</li>
              <li>• Ensure no white padding strips remain above or below the head.</li>
              <li>• Tap <strong>Download Verified Document</strong>; your photo saves directly to your device Downloads folder.</li>
            </ul>
          </div>
        </section>

        {/* 7. Compliant Photo Preparation & Failure Reasons */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white">How to Prepare Your Photo Correctly & Avoid Rejection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300 leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-emerald-400">Photo Preparation Best Practices</h3>
              <p>• <strong>Framing & Position:</strong> Your head should be centered and occupy approximately 70% to 80% of the photograph area.</p>
              <p>• <strong>Lighting & Contrast:</strong> Even lighting on both sides of the face; avoid harsh shadows behind the ears or neck.</p>
              <p>• <strong>Background:</strong> Use a plain white or off-white background without patterns or room objects.</p>
              <p>• <strong>Spectacles & Caps:</strong> Normal prescription glasses are acceptable only if eyes are clearly visible without flash glare; tinted lenses and hats are prohibited.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-rose-400">Common Application Rejection Reasons</h3>
              <p>• <strong>Wrong File Size:</strong> Uploading files smaller than 20 KB or exceeding 50 KB.</p>
              <p>• <strong>Distorted Aspect Ratio:</strong> Stretched or horizontally squashed facial features.</p>
              <p>• <strong>Blurry Capture:</strong> Using low-resolution smartphone crops or taking a photo of a physical printout.</p>
              <p>• <strong>Unsupported Formats:</strong> Attempting to upload PNG, WEBP, or PDF files into the image slot.</p>
            </div>
          </div>
        </section>

        {/* 8. Truthful Privacy Statement */}
        <section className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white">Client-Side Browser Processing</h3>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              Your image is processed directly inside your browser using client-side HTML5 Canvas APIs. Formilo does not upload, transmit, or store your original images or personal documents on remote servers.
            </p>
          </div>
        </section>

        {/* 9. Pre-Submission Checklist */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
          <h2 className="text-sm font-bold text-white">Before Uploading to the RBI Portal Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>Dimensions: 200 × 230 pixels</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>File size: 20 KB – 50 KB</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>File format: JPG / JPEG</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>Light or white background</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>Face clearly visible without glare</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black border border-zinc-800 flex items-center gap-2">
              <span className="text-emerald-400">☑</span>
              <span>Verified against latest notification</span>
            </div>
          </div>
        </section>

        {/* 10. Related Preparation Tools */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3">
          <h2 className="text-sm font-bold text-white">Related Application Tools</h2>
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

        {/* 11. RBI-Specific FAQs */}
        <section className="p-5 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {rbiFaqs.map((faq, idx) => (
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
