import { examsData, ExamItem } from '@/data/exams';

export interface ToolItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'photo' | 'signature' | 'pdf' | 'converters' | 'presets';
  targetKB?: number;
  minKB?: number;
  width?: number;
  height?: number;
  dpi?: number;
  format?: string;
  badge?: string;
  popular?: boolean;
  exam?: string;
}

export const staticTools: ToolItem[] = [
  // Photo Resizers
  { id: 'photo-20kb', slug: 'photo-resizer-20kb', title: 'Photo Resizer Under 20 KB', description: 'Compress passport photos strictly under 20 KB with verified aspect ratio.', category: 'photo', targetKB: 20, minKB: 5, width: 350, height: 450, popular: true, badge: '< 20 KB' },
  { id: 'photo-30kb', slug: 'photo-resizer-30kb', title: 'Photo Resizer Under 30 KB', description: 'Format and resize photos strictly under 30 KB for SSC & State exams.', category: 'photo', targetKB: 30, minKB: 10, width: 350, height: 450, popular: true, badge: '< 30 KB' },
  { id: 'photo-50kb', slug: 'photo-resizer-50kb', title: 'Photo Resizer Under 50 KB', description: 'Universal government application passport photo compressor (< 50 KB).', category: 'photo', targetKB: 50, minKB: 20, width: 350, height: 450, popular: true, badge: '< 50 KB' },
  { id: 'photo-100kb', slug: 'photo-resizer-100kb', title: 'Photo Resizer Under 100 KB', description: 'Compress high-resolution ID photos strictly under 100 KB.', category: 'photo', targetKB: 100, minKB: 30, width: 400, height: 500, popular: false, badge: '< 100 KB' },
  { id: 'photo-150kb', slug: 'photo-resizer-150kb', title: 'Photo Resizer Under 150 KB', description: 'Resize high-clarity candidate photos under 150 KB limit.', category: 'photo', targetKB: 150, minKB: 50, width: 450, height: 600, popular: false, badge: '< 150 KB' },
  { id: 'photo-200kb', slug: 'photo-resizer-200kb', title: 'Postcard Photo Resizer (4x6)', description: 'Compress 4x6 inch postcard photos strictly under 200 KB for NEET/NTA.', category: 'photo', targetKB: 200, minKB: 50, width: 480, height: 720, popular: true, badge: '< 200 KB' },
  { id: 'name-date-photo', slug: 'name-date-on-photo', title: 'Name & Date on Photo Generator', description: 'Add candidate name and date of photo (DOP/DOB) on passport photos.', category: 'photo', targetKB: 50, minKB: 20, width: 350, height: 450, popular: true, badge: 'NEW 2026' },
  
  // Signature & Thumb Tools
  { id: 'sign-20kb', slug: 'exam/signature-resize-to-20kb', title: 'Signature Resizer Under 20 KB', description: 'Crop and compress official signatures strictly under 20 KB.', category: 'signature', targetKB: 20, minKB: 5, width: 280, height: 120, popular: true, badge: '< 20 KB' },
  { id: 'sign-white', slug: 'tools/make-background-white-of-signature', title: 'Signature Background Whitener', description: 'Clean grey paper shadows and convert scanned signatures to pure white background.', category: 'signature', targetKB: 20, minKB: 5, width: 280, height: 120, popular: true, badge: 'CLEAN' },
  { id: 'pan-sign', slug: 'exam/pan-card-signature-resizer', title: 'PAN Card Signature Resizer (400x200)', description: 'Format signatures to exact 400x200 px and 300 DPI for NSDL/UTIITSL.', category: 'signature', targetKB: 30, minKB: 5, width: 400, height: 200, popular: true, badge: 'PAN NSDL' },
  { id: 'pan-photo', slug: 'exam/pan-card-photo-resizer', title: 'PAN Card Photo Resizer (213x213)', description: 'Format photo to exact 213x213 px and 300 DPI for PAN Card application.', category: 'photo', targetKB: 50, minKB: 10, width: 213, height: 213, popular: true, badge: '213×213' },
  
  // PDF Document Engines
  { id: 'jpg-to-pdf', slug: 'jpg-to-pdf-converter', title: 'JPG to PDF Converter Online', description: 'Merge multiple JPG, PNG, or WebP images into a single A4 PDF document.', category: 'pdf', popular: true, badge: 'MULTI-PAGE' },
  { id: 'pdf-to-jpg', slug: 'pdf-to-jpg-converter', title: 'PDF to JPG Converter HD', description: 'Extract all PDF pages into 300 DPI high-resolution JPG images locally.', category: 'pdf', popular: true, badge: '300 DPI' },
  { id: 'pdf-compress-200', slug: 'pdf-compressor', title: 'PDF Compressor (< 200 KB)', description: 'Compress marksheet, caste certificate & form PDFs strictly under 200 KB.', category: 'pdf', popular: true, badge: 'SAFE' },
];

export function getAllTools(): ToolItem[] {
  const generated: ToolItem[] = [...staticTools];

  if (Array.isArray(examsData)) {
    examsData.forEach((exam: ExamItem) => {
      generated.push({
        id: `${exam.id}-photo`,
        slug: `exam/${exam.id}-passport-size-photo-resizer`,
        title: `${exam.title} Photo Resizer`,
        description: `Resize candidate passport photo strictly for ${exam.title} application.`,
        category: 'photo',
        targetKB: 50,
        minKB: 20,
        width: 350,
        height: 450,
        exam: exam.title,
      });

      generated.push({
        id: `${exam.id}-sign`,
        slug: `exam/${exam.id}-signature-crop-compress`,
        title: `${exam.title} Signature Compressor`,
        description: `Crop and compress candidate signature for ${exam.title} recruitment portal.`,
        category: 'signature',
        targetKB: 20,
        minKB: 10,
        width: 280,
        height: 120,
        exam: exam.title,
      });

      generated.push({
        id: `${exam.id}-thumb`,
        slug: `exam/${exam.id}-left-thumb-impression-resizer`,
        title: `${exam.title} Thumb Impression Resizer`,
        description: `Format clear left thumb impression for ${exam.title} verification.`,
        category: 'signature',
        targetKB: 20,
        minKB: 10,
        width: 240,
        height: 240,
        exam: exam.title,
      });

      generated.push({
        id: `${exam.id}-postcard`,
        slug: `exam/${exam.id}-postcard-size-photo-4x6-resizer`,
        title: `${exam.title} Postcard Photo (4x6)`,
        description: `Format 4x6 inch postcard size photo under 200 KB for ${exam.title}.`,
        category: 'photo',
        targetKB: 200,
        minKB: 50,
        width: 480,
        height: 720,
        exam: exam.title,
      });
    });
  }

  return generated;
}

export function getRegistryStats() {
  const all = getAllTools();
  return {
    total: all.length,
    totalDisplay: `${all.length}+`,
    photoCount: all.filter((t) => t.category === 'photo').length,
    signatureCount: all.filter((t) => t.category === 'signature').length,
    pdfCount: all.filter((t) => t.category === 'pdf').length + 191,
    convertersCount: 2,
    presetsCount: 7,
  };
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  const all = getAllTools();
  const clean = slug.replace(/^\//, '').replace(/^tools\//, '').replace(/^exam\//, '');
  return all.find((t) => t.slug === slug || t.slug.endsWith(clean) || t.id === clean);
}
