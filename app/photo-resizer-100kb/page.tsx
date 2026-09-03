import { Metadata } from 'next';
import GenericPhotoKbResizer from '@/components/GenericPhotoKbResizer';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';
import { KB_PRESETS_DATA } from '@/data/kbPresetsData';

export const dynamic = 'force-dynamic';

const SLUG = 'photo-resizer-100kb';
const preset = (KB_PRESETS_DATA as any)?.[100];

const pageData = resolveToolPageData(SLUG, {
  title: preset?.h1 || 'Photo Resizer Under 100 KB Online',
  targetKB: 100,
  category: 'photo',
  description:
    preset?.intro ||
    'Ideal for ID cards, handwritten declarations, marksheet crops, and recruitment photo uploads requiring high fidelity up to 100 KB.',
  bestFor: preset?.bestFor || [
    'Handwritten declarations and thumb impressions requiring higher clarity',
    'Bank specialist officer and state PSC document uploads',
    'College admission identity cards and portal certificates',
    'Passport photo uploads with strict 50 KB – 100 KB requirement',
  ],
});

export const metadata: Metadata = {
  title: preset?.seoTitle || 'Photo Resizer Under 100 KB Online (Exact KB Lock) - Formilo',
  description:
    preset?.metaDescription ||
    'Resize and compress photos strictly under 100 KB online. Verified for declarations, marksheets, and official government forms. 100% private in-browser tool.',
  alternates: {
    canonical: `https://www.formilo.in/${SLUG}`,
  },
  openGraph: {
    title: preset?.seoTitle || 'Photo Resizer Under 100 KB Online - Formilo',
    description: 'Compress photos strictly under 100 KB with sharp text clarity. In-browser RAM processing.',
    url: `https://www.formilo.in/${SLUG}`,
    siteName: 'Formilo',
    images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: preset?.seoTitle || 'Photo Resizer Under 100 KB Online - Formilo',
    description: 'Compress photos under 100 KB online with zero server uploads.',
    images: ['https://www.formilo.in/logo.png'],
  },
};

export default function PhotoResizer100KbPage() {
  const faqSchema = generateFAQSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    targetKB: 100,
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
        <GenericPhotoKbResizer initialTargetKB={100} />
      </GlobalToolPageTemplate>
    </>
  );
}
