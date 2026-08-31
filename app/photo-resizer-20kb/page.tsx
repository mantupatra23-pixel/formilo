import React from 'react';
import { Metadata } from 'next';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import ExamResizerTool from '@/components/ExamResizerTool';
import { resolveToolPageData } from '@/lib/toolPageHelper';

export const metadata: Metadata = {
  title: 'Photo Resizer Under 20 KB (Strict Size Lock) | Formilo',
  description: 'Compress passport photos strictly under 20 KB online for SSC, Police, and government recruitment forms. 100% private in-browser tool.',
  alternates: {
    canonical: 'https://www.formilo.in/photo-resizer-20kb',
  },
};

export default function PhotoResizer20KbPage() {
  const toolData = resolveToolPageData('photo-resizer-20kb', {
    title: 'Photo Resizer Under 20 KB',
    targetKB: 20,
    minKB: 5,
    dimensions: '350 × 450 px',
    description: 'Compress and resize passport photos strictly under 20 KB with verified aspect ratio. Preserves facial clarity and eliminates upload rejection.',
  });

  const preset = {
    id: 'photo-20kb',
    slug: 'photo-resizer-20kb',
    baseSlug: 'photo-20kb',
    title: 'Photo Resizer Under 20 KB',
    examName: 'Recruitment Forms',
    boardName: 'Government Exam Authority',
    docType: 'Passport Size Photo',
    targetKB: 20,
    maxKB: 20,
    minKB: 5,
    width: 350,
    height: 450,
    dpi: 300,
    dimensionText: '350 × 450 px',
    aspectRatio: '3.5:4.5',
    format: 'JPG / JPEG',
    bgColor: 'Light / Crisp White Background',
  };

  return (
    <GlobalToolPageTemplate data={toolData}>
      <ExamResizerTool preset={preset} config={preset} />
    </GlobalToolPageTemplate>
  );
}
