import { Metadata } from 'next';
import GenericPhotoKbResizer from '@/components/GenericPhotoKbResizer';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';
import { KB_PRESETS_DATA } from '@/data/kbPresetsData';

export const dynamic = 'force-dynamic';

const SLUG = 'photo-resizer-200kb';
const preset = (KB_PRESETS_DATA as any)?.[200];

const pageData = resolveToolPageData(SLUG, {
  title: preset?.h1 || 'Photo Resizer Under 200 KB Online',
  targetKB: 200,
  category: 'photo',
  description:
    preset?.intro ||
    'Format large 4x6 inch postcard photos, full document pages, and high-resolution certificates strictly under 200 KB.',
  bestFor: preset?.bestFor || [
    'Postcard size (4x6 inch) photograph for NEET and NTA exams',
    'High-resolution candidate certificate and marksheet attachments',
    'Defence, UPSC, and State PSC portal document submissions',
    'Bank loan and admission registration attachments',
  ],
});

export const metadata: Metadata = {
  title: preset?.seoTitle || 'Photo Resizer Under 200 KB Online (4x6 & Postcard Lock) - Formilo',
  description:
    preset?.metaDescription ||
    'Resize and compress photos strictly under 200 KB online. Verified for NEET 4x6 postcards, marksheets, and official forms.',
  alternates: {
    canonical: `https://www.formilo.in/${SLUG}`,
  },
  openGraph: {
    title: preset?.seoTitle || 'Photo Resizer Under 200 KB Online - Formilo',
    description: 'Compress photos and certificates under 200 KB with zero server uploads.',
    url: `https://www.formilo.in/${SLUG}`,
    siteName: 'Formilo',
    images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: preset?.seoTitle || 'Photo Resizer Under 200 KB Online - Formilo',
    description: 'Compress photos strictly under 200 KB online with client-side privacy.',
    images: ['https://www.formilo.in/logo.png'],
  },
};

export default function PhotoResizer200KbPage() {
  const faqSchema = generateFAQSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    targetKB: 200,
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
        <GenericPhotoKbResizer initialTargetKB={200} />
      </GlobalToolPageTemplate>
    </>
  );
}
