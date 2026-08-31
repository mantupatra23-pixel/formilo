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

// 1. Core Base Static Tools
export const staticTools: ToolItem[] = [
  // Core Photo Size & KB Reducers
  { id: 'photo-20kb', slug: 'photo-resizer-20kb', title: 'Photo Resizer Under 20 KB', description: 'Compress passport photos strictly under 20 KB with verified aspect ratio.', category: 'photo', targetKB: 20, minKB: 5, width: 350, height: 450, popular: true, badge: '< 20 KB' },
  { id: 'photo-30kb', slug: 'photo-resizer-30kb', title: 'Photo Resizer Under 30 KB', description: 'Format and resize photos strictly under 30 KB for SSC, Banking & State PSC portals.', category: 'photo', targetKB: 30, minKB: 10, width: 350, height: 450, popular: true, badge: '< 30 KB' },
  { id: 'photo-50kb', slug: 'photo-resizer-50kb', title: 'Photo Resizer Under 50 KB', description: 'Universal government application passport photo compressor strictly under 50 KB.', category: 'photo', targetKB: 50, minKB: 20, width: 350, height: 450, popular: true, badge: '< 50 KB' },
  { id: 'photo-100kb', slug: 'photo-resizer-100kb', title: 'Photo Resizer Under 100 KB', description: 'Compress high-resolution ID photos and handwritten declarations strictly under 100 KB.', category: 'photo', targetKB: 100, minKB: 30, width: 400, height: 500, popular: false, badge: '< 100 KB' },
  { id: 'photo-150kb', slug: 'photo-resizer-150kb', title: 'Photo Resizer Under 150 KB', description: 'Resize high-clarity candidate photos under 150 KB for NTA and university entrance forms.', category: 'photo', targetKB: 150, minKB: 50, width: 450, height: 600, popular: false, badge: '< 150 KB' },
  { id: 'photo-200kb', slug: 'photo-resizer-200kb', title: 'Postcard Photo Resizer (4x6 Inch)', description: 'Compress 4x6 inch postcard photos strictly under 200 KB for NEET UG and NTA admissions.', category: 'photo', targetKB: 200, minKB: 50, width: 480, height: 720, popular: true, badge: '< 200 KB' },
  { id: 'name-date-photo', slug: 'name-date-on-photo', title: 'Name & Date on Photo Generator', description: 'Add candidate name and date of photo (DOP/DOB) strip on passport photos (< 50 KB).', category: 'photo', targetKB: 50, minKB: 20, width: 350, height: 450, popular: true, badge: 'NEW 2026' },

  // Core Signature & Thumb Tools
  { id: 'sign-20kb', slug: 'exam/signature-resize-to-20kb', title: 'Signature Resizer Under 20 KB', description: 'Crop and compress official candidate signatures strictly under 20 KB on white background.', category: 'signature', targetKB: 20, minKB: 5, width: 280, height: 120, popular: true, badge: '< 20 KB' },
  { id: 'sign-white', slug: 'tools/make-background-white-of-signature', title: 'Signature Background Whitener', description: 'Clean grey paper shadows and convert scanned signatures to pure white background.', category: 'signature', targetKB: 20, minKB: 5, width: 280, height: 120, popular: true, badge: 'CLEAN' },
  { id: 'pan-sign', slug: 'exam/pan-card-signature-resizer', title: 'PAN Card Signature Resizer (400x200 px)', description: 'Format signatures to exact 400x200 px and 300 DPI for NSDL & UTIITSL applications.', category: 'signature', targetKB: 30, minKB: 5, width: 400, height: 200, popular: true, badge: 'PAN NSDL' },
  { id: 'pan-photo', slug: 'exam/pan-card-photo-resizer', title: 'PAN Card Photo Resizer (213x213 px)', description: 'Format photo to exact 213x213 px and 300 DPI for instant PAN Card verification.', category: 'photo', targetKB: 50, minKB: 10, width: 213, height: 213, popular: true, badge: '213×213' },
  { id: 'ccc-sign', slug: 'exam/nielit-ccc-exam-photo-and-sign-resizer', title: 'NIELIT CCC Photo & Sign Resizer', description: 'Format 132x170 px photo and 170x132 px signature strictly under 20 KB.', category: 'signature', targetKB: 20, minKB: 10, width: 170, height: 132, popular: true, badge: 'NIELIT' },

  // Core PDF Document Suite
  { id: 'jpg-to-pdf', slug: 'jpg-to-pdf-converter', title: 'JPG to PDF Converter Online', description: 'Merge multiple JPG, PNG, or WebP images into a single professional A4 PDF document.', category: 'pdf', popular: true, badge: 'MULTI-PAGE' },
  { id: 'pdf-to-jpg', slug: 'pdf-to-jpg-converter', title: 'PDF to JPG Converter HD', description: 'Extract all PDF pages into 300 DPI high-resolution JPG images directly inside browser memory.', category: 'pdf', popular: true, badge: '300 DPI' },
  { id: 'pdf-compress-200', slug: 'pdf-compressor', title: 'PDF Compressor (< 200 KB)', description: 'Compress marksheet, caste certificate & form PDFs strictly under 200 KB.', category: 'pdf', popular: true, badge: 'SAFE' },
  { id: 'pdf-compress-100', slug: 'pdf-compressor', title: 'Compress PDF to 100 KB', description: 'Reduce document PDF size strictly under 100 KB for state recruitment portals.', category: 'pdf', popular: false, badge: '< 100 KB' },
  { id: 'pdf-compress-500', slug: 'pdf-compressor', title: 'Compress PDF to 500 KB', description: 'Optimize large university marksheets and affidavits under 500 KB.', category: 'pdf', popular: false, badge: '< 500 KB' },
];

// 2. Build Comprehensive Multi-Variant Tool Registry
export function getAllTools(): ToolItem[] {
  const toolMap = new Map<string, ToolItem>();

  // Add static tools
  staticTools.forEach((t) => {
    toolMap.set(t.slug.toLowerCase().trim(), t);
  });

  // Dynamically generate standard exam suites (Photo, Signature, Thumb, Postcard, Declarations, Dedicated KB Resizers)
  if (Array.isArray(examsData)) {
    examsData.forEach((exam: ExamItem) => {
      const baseSlug = exam.id;
      const boardLabel = exam.board.length > 20 ? exam.board.split(' ')[0] : exam.board;

      // 1. Passport Size Photo (< 50 KB)
      const photoSlug = `exam/${baseSlug}-passport-size-photo-resizer`;
      if (!toolMap.has(photoSlug)) {
        toolMap.set(photoSlug, {
          id: `${baseSlug}-photo`,
          slug: photoSlug,
          title: `${exam.title} Passport Size Photo Resizer`,
          description: `Resize candidate passport photo strictly between 20 KB to 50 KB (350x450 px) for ${exam.title}.`,
          category: 'photo',
          targetKB: 50,
          minKB: 20,
          width: 350,
          height: 450,
          exam: exam.title,
          badge: boardLabel || 'PHOTO',
          popular: ['ssc-cgl', 'rrb-ntpc', 'sbi-po', 'nta-neet-ug', 'up-police-constable', 'pan-card'].includes(baseSlug),
        });
      }

      // 2. Signature Crop & Compress (< 20 KB)
      const signSlug = `exam/${baseSlug}-signature-crop-compress`;
      if (!toolMap.has(signSlug)) {
        toolMap.set(signSlug, {
          id: `${baseSlug}-sign`,
          slug: signSlug,
          title: `${exam.title} Signature Crop & Compress`,
          description: `Crop and compress candidate signature strictly under 20 KB on clean white background for ${exam.title}.`,
          category: 'signature',
          targetKB: 20,
          minKB: 10,
          width: 280,
          height: 120,
          exam: exam.title,
          badge: 'SIGN',
          popular: ['ssc-cgl', 'rrb-ntpc', 'sbi-po', 'nta-neet-ug'].includes(baseSlug),
        });
      }

      // 3. Left Thumb Impression (< 20 KB)
      const thumbSlug = `exam/${baseSlug}-left-thumb-impression-resizer`;
      if (!toolMap.has(thumbSlug)) {
        toolMap.set(thumbSlug, {
          id: `${baseSlug}-thumb`,
          slug: thumbSlug,
          title: `${exam.title} Left Thumb Impression Resizer`,
          description: `Format clear left thumb impression to blue/black ink under 20 KB for ${exam.title} application.`,
          category: 'signature',
          targetKB: 20,
          minKB: 10,
          width: 240,
          height: 240,
          exam: exam.title,
          badge: 'THUMB',
        });
      }

      // 4. Postcard Size Photo 4x6 (< 200 KB)
      const postcardSlug = `exam/${baseSlug}-postcard-size-photo-4x6-resizer`;
      if (!toolMap.has(postcardSlug)) {
        toolMap.set(postcardSlug, {
          id: `${baseSlug}-postcard`,
          slug: postcardSlug,
          title: `${exam.title} Postcard Photo (4x6 Inch) Resizer`,
          description: `Resize full postcard size 4x6 photograph with white background under 200 KB for ${exam.title}.`,
          category: 'photo',
          targetKB: 200,
          minKB: 50,
          width: 480,
          height: 720,
          exam: exam.title,
          badge: '< 200 KB',
        });
      }

      // 5. Strict 20 KB Photo Variant
      const photo20Slug = `exam/${baseSlug}-photo-resize-to-20kb`;
      if (!toolMap.has(photo20Slug)) {
        toolMap.set(photo20Slug, {
          id: `${baseSlug}-photo-20kb`,
          slug: photo20Slug,
          title: `${exam.title} Photo Resize Under 20 KB`,
          description: `Compress ${exam.title} candidate photo strictly under 20 KB with zero blur.`,
          category: 'photo',
          targetKB: 20,
          minKB: 5,
          width: 350,
          height: 450,
          exam: exam.title,
          badge: '< 20 KB',
        });
      }

      // 6. Strict 30 KB Photo Variant
      const photo30Slug = `exam/${baseSlug}-photo-resize-to-30kb`;
      if (!toolMap.has(photo30Slug)) {
        toolMap.set(photo30Slug, {
          id: `${baseSlug}-photo-30kb`,
          slug: photo30Slug,
          title: `${exam.title} Photo Resize Under 30 KB`,
          description: `Compress ${exam.title} candidate photo strictly under 30 KB for state verification.`,
          category: 'photo',
          targetKB: 30,
          minKB: 10,
          width: 350,
          height: 450,
          exam: exam.title,
          badge: '< 30 KB',
        });
      }

      // 7. Strict 100 KB Document / Declaration Variant
      const doc100Slug = `exam/${baseSlug}-document-resize-to-100kb`;
      if (!toolMap.has(doc100Slug)) {
        toolMap.set(doc100Slug, {
          id: `${baseSlug}-doc-100kb`,
          slug: doc100Slug,
          title: `${exam.title} Document / Declaration Under 100 KB`,
          description: `Compress handwritten declaration and certificate scans under 100 KB for ${exam.title}.`,
          category: 'photo',
          targetKB: 100,
          minKB: 30,
          width: 800,
          height: 400,
          exam: exam.title,
          badge: '< 100 KB',
        });
      }

      // 8. PDF Marksheet & Certificate Compressor (< 200 KB)
      const pdf200Slug = `exam/${baseSlug}-pdf-compressor-under-200kb`;
      if (!toolMap.has(pdf200Slug)) {
        toolMap.set(pdf200Slug, {
          id: `${baseSlug}-pdf-200kb`,
          slug: pdf200Slug,
          title: `${exam.title} PDF Certificate Compressor (< 200 KB)`,
          description: `Compress marksheet, caste certificate & domicile PDFs strictly under 200 KB for ${exam.title}.`,
          category: 'pdf',
          targetKB: 200,
          minKB: 50,
          exam: exam.title,
          badge: 'PDF',
        });
      }

      // 9. Multi-Page JPG to PDF Merger
      const jpgPdfSlug = `exam/${baseSlug}-jpg-to-pdf-converter`;
      if (!toolMap.has(jpgPdfSlug)) {
        toolMap.set(jpgPdfSlug, {
          id: `${baseSlug}-jpg-pdf`,
          slug: jpgPdfSlug,
          title: `${exam.title} JPG to PDF Document Converter`,
          description: `Merge multiple marksheet scans and identity photos into a single PDF for ${exam.title}.`,
          category: 'pdf',
          exam: exam.title,
          badge: 'JPG→PDF',
        });
      }

      // 10. PDF to JPG Extractor
      const pdfJpgSlug = `exam/${baseSlug}-pdf-to-jpg-converter`;
      if (!toolMap.has(pdfJpgSlug)) {
        toolMap.set(pdfJpgSlug, {
          id: `${baseSlug}-pdf-jpg`,
          slug: pdfJpgSlug,
          title: `${exam.title} PDF to JPG Converter HD`,
          description: `Extract PDF pages into 300 DPI high-resolution JPG images for ${exam.title} verification.`,
          category: 'pdf',
          exam: exam.title,
          badge: '300 DPI',
        });
      }
    });
  }

  return Array.from(toolMap.values());
}

// 3. Dynamic Calculation of Tool Registry Stats
export function getRegistryStats() {
  const all = getAllTools();
  return {
    total: all.length,
    totalDisplay: `${all.length}+`,
    photoCount: all.filter((t) => t.category === 'photo').length,
    signatureCount: all.filter((t) => t.category === 'signature').length,
    pdfCount: all.filter((t) => t.category === 'pdf').length,
    examToolsCount: all.filter((t) => t.slug.startsWith('exam/')).length,
    presetsCount: examsData.length,
  };
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  const all = getAllTools();
  const clean = slug.replace(/^\//, '').replace(/^tools\//, '').replace(/^exam\//, '');
  return all.find((t) => t.slug === slug || t.slug.endsWith(clean) || t.id === clean);
}
