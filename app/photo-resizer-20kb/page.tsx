import React from 'react';
import { Metadata } from 'next';
import GlobalToolPageTemplate from '@/components/tool-template/GlobalToolPageTemplate';
import ToolWorkspace from '@/components/tools/ToolWorkspace';
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

  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#17262E] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <GlobalToolPageTemplate data={toolData}>
          <ToolWorkspace
            config={{
              title: 'Photo Resizer Under 20 KB',
              categoryName: 'Photo Tools',
              targetKB: 20,
              minKB: 5,
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
