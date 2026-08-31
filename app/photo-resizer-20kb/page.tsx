import React from 'react';
import { Metadata } from 'next';
import ToolWorkspace from '@/components/tools/ToolWorkspace';

export const metadata: Metadata = {
  title: 'Photo Resizer Under 20 KB (Strict Size Lock) | Formilo',
  description: 'Compress passport photos strictly under 20 KB online for SSC, Police, and government forms. 100% private in-browser tool.',
  alternates: {
    canonical: 'https://www.formilo.in/photo-resizer-20kb',
  },
};

export default function PhotoResizer20KbPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F3] text-[#162630] py-8 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <ToolWorkspace
          config={{
            title: 'Photo Resizer Under 20 KB',
            categoryName: 'Photo Tools',
            targetKB: 20,
            minKB: 5,
            defaultWidth: 350,
            defaultHeight: 450,
            aspectRatioText: '3.5 × 4.5 cm (Passport)',
            description: 'Compress and resize passport photos strictly under 20 KB with verified aspect ratio. Preserves face clarity and eliminates upload rejection.',
            faqList: [
              { q: 'Why is 20 KB required for online forms?', a: 'Many government recruitment portals (like State Police and SSC) enforce a strict maximum ceiling of 20 KB for candidate photos.' },
              { q: 'Will the resized image become blurry?', a: 'No. Formilo uses step-down bi-cubic downscaling that preserves sharp facial boundaries while fitting under 20 KB.' },
              { q: 'Is my photo uploaded to any server?', a: 'No. All processing happens 100% locally inside your device memory.' },
            ],
            relatedTools: [
              { title: 'Signature Resizer Under 20 KB', slug: '/exam/signature-resize-to-20kb', badge: 'SIGN', sizeText: '< 20 KB' },
              { title: 'Photo Resizer Under 50 KB', slug: '/photo-resizer-50kb', badge: 'PHOTO', sizeText: '< 50 KB' },
              { title: 'Name & Date on Photo Generator', slug: '/name-date-on-photo', badge: 'NEW 2026', sizeText: '< 50 KB' },
            ],
          }}
        />
      </div>
    </main>
  );
}
