import { Metadata } from 'next';
import NameDatePhotoTool from '@/components/NameDatePhotoTool';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

const SLUG = 'name-date-on-photo';

const pageData = resolveToolPageData(SLUG, {
  title: 'Add Name & Date of Photo (DOP) Online for Govt Exams',
  targetKB: 50,
  category: 'photo',
  dimensions: '350 × 450 px',
  description:
    'Add official candidate name and Date of Photograph (DOP) bottom bar on passport photos strictly under 50 KB for SSC, Railway, and State Bharti forms.',
  bestFor: [
    'SSC CGL, CHSL, MTS & GD Constable application photo requirements',
    'Railway RRB NTPC, ALP & Group D recruitment photo verification',
    'State Police and PSC bharti forms requiring Date of Photo (DOP)',
    'National entrance tests requiring stamped candidate name & date',
  ],
  faqs: [
    {
      q: 'What is the official rule for Date of Photo (DOP) in SSC exams?',
      a: 'The date printed on the photograph must generally not be older than 3 months from the application release date. The candidate name and date should appear clearly in black capital letters over a solid white bottom strip.',
    },
    {
      q: 'Will adding candidate name and date make the photo exceed 50 KB?',
      a: 'No. Formilo canvas engine automatically draws the bottom text bar and compresses the final output strictly within 20 KB to 50 KB limits.',
    },
    {
      q: 'Is my photo or candidate name uploaded to any external server?',
      a: 'No. All font rendering, cropping, and compression run 100% locally in your web browser memory (RAM).',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Add Name & Date on Photo (DOP) Online for SSC & Govt Exams - Formilo',
  description:
    'Free online tool to add candidate Name and Date of Photograph (DOP) at the bottom of passport photos. Strictly complies with SSC, Railway & State police portal guidelines.',
  alternates: {
    canonical: `https://www.formilo.in/${SLUG}`,
  },
  openGraph: {
    title: 'Add Name & Date on Photo (DOP) Online - Formilo',
    description: 'Add official name and DOP bottom strip strictly under 50 KB with zero server uploads.',
    url: `https://www.formilo.in/${SLUG}`,
    siteName: 'Formilo',
    images: [{ url: 'https://www.formilo.in/logo.png', width: 512, height: 512 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Name & Date on Photo (DOP) Online - Formilo',
    description: 'Stamp candidate name and date on passport photo online strictly under 50 KB.',
    images: ['https://www.formilo.in/logo.png'],
  },
};

export default function NameDatePhotoPage() {
  const faqSchema = generateFAQSchema({
    toolName: pageData.title,
    slug: `/${SLUG}`,
    targetKB: 50,
    dimensions: '350 × 450 px',
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
        <NameDatePhotoTool />
      </GlobalToolPageTemplate>
    </>
  );
}
