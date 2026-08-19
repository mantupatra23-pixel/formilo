// lib/toolsData.ts

export interface FormiloTool {
  id: string;
  title: string;
  description: string;
  category: 'exam' | 'photo' | 'signature' | 'pdf' | 'converter';
  badge?: string;
  sizeBadge: string;
  href: string;
  isPopular?: boolean;
}

export const ALL_TOOLS: FormiloTool[] = [
  // 1. Core Generators & High Demand
  {
    id: 'name-date-photo',
    title: 'Name & Date on Photo (DOP / DOB) Generator',
    description: 'Add candidate name and photo date strip on passport photo strictly under 50 KB for SSC, RRB & Police forms.',
    category: 'photo',
    badge: 'NEW 2026',
    sizeBadge: '< 50 KB',
    href: '/name-date-on-photo',
    isPopular: true,
  },
  {
    id: 'pan-photo',
    title: 'PAN Card Photo Resizer (213 x 213 px)',
    description: 'Resize passport photo to exact 213x213 px and 300 DPI for NSDL and UTIITSL portal forms.',
    category: 'exam',
    badge: 'POPULAR',
    sizeBadge: '< 50 KB',
    href: '/exam/pan-card-photo-resizer',
    isPopular: true,
  },
  {
    id: 'pan-signature',
    title: 'PAN Card Signature Resizer (400 x 200 px)',
    description: 'Compress signature to exact 400x200 px, 300 DPI and under 30 KB with crisp white background.',
    category: 'signature',
    badge: 'POPULAR',
    sizeBadge: '< 30 KB',
    href: '/exam/pan-card-signature-resizer',
    isPopular: true,
  },
  {
    id: 'photo-20kb',
    title: 'Photo Resize to 20 KB',
    description: 'Compress and resize photos strictly under 20 KB for official government application forms.',
    category: 'photo',
    badge: 'POPULAR',
    sizeBadge: '< 20 KB',
    href: '/exam/photo-resize-under-20kb',
    isPopular: true,
  },
  {
    id: 'photo-50kb',
    title: 'Photo Resize to 50 KB',
    description: 'Resize and compress photos to under 50 KB while maintaining high facial clarity.',
    category: 'photo',
    badge: 'POPULAR',
    sizeBadge: '< 50 KB',
    href: '/exam/photo-resize-under-50kb',
    isPopular: true,
  },
  {
    id: 'signature-20kb',
    title: 'Signature Resize to 20 KB',
    description: 'Resize scanned signature photos to under 20 KB with sharp contrast and clean white background.',
    category: 'signature',
    badge: 'POPULAR',
    sizeBadge: '< 20 KB',
    href: '/exam/ssc-gd-signature',
    isPopular: true,
  },
  {
    id: 'nielit-ccc',
    title: 'NIELIT CCC Exam Photo & Sign Resizer',
    description: 'Format CCC form photos to 132x170 px and signature to 170x132 px (10 KB – 20 KB).',
    category: 'exam',
    badge: 'EXAM',
    sizeBadge: '10-20 KB',
    href: '/exam/nielit-ccc-photo-resizer',
    isPopular: true,
  },

  // 2. Govt Exam Presets
  {
    id: 'ssc-cgl-photo',
    title: 'SSC CGL Passport Photo Resizer',
    description: 'Standard 3.5 x 4.5 cm photo compressed strictly under 50 KB for SSC CGL portal.',
    category: 'exam',
    badge: 'SSC',
    sizeBadge: '< 50 KB',
    href: '/exam/ssc-cgl-passport-photo',
    isPopular: true,
  },
  {
    id: 'ssc-signature',
    title: 'SSC Signature Crop & Compress',
    description: 'Format official signature between 10 KB to 20 KB with 3.5 x 1.5 cm aspect ratio.',
    category: 'signature',
    badge: 'SSC',
    sizeBadge: '< 20 KB',
    href: '/exam/ssc-gd-signature',
  },
  {
    id: 'rrb-ntpc-photo',
    title: 'Railway RRB NTPC Photo Resizer',
    description: 'Format railway recruit photo strictly under 50 KB on plain light background.',
    category: 'exam',
    badge: 'RAILWAY',
    sizeBadge: '< 50 KB',
    href: '/exam/rrb-ntpc-passport-photo',
  },
  {
    id: 'up-police-photo',
    title: 'UP Police Constable Photo Resizer',
    description: 'Format recruitment photograph to 350x450 px under 50 KB without blur.',
    category: 'exam',
    badge: 'POLICE',
    sizeBadge: '< 50 KB',
    href: '/exam/up-police-constable-passport-photo',
  },
  {
    id: 'upsc-cse-photo',
    title: 'UPSC Civil Services Photo Resizer',
    description: 'High-clarity passport photograph formatting for UPSC online portal under 100 KB.',
    category: 'exam',
    badge: 'UPSC',
    sizeBadge: '< 100 KB',
    href: '/exam/upsc-cse-passport-photo',
  },
  {
    id: 'odisha-police-photo',
    title: 'Odisha Police Constable & SI Photo Resizer',
    description: 'OPRB recruitment official passport size photo resizer under 50 KB (350x450 px).',
    category: 'exam',
    badge: 'OPRB',
    sizeBadge: '< 50 KB',
    href: '/exam/odisha-police-constable-si-passport-photo',
  },
  {
    id: 'maharashtra-police-photo',
    title: 'Maharashtra Police Bharti Photo Resizer',
    description: 'Format candidate passport photo to 350x450 px and under 50 KB strictly.',
    category: 'exam',
    badge: 'POLICE',
    sizeBadge: '< 50 KB',
    href: '/exam/maharashtra-police-bharti-passport-photo',
  },

  // 3. Utilities, PDF & Converters
  {
    id: 'watermark-remover',
    title: 'Online Watermark & Stamp Remover',
    description: 'Erase unwanted watermarks, dates, stamps, and text from photos using browser inpainting.',
    category: 'photo',
    badge: 'SMART TOOL',
    sizeBadge: 'AUTO',
    href: '/exam/photo-watermark-remover',
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF Converter',
    description: 'Combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    category: 'pdf',
    badge: 'PRO',
    sizeBadge: 'FAST',
    href: '/cyber-cafe',
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG Converter',
    description: 'Extract PDF document pages into high-resolution JPG images directly in RAM.',
    category: 'converter',
    badge: 'FAST',
    sizeBadge: 'HD',
    href: '/cyber-cafe',
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor (< 200 KB)',
    description: 'Compress large PDF certificates and marksheets strictly under 200 KB / 500 KB for uploads.',
    category: 'pdf',
    badge: 'SAFE',
    sizeBadge: '< 200 KB',
    href: '/cyber-cafe',
  },
];
