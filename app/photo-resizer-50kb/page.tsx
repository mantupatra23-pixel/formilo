import React from 'react';
import { Metadata } from 'next';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import ToolWorkspace from '@/components/tools/ToolWorkspace';
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

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <GlobalToolPageTemplate data={toolData}>
          <ToolWorkspace
            config={{
              title: 'Photo Resizer Under 50 KB',
              categoryName: 'Photo Tools',
              targetKB: 50,
              minKB: 20,
              defaultWidth: 350,
              defaultHeight: 450,
              description: toolData.description,
            }}
          />
        </GlobalToolPageTemplate>
      </div>
    </main>
  );
}
