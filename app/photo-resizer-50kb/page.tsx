import React from 'react';
import { Metadata } from 'next';
import ToolWorkspace from '@/components/tools/ToolWorkspace';

export const metadata: Metadata = {
  title: 'Photo Resizer Under 50 KB (Universal Govt Standard) | Formilo',
  description: 'Compress passport photos strictly under 50 KB online for SSC, UPSC, and Railway forms. 100% private in-browser tool.',
  alternates: {
    canonical: 'https://www.formilo.in/photo-resizer-50kb',
  },
};

export default function PhotoResizer50KbPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <ToolWorkspace
          config={{
            title: 'Photo Resizer Under 50 KB',
            categoryName: 'Photo Tools',
            targetKB: 50,
            minKB: 20,
            defaultWidth: 350,
            defaultHeight: 450,
            aspectRatioText: '3.5 × 4.5 cm (Passport)',
            description: 'Universal government application passport photo compressor (< 50 KB). Calibrated for SSC, UPSC, Railway RRB, and Banking portals.',
            faqList: [
              { q: 'Which exams require photo size under 50 KB?', a: 'SSC CGL, SSC CHSL, UPSC Civil Services, Railway RRB NTPC, and IBPS banking portals universally mandate 20 KB to 50 KB photo size.' },
              { q: 'How does Formilo maintain quality under 50 KB?', a: 'Formilo utilizes client-side bi-cubic smoothing to retain facial contours, lighting, and eye clarity.' },
            ],
            relatedTools: [
              { title: 'Photo Resizer Under 20 KB', slug: '/photo-resizer-20kb', badge: 'PHOTO', sizeText: '< 20 KB' },
              { title: 'Signature Resizer Under 20 KB', slug: '/exam/signature-resize-to-20kb', badge: 'SIGN', sizeText: '< 20 KB' },
              { title: 'JPG to PDF Converter', slug: '/jpg-to-pdf-converter', badge: 'PDF', sizeText: 'A4 Multi' },
            ],
          }}
        />
      </div>
    </main>
  );
}
