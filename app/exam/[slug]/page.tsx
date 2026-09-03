import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ExamResizerTool from '@/components/ExamResizerTool';
import PanCardPhotoChecker from '@/components/PanCardPhotoChecker';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import { resolveToolPageData } from '@/lib/toolPageHelper';
import { generateFAQSchema, generateAppSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata for Google Indexing & CTR Boost
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = String(slug || '').toLowerCase();
  const toolData = resolveToolPageData(rawSlug);

  const pageTitle = `${toolData.title} (${toolData.targetKB ? `< ${toolData.targetKB} KB` : 'Official Size'}) - Formilo`;
  const pageDescription = `Resize, compress, and format your photo, signature, and documents for ${toolData.examName || toolData.title}. Strictly complies with official ${toolData.dimensions || 'portal'} size standards. 100% private in-browser processing.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `https://www.formilo.in/exam/${rawSlug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.formilo.in/exam/${rawSlug}`,
      siteName: 'Formilo',
      type: 'website',
      images: [
        {
          url: 'https://www.formilo.in/logo.png',
          width: 512,
          height: 512,
          alt: toolData.title,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ['https://www.formilo.in/logo.png'],
    },
  };
}

// 2. Exam Dynamic Page Component
export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const rawSlug = String(slug || '').toLowerCase();

  // Instant Intercept & Redirect to dedicated multi-file engines
  if (rawSlug.includes('jpg-to-pdf')) {
    redirect('/jpg-to-pdf-converter');
  }
  if (rawSlug.includes('pdf-to-jpg')) {
    redirect('/pdf-to-jpg-converter');
  }
  if (
    rawSlug.includes('pdf-compress') ||
    rawSlug.includes('compress-pdf') ||
    rawSlug.includes('pdf-size-reducer')
  ) {
    redirect('/pdf-compressor');
  }

  const toolData = resolveToolPageData(rawSlug);
  const isPanPhotoTool = rawSlug.includes('pan-card-photo');

  // Dynamic Width & Height Parsing
  let width = 350;
  let height = 450;
  if (toolData.dimensions) {
    const dimMatch = toolData.dimensions.match(/(\d+)\s*[x×*]\s*(\d+)/i);
    if (dimMatch) {
      width = parseInt(dimMatch[1], 10);
      height = parseInt(dimMatch[2], 10);
    }
  } else if (rawSlug.includes('signature') || toolData.category === 'signature') {
    width = 280;
    height = 120;
  } else if (rawSlug.includes('postcard') || rawSlug.includes('4x6')) {
    width = 400;
    height = 720;
  } else if (rawSlug.includes('pan-card')) {
    width = 213;
    height = 213;
  }

  const targetKB = toolData.targetKB || 50;
  const minKB = toolData.minKB || Math.max(5, Math.round(targetKB * 0.2));

  // Dynamic Aspect Ratio Calculation
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height) || 1;
  const aspectRatio = `${width / divisor}:${height / divisor}`;

  const legacyPreset = {
    id: toolData.id,
    slug: toolData.slug,
    baseSlug: toolData.id,
    title: toolData.title,
    examName: toolData.examName || 'Government Exam',
    boardName: toolData.boardName || 'Official Authority',
    docType: toolData.categoryName,
    targetKB,
    maxKB: targetKB,
    minKB,
    width,
    height,
    dpi: 300,
    dimensionText: toolData.dimensions || `${width} × ${height} px`,
    aspectRatio,
    format: toolData.format || 'JPG / JPEG',
    bgColor: 'Clean White Background',
  };

  const faqSchema = generateFAQSchema({
    toolName: toolData.title,
    slug: `/exam/${rawSlug}`,
    targetKB,
    dimensions: legacyPreset.dimensionText,
    description: toolData.description,
  });

  const appSchema = generateAppSchema({
    toolName: toolData.title,
    slug: `/exam/${rawSlug}`,
    description: toolData.description,
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

      <GlobalToolPageTemplate data={toolData}>
        {isPanPhotoTool ? (
          <PanCardPhotoChecker />
        ) : (
          <ExamResizerTool preset={legacyPreset} config={legacyPreset} />
        )}
      </GlobalToolPageTemplate>
    </>
  );
}
