import { Metadata } from 'next';
import GenericPhotoKbResizer from '@/components/GenericPhotoKbResizer';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';
import { KB_PRESETS_DATA } from '@/data/kbPresetsData';

export const dynamic = 'force-dynamic';

const SLUG = 'photo-resizer-30kb';
const preset = KB_PRESETS_DATA?.[30];

const pageData = resolveToolPageData(SLUG, {
  title: preset?.h1 || 'Photo Resizer Under 30 KB Online',
  targetKB: 30,
  category: 'photo',
  description:
    preset?.intro ||
    'Compress and resize candidate photos strictly under 30 KB online for SSC, IBPS, State PSC, and government application forms.',
  bestFor: preset?.bestFor || [
    'Central & State Government recruitment portals (SSC, UPSC, Police)',
    'Banking and Insurance recruitment portals (IBPS, SBI, RBI)',
    'State Public Service Commission forms requiring < 30 KB photos',
    'Online admission and scholarship application forms',
  ],
});

export const metadata: Metadata = {
  title: preset?.seoTitle || 'Photo Resizer Under 30 KB Online (Exact KB & Framing) - Formilo',
  description:
    preset?.metaDescription ||
    'Resize and compress your photo strictly under 30 KB online. Verified for SSC, State PSC, Police, and Banking application forms. 100% private in-browser tool.',
  alternates: {
    canonical: `https://www.formilo.in/${SLUG}`,
  },
  openGraph: {
    title: preset?.seoTitle || 'Photo Resizer Under 30 KB Online - Formilo',
    description:
      preset?.metaDescription ||
      'Compress photos strictly under 30 KB with sharp facial clarity. In-browser RAM processing.',
    url: `https://www.formilo.in/${SLUG}`,
    siteName: 'Formilo',
    images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: preset?.seoTitle || 'Photo Resizer Under 30 KB Online - Formilo',
    description:
      preset?.metaDescription ||
      'Compress photos strictly under 30 KB online with zero server uploads.',
    images: ['https://www.formilo.in/logo.png'],
  },
};

export default function PhotoResizer30KbPage() {
  const faqSchema = generateFAQSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    targetKB: 30,
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
        <GenericPhotoKbResizer initialTargetKB={30} />
      </GlobalToolPageTemplate>
    </>
  );
}
