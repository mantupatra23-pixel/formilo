// app/sitemap.ts
import { MetadataRoute } from 'next';
import examToolsData from '@/data/exam-presets.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formilo-jzcl.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addEntry = (
    path: string, 
    priority: number, 
    changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${BASE_URL}${cleanPath}`.toLowerCase().trim();
    if (!seenUrls.has(fullUrl)) {
      seenUrls.add(fullUrl);
      sitemapEntries.push({
        url: fullUrl,
        lastModified: currentDate,
        changeFrequency,
        priority,
      });
    }
  };

  // 1. Core Homepage & Static Hub Pages
  addEntry('', 1.0, 'daily');
  addEntry('/cyber-cafe', 0.85, 'weekly');
  addEntry('/privacy', 0.3, 'monthly');
  addEntry('/terms', 0.3, 'monthly');

  // 2. Dedicated Photo KB Size Presets (High Search Intent)
  addEntry('/photo-resizer-20kb', 0.95, 'weekly');
  addEntry('/photo-resizer-30kb', 0.90, 'weekly');
  addEntry('/photo-resizer-50kb', 0.95, 'weekly');
  addEntry('/photo-resizer-100kb', 0.90, 'weekly');
  addEntry('/photo-resizer-150kb', 0.85, 'weekly');
  addEntry('/photo-resizer-200kb', 0.90, 'weekly');
  addEntry('/name-date-on-photo', 0.95, 'weekly');

  // 3. Document & PDF Converter Suite
  addEntry('/tools/jpg-to-pdf-converter', 0.90, 'weekly');
  addEntry('/tools/pdf-to-jpg-converter', 0.85, 'weekly');
  addEntry('/tools/pdf-compressor-under-200kb', 0.85, 'weekly');

  // 4. Core Featured Exam Tools
  addEntry('/exam/pan-card-photo-resizer', 0.90, 'weekly');
  addEntry('/exam/pan-card-signature-resizer', 0.90, 'weekly');
  addEntry('/exam/signature-resize-to-20kb', 0.90, 'weekly');
  addEntry('/exam/nielit-ccc-exam-photo-and-sign-resizer', 0.85, 'weekly');
  addEntry('/exam/photo-watermark-remover', 0.80, 'weekly');

  // 5. Dynamic Exam Matrix (Automatically Indexes All 480+ Presets)
  const processedExamBases = new Set<string>();
  const rawList = Array.isArray(examToolsData) ? examToolsData : [];

  rawList.forEach((item: any) => {
    const rawSlug = String(item.slug || '').toLowerCase().trim();
    const baseSlug = rawSlug
      .replace(/-(passport-size-photo-resizer|passport-photo|photo-resizer|photo|signature-crop-compress|signature-resizer|signature|sign|left-thumb-impression-resizer|thumb-impression|thumb|postcard-size-photo-4x6-resizer|postcard-size-photo|postcard|under-20kb|under-50kb|20kb|50kb|resizer)$/gi, '')
      .trim();

    if (!baseSlug || processedExamBases.has(baseSlug)) return;
    processedExamBases.add(baseSlug);

    // 4 Standard Formats Per Exam Base
    const formatVariants = [
      'passport-size-photo-resizer',
      'signature-crop-compress',
      'left-thumb-impression-resizer',
      'postcard-size-photo-4x6-resizer',
    ];

    formatVariants.forEach((suffix) => {
      addEntry(`/exam/${baseSlug}-${suffix}`, 0.75, 'weekly');
    });
  });

  return sitemapEntries;
}
