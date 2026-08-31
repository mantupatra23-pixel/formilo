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
  if (rawSlug.includes('pdf-compress') || rawSlug.includes('compress-pdf') || rawSlug.includes('pdf-size-reducer')) {
    redirect('/pdf-compressor');
  }

  const toolData = resolveToolPageData(`exam/${slug}`);
  const isPanPhotoTool = slug.includes('pan-card-photo');

  const faqSchema = generateFAQSchema({
    toolName: toolData.title,
    slug: `/exam/${slug}`,
    targetKB: toolData.targetKB || 50,
    dimensions: toolData.dimensions || '350 × 450 px',
    description: toolData.description,
  });

  const appSchema = generateAppSchema({
    toolName: toolData.title,
    slug: `/exam/${slug}`,
    description: toolData.description,
  });

  const legacyPreset = {
    id: toolData.id,
    slug: toolData.slug,
    baseSlug: toolData.id,
    title: toolData.title,
    examName: toolData.examName || 'Government Exam',
    boardName: toolData.boardName || 'Official Authority',
    docType: toolData.categoryName,
    targetKB: toolData.targetKB || 50,
    maxKB: toolData.targetKB || 50,
    minKB: toolData.minKB || 20,
    width: 350,
    height: 450,
    dpi: 300,
    dimensionText: toolData.dimensions || '350 × 450 px',
    aspectRatio: '3.5:4.5',
    format: 'JPG / JPEG',
    bgColor: 'Clean White Background',
  };

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
