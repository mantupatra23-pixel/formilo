import React from 'react';
import { Metadata } from 'next';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import ExamResizerTool from '@/components/ExamResizerTool';
import { resolveToolPageData } from '@/lib/toolPageHelper';

export const metadata: Metadata = {
  title: 'Photo Resizer Under 50 KB (Universal Govt Standard) | Formilo',
  description: 'Compress passport photos strictly under 50 KB online for SSC, UPSC, and Railway forms. 100% private in-browser tool.',
  alternates: {
    canonical: 'https://www.formilo.in/photo-resizer-50kb',
  },
};

export default function PhotoResizer50KbPage() {
  const toolData = resolveToolPageData('photo-resizer-50kb', {
    title: 'Photo Resizer Under 50 KB',
    targetKB: 50,
    minKB: 20,
    dimensions: '350 × 450 px',
    description: 'Universal government application passport photo compressor (< 50 KB). Calibrated for SSC, UPSC, Railway RRB, and Banking portals.',
  });

  const preset = {
    id: 'photo-50kb',
    slug: 'photo-resizer-50kb',
    baseSlug: 'photo-50kb',
    title: 'Photo Resizer Under 50 KB',
    examName: 'Government Forms',
    boardName: 'Official Examination Authority',
    docType: 'Passport Size Photo',
    targetKB: 50,
    maxKB: 50,
    minKB: 20,
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
