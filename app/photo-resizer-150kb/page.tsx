import { Metadata } from 'next';
import GenericPhotoKbResizer from '@/components/GenericPhotoKbResizer';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';
import { KB_PRESETS_DATA } from '@/data/kbPresetsData';

export const dynamic = 'force-dynamic';

const SLUG = 'photo-resizer-150kb';
const preset = (KB_PRESETS_DATA as any)?.[150];

const pageData = resolveToolPageData(SLUG, {
  title: preset?.h1 || 'Photo Resizer Under 150 KB Online',
  targetKB: 150,
  category: 'photo',
  description:
    preset?.intro ||
    'Tailored for national entrance examinations, UPSC, SSC, and high-detail photo uploads that allow up to 150 KB file sizes.',
  bestFor: preset?.bestFor || [
    'National entrance examinations (NEET, JEE Main, CUET, GATE)',
    'UPSC Civil Services and Combined Defence Services (CDS) portals',
    'State Public Service Commission forms accepting up to 150 KB photos',
    'University admission portals and scholarship verification documents',
  ],
});

export const metadata: Metadata = {
  title: preset?.seoTitle || 'Photo Resizer Under 150 KB Online (Entrance Exam Lock) - Formilo',
  description:
    preset?.metaDescription ||
    'Resize and compress photos strictly under 150 KB online. Verified for NEET, JEE, UPSC, and State PSC application forms. 100% private client-side processing.',
  alternates: {
    canonical: `https://www.formilo.in/${SLUG}`,
  },
  openGraph: {
    title: preset?.seoTitle || 'Photo Resizer Under 150 KB Online - Formilo',
    description:
      preset?.metaDescription ||
      'Compress photos strictly under 150 KB with sharp facial detail and zero server uploads.',
    url: `https://www.formilo.in/${SLUG}`,
    siteName: 'Formilo',
    images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: preset?.seoTitle || 'Photo Resizer Under 150 KB Online - Formilo',
    description:
      preset?.metaDescription ||
      'Compress photos strictly under 150 KB online with client-side privacy.',
    images: ['https://www.formilo.in/logo.png'],
  },
};

export default function PhotoResizer150KbPage() {
  const faqSchema = generateFAQSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    targetKB: 150,
    dimensions: pageData.dimensions || '350 × 450 px',
    description: pageData.description,
  });

  const appSchema = generateAppSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    description: pageData.description,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <GlobalToolPageTemplate data={pageData}>
        <GenericPhotoKbResizer initialTargetKB={150} />
      </GlobalToolPageTemplate>
    </>
  );
}
