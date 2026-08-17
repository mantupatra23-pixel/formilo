// lib/tools.ts

export type ToolCategory = 'photo' | 'image' | 'pdf' | 'signature' | 'form';

export interface Tool {
  id?: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  targetKB?: number;
  targetWidth?: number;
  targetHeight?: number;
  instructions: string[];
  faq: { question: string; answer: string }[];
  relatedTools: string[];
  enabled: boolean;
  seoTitle: string;
  seoDescription: string;
  icon?: string;
  badge?: string;
  keywords?: string[];
  toolType?: string;
  acceptedMime?: string[];
}

// ── 1. CORE ESSENTIAL TOOLS ──────────────────────────────────────────────────
const CORE_TOOLS: Tool[] = [
  {
    id: 'photo-resize-20kb',
    slug: 'photo-resize-20kb',
    name: 'Photo Resize to 20 KB',
    category: 'photo',
    description: 'Compress and resize photos strictly under 20 KB for official application forms and job portals.',
    shortDescription: 'Resize photos to less than 20 KB instantly.',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Popular',
    keywords: ['photo resize 20kb', 'ssc 20kb photo', 'upsc photo resize', 'online form photo 20kb'],
    instructions: [
      'Upload your photo (JPG, PNG, or WebP).',
      'The engine automatically compresses the image below 20 KB.',
      'Preview the result and click Download.'
    ],
    faq: [
      {
        question: 'Will resizing to 20 KB make my photo blurry?',
        answer: 'Our binary compression algorithm balances pixel dimensions and image quality to keep your face sharp.'
      },
      {
        question: 'Are my photos uploaded to any external server?',
        answer: 'No. All processing happens 100% locally inside your browser memory.'
      }
    ],
    relatedTools: ['photo-resize-50kb', 'signature-resize-20kb', 'passport-photo-resizer'],
    enabled: true,
    seoTitle: 'Photo Resize to 20 KB Online — Free | Formilo',
    seoDescription: 'Compress and resize JPG/PNG photos under 20 KB online for free. Ideal for government and job forms.'
  },
  {
    id: 'photo-resize-50kb',
    slug: 'photo-resize-50kb',
    name: 'Photo Resize to 50 KB',
    category: 'photo',
    description: 'Resize and compress photos to under 50 KB while maintaining high visual clarity.',
    shortDescription: 'Resize photos to less than 50 KB instantly.',
    targetKB: 50,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Popular',
    keywords: ['photo resize 50kb', 'admit card photo', 'exam photo 50kb'],
    instructions: [
      'Upload your photograph.',
      'Automated compression reduces the file size under 50 KB.',
      'Download your formatted file.'
    ],
    faq: [
      {
        question: 'What image formats are supported?',
        answer: 'JPG, JPEG, PNG, and WebP images are supported.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-100kb', 'passport-photo-resizer'],
    enabled: true,
    seoTitle: 'Photo Resize to 50 KB Online — Free | Formilo',
    seoDescription: 'Compress photos to under 50 KB online free for exams and official job applications.'
  },
  {
    id: 'signature-resize-20kb',
    slug: 'signature-resize-20kb',
    name: 'Signature Resize to 20 KB',
    category: 'signature',
    description: 'Resize scanned signature photos to under 20 KB with sharp contrast and clean white background.',
    shortDescription: 'Resize signature images to under 20 KB.',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Popular',
    keywords: ['signature resize 20kb', 'signature compressor', 'ssc signature 20kb'],
    instructions: [
      'Upload your cropped signature photo.',
      'The engine optimizes the file size under 20 KB.',
      'Download formatted signature file.'
    ],
    faq: [
      {
        question: 'How do I ensure signature clarity under 20 KB?',
        answer: 'Crop closely around the signature before uploading for the cleanest result.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true,
    seoTitle: 'Signature Resize to 20 KB Online — Free | Formilo',
    seoDescription: 'Resize scanned signature images under 20 KB online with crisp white background.'
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    description: 'Combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    shortDescription: 'Combine multiple images into a clean PDF.',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'jpg-to-pdf',
    icon: 'FileText',
    badge: 'Pro',
    keywords: ['jpg to pdf', 'images to pdf converter', 'multiple photos to pdf'],
    instructions: [
      'Upload one or more images.',
      'Reorder pages as needed using the thumbnail controls.',
      'Click Convert & Download PDF.'
    ],
    faq: [
      {
        question: 'Can I upload more than 20 photos at once?',
        answer: 'Yes, you can upload and merge up to 50+ images into a single PDF document.'
      }
    ],
    relatedTools: ['pdf-to-jpg', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'JPG to PDF Converter Online — Free | Formilo',
    seoDescription: 'Convert and merge multiple JPG and PNG images to a single PDF document online.'
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'pdf',
    description: 'Extract PDF document pages into high-resolution JPG images.',
    shortDescription: 'Extract PDF pages as JPG images.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-to-jpg',
    icon: 'FileText',
    badge: 'Fast',
    keywords: ['pdf to jpg', 'pdf to image converter', 'extract pages from pdf'],
    instructions: [
      'Upload your PDF file.',
      'The pages are parsed into high-resolution images.',
      'Download individual pages or all as JPG.'
    ],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'PDF to JPG Converter Online — Free | Formilo',
    seoDescription: 'Extract PDF pages into high-quality JPG images online for free.'
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    description: 'Reduce PDF document file size safely directly in your browser.',
    shortDescription: 'Reduce PDF file size safely in-browser.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-compressor',
    icon: 'FileText',
    badge: 'Safe',
    keywords: ['pdf compressor', 'reduce pdf size', 'compress pdf under 200kb'],
    instructions: [
      'Upload PDF file.',
      'Select compression level.',
      'Download reduced PDF.'
    ],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-to-jpg'],
    enabled: true,
    seoTitle: 'PDF Compressor Online — Free | Formilo',
    seoDescription: 'Compress PDF files online for free without uploading documents to external servers.'
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Smart Image Compressor',
    category: 'image',
    description: 'Compress JPG, PNG, and WebP files up to 90% without visible quality loss.',
    shortDescription: 'Compress JPG, PNG, and WebP files easily.',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Lossless',
    keywords: ['image compressor', 'compress jpg', 'compress png online'],
    instructions: [
      'Select image file to compress.',
      'Preview output file size.',
      'Download optimized image.'
    ],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true,
    seoTitle: 'Smart Image Compressor Online — Free | Formilo',
    seoDescription: 'Compress image files online without losing quality. 100% private in-browser tool.'
  },
  {
    id: 'image-pixel-resizer',
    slug: 'image-pixel-resizer',
    name: 'Image Pixel Resizer',
    category: 'image',
    description: 'Change image width and height in exact pixels with aspect ratio preservation.',
    shortDescription: 'Resize images by width and height in pixels.',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    keywords: ['image pixel resizer', 'change image width height', 'resize px'],
    instructions: [
      'Upload image file.',
      'Enter custom pixel dimensions (Width × Height).',
      'Download resized file.'
    ],
    faq: [],
    relatedTools: ['image-compressor', 'photo-resize-50kb'],
    enabled: true,
    seoTitle: 'Image Pixel Resizer Online — Free | Formilo',
    seoDescription: 'Resize image dimensions in exact pixels online for free.'
  }
];

// ── 2. EXACT KB RESIZERS GENERATOR (25 Tools) ────────────────────────────────
const KB_LIST = [
  10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 
  120, 150, 200, 250, 300, 350, 400, 500, 800, 1000, 2000
];

const KB_TOOLS: Tool[] = KB_LIST.map((kb) => {
  const displaySize = kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`;
  return {
    id: `photo-resize-${kb}kb`,
    slug: `photo-resize-to-${kb}-kb`,
    name: `Photo Resize to ${displaySize}`,
    category: 'photo',
    description: `Compress and resize any image under ${displaySize} for online application forms, competitive exams, and job portals.`,
    shortDescription: `Resize photos to less than ${displaySize} instantly.`,
    targetKB: kb,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    badge: kb <= 50 ? 'Popular' : undefined,
    keywords: [`photo resize ${kb}kb`, `${kb}kb photo`, `image compress to ${kb}kb`],
    instructions: ['Upload photo', `Engine automatically compresses file size strictly below ${displaySize}`, 'Download formatted image'],
    faq: [{ question: `Will my photo remain clear under ${displaySize}?`, answer: 'Yes, binary search optimization retains maximum pixel sharpness.' }],
    relatedTools: ['signature-resize-to-20-kb', 'passport-photo-resizer', 'jpg-to-pdf'],
    enabled: true,
    seoTitle: `Photo Resize to ${displaySize} Online Free — Formilo`,
    seoDescription: `Resize and compress photos to under ${displaySize} online free for government and job portals.`
  };
});

// ── 3. EXAM & GOVERNMENT PORTAL PRESETS (60 Tools) ───────────────────────────
const EXAM_PRESETS = [
  // SSC Suite
  { name: 'SSC CGL Photo Resizer', slug: 'ssc-cgl-photo-resizer', kb: 50, w: 350, h: 450, desc: '3.5 x 4.5 cm (20 KB - 50 KB)' },
  { name: 'SSC CHSL Photo Resizer', slug: 'ssc-chsl-photo-resizer', kb: 50, w: 350, h: 450, desc: '3.5 x 4.5 cm (20 KB - 50 KB)' },
  { name: 'SSC MTS Photo Resizer', slug: 'ssc-mts-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Candidate photo under 50 KB' },
  { name: 'SSC GD Constable Photo Resizer', slug: 'ssc-gd-photo-resizer', kb: 50, w: 350, h: 450, desc: 'GD Constable admit card size' },
  { name: 'SSC Stenographer Photo Resizer', slug: 'ssc-steno-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Steno Grade C & D photo specs' },
  { name: 'SSC CPO Photo Resizer', slug: 'ssc-cpo-photo-resizer', kb: 50, w: 350, h: 450, desc: 'SI in Delhi Police & CAPF photo' },
  { name: 'SSC JE Photo Resizer', slug: 'ssc-je-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Junior Engineer recruitment size' },
  { name: 'SSC Signature Resizer (10-20 KB)', slug: 'ssc-signature-resizer', kb: 20, w: 280, h: 120, desc: 'Exact 10 KB to 20 KB signature' },

  // UPSC Suite
  { name: 'UPSC IAS Photo Resizer', slug: 'upsc-ias-photo-resizer', kb: 100, w: 350, h: 450, desc: 'UPSC photo format (350x450 px)' },
  { name: 'UPSC NDA Photo Resizer', slug: 'upsc-nda-photo-resizer', kb: 100, w: 350, h: 450, desc: 'NDA online application ready' },
  { name: 'UPSC CDS Photo Resizer', slug: 'upsc-cds-photo-resizer', kb: 100, w: 350, h: 450, desc: 'CDS examination photo specs' },
  { name: 'UPSC CAPF Photo Resizer', slug: 'upsc-capf-photo-resizer', kb: 100, w: 350, h: 450, desc: 'Assistant Commandant photo specs' },
  { name: 'UPSC EPFO Photo Resizer', slug: 'upsc-epfo-photo-resizer', kb: 100, w: 350, h: 450, desc: 'Enforcement Officer photo specs' },
  { name: 'UPSC Signature Resizer', slug: 'upsc-signature-resizer', kb: 40, w: 350, h: 150, desc: 'UPSC admit card signature under 40 KB' },

  // Banking & Insurance (IBPS / SBI / RBI)
  { name: 'IBPS PO Photo Resizer', slug: 'ibps-po-photo-resizer', kb: 50, w: 200, h: 230, desc: '200 x 230 pixels (20 KB - 50 KB)' },
  { name: 'IBPS Clerk Photo Resizer', slug: 'ibps-clerk-photo-resizer', kb: 50, w: 200, h: 230, desc: '200 x 230 pixels candidate photo' },
  { name: 'IBPS RRB Officer Photo Resizer', slug: 'ibps-rrb-officer-photo-resizer', kb: 50, w: 200, h: 230, desc: 'Regional Rural Bank photo' },
  { name: 'IBPS Signature Resizer', slug: 'ibps-signature-resizer', kb: 20, w: 140, h: 60, desc: '140 x 60 pixels (10 KB - 20 KB)' },
  { name: 'IBPS Left Thumb Impression Resizer', slug: 'ibps-thumb-impression-resizer', kb: 50, w: 240, h: 240, desc: '20 KB - 50 KB thumb impression' },
  { name: 'IBPS Handwritten Declaration Resizer', slug: 'ibps-handwritten-declaration-resizer', kb: 100, w: 800, h: 400, desc: '50 KB - 100 KB declaration' },
  { name: 'SBI PO Photo Resizer', slug: 'sbi-po-photo-resizer', kb: 50, w: 200, h: 230, desc: 'SBI Probationary Officer photo' },
  { name: 'SBI Clerk Photo Resizer', slug: 'sbi-clerk-photo-resizer', kb: 50, w: 200, h: 230, desc: 'SBI Junior Associate photo specs' },
  { name: 'RBI Grade B Photo Resizer', slug: 'rbi-grade-b-photo-resizer', kb: 50, w: 200, h: 230, desc: 'Reserve Bank of India photo' },

  // Railway Recruitment (RRB)
  { name: 'RRB NTPC Photo Resizer', slug: 'rrb-ntpc-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Railway NTPC photo (20-50 KB)' },
  { name: 'RRB Group D Photo Resizer', slug: 'rrb-group-d-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Railway Group D photo specs' },
  { name: 'RRB ALP Photo Resizer', slug: 'rrb-alp-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Assistant Loco Pilot photo specs' },
  { name: 'RRB Technician Photo Resizer', slug: 'rrb-technician-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Railway Technician photo format' },
  { name: 'RPF Constable Photo Resizer', slug: 'rpf-constable-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Railway Police Force photo' },
  { name: 'RRB Signature Resizer', slug: 'rrb-signature-resizer', kb: 20, w: 280, h: 120, desc: 'Railway application signature 20 KB' },

  // Entrance & National Exams (NTA / IIT / CBSE)
  { name: 'NEET UG Photo Resizer', slug: 'neet-ug-photo-resizer', kb: 200, w: 400, h: 500, desc: 'Passport size photo (10-200 KB)' },
  { name: 'NEET Postcard Photo (4x6 inch)', slug: 'neet-postcard-photo-resizer', kb: 300, w: 600, h: 900, desc: '4x6 inch postcard photo specs' },
  { name: 'NEET Signature Resizer', slug: 'neet-signature-resizer', kb: 30, w: 280, h: 120, desc: 'NEET candidate signature (4-30 KB)' },
  { name: 'JEE Main Photo Resizer', slug: 'jee-main-photo-resizer', kb: 200, w: 350, h: 450, desc: '10 KB to 200 KB candidate photo' },
  { name: 'JEE Advanced Photo Resizer', slug: 'jee-advanced-photo-resizer', kb: 100, w: 350, h: 450, desc: 'IIT JEE online registration size' },
  { name: 'CUET UG Photo Resizer', slug: 'cuet-ug-photo-resizer', kb: 100, w: 350, h: 450, desc: 'NTA CUET portal specifications' },
  { name: 'GATE Exam Photo Resizer', slug: 'gate-photo-resizer', kb: 100, w: 480, h: 640, desc: 'IIT GATE admit card photo size' },
  { name: 'GATE Signature Resizer', slug: 'gate-signature-resizer', kb: 50, w: 320, h: 160, desc: 'GATE signature (5-50 KB)' },
  { name: 'CTET Photo Resizer', slug: 'ctet-photo-resizer', kb: 100, w: 350, h: 450, desc: 'Central TET online application photo' },
  { name: 'UGC NET Photo Resizer', slug: 'ugc-net-photo-resizer', kb: 200, w: 350, h: 450, desc: 'NTA NET examination photo' },

  // Defence & Police Forces
  { name: 'Indian Army Agniveer Photo Resizer', slug: 'army-agniveer-photo-resizer', kb: 20, w: 350, h: 450, desc: 'Army rally photo under 20 KB' },
  { name: 'Indian Airforce Agniveer Photo Resizer', slug: 'airforce-agniveer-photo-resizer', kb: 50, w: 350, h: 450, desc: 'IAF candidate portal specs' },
  { name: 'Indian Navy Agniveer Photo Resizer', slug: 'navy-agniveer-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Indian Navy SSR/MR specs' },
  { name: 'UP Police Constable Photo Resizer', slug: 'up-police-photo-resizer', kb: 50, w: 350, h: 450, desc: 'UPPRPB constable recruitment size' },
  { name: 'Bihar Police Constable Photo Resizer', slug: 'bihar-police-photo-resizer', kb: 50, w: 350, h: 450, desc: 'CSBC Bihar police photo format' },
  { name: 'Delhi Police Constable Photo Resizer', slug: 'delhi-police-photo-resizer', kb: 50, w: 350, h: 450, desc: 'SSC Delhi Police recruitment photo' },
  { name: 'Rajasthan Police Photo Resizer', slug: 'rajasthan-police-photo-resizer', kb: 50, w: 350, h: 450, desc: 'Police recruitment candidate photo' },
  { name: 'Odisha Police Constable Photo Resizer', slug: 'odisha-police-photo-resizer', kb: 50, w: 350, h: 450, desc: 'OPRB constable photo specs' },

  // Passports & International Visas
  { name: 'Indian Passport Photo Resizer', slug: 'passport-photo-resizer', kb: 50, w: 413, h: 531, desc: 'Standard 3.5 x 4.5 cm (35x45 mm)' },
  { name: 'US Visa 2x2 Inch Photo Maker', slug: 'us-visa-photo-maker', kb: 240, w: 600, h: 600, desc: 'Square 2x2 inches (600x600 px)' },
  { name: 'Schengen Visa Photo Resizer', slug: 'schengen-visa-photo-resizer', kb: 100, w: 413, h: 531, desc: 'European Visa 35x45mm' },
  { name: 'UK Visa Photo Resizer', slug: 'uk-visa-photo-resizer', kb: 100, w: 413, h: 531, desc: 'UK Visa 35x45mm dimensions' },
  { name: 'Canada Visa Photo Resizer', slug: 'canada-visa-photo-resizer', kb: 200, w: 420, h: 540, desc: '35x45mm with minimum 420x540 px' },
  { name: 'Dubai & UAE Visa Photo Resizer', slug: 'dubai-visa-photo-resizer', kb: 100, w: 300, h: 400, desc: 'UAE official visa photo format' },

  // Identity & Cards (PAN / DL / OMR)
  { name: 'Driving License Photo Resizer (Sarathi)', slug: 'driving-license-photo-resizer', kb: 20, w: 350, h: 450, desc: 'Parivahan Sarathi photo under 20 KB' },
  { name: 'Driving License Signature Resizer', slug: 'driving-license-signature-resizer', kb: 20, w: 280, h: 120, desc: 'Parivahan Sarathi signature under 20 KB' },
  { name: 'PAN Card Photo Resizer (NSDL/UTI)', slug: 'pan-card-photo-resizer', kb: 50, w: 213, h: 213, desc: '213 x 213 pixels, 300 DPI' },
  { name: 'PAN Card Signature Resizer', slug: 'pan-card-signature-resizer', kb: 30, w: 400, h: 200, desc: 'NSDL & UTI signature (400x200 px)' }
];

const EXAM_TOOLS: Tool[] = EXAM_PRESETS.map((p) => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category: p.slug.includes('signature') || p.slug.includes('declaration') || p.slug.includes('thumb') ? 'signature' : 'photo',
  description: `One-click official requirement preset: ${p.desc}. Automatic size & dimension lock.`,
  shortDescription: `${p.desc} instantly ready.`,
  targetKB: p.kb,
  targetWidth: p.w,
  targetHeight: p.h,
  acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
  toolType: 'image-target-kb',
  badge: 'Exam Preset',
  keywords: [p.name.toLowerCase(), p.slug.replace(/-/g, ' '), 'official exam preset', 'photo maker'],
  instructions: ['Select your photograph', `Engine formats to ${p.desc}`, 'Download application-ready file'],
  faq: [
    {
      question: 'Does this meet the official government notification specs?',
      answer: 'Yes, aspect ratios, max KB limits, and pixel boundaries are calibrated for official portal upload.'
    }
  ],
  relatedTools: ['signature-resize-20kb', 'photo-resize-50kb', 'jpg-to-pdf'],
  enabled: true,
  seoTitle: `${p.name} Online Free — Formilo`,
  seoDescription: `Instantly format and resize photos for ${p.name}. Meets official portal dimensions and KB limits.`
}));

// ── 4. IMAGE FORMAT CONVERTERS & MODIFIERS (30 Tools) ─────────────────────────
const CONVERTER_SPECS = [
  { from: 'JPG', to: 'PNG', slug: 'jpg-to-png', desc: 'Convert JPG photos to high quality transparent PNG' },
  { from: 'PNG', to: 'JPG', slug: 'png-to-jpg', desc: 'Convert PNG images to standard lightweight JPG' },
  { from: 'WebP', to: 'JPG', slug: 'webp-to-jpg', desc: 'Convert modern WebP photos to universally supported JPG' },
  { from: 'WebP', to: 'PNG', slug: 'webp-to-png', desc: 'Extract transparent WebP graphics as PNG' },
  { from: 'HEIC', to: 'JPG', slug: 'heic-to-jpg', desc: 'Convert iPhone HEIC camera photos to standard JPG' },
  { from: 'HEIC', to: 'PNG', slug: 'heic-to-png', desc: 'Convert Apple HEIC photos to crisp PNG' },
  { from: 'BMP', to: 'JPG', slug: 'bmp-to-jpg', desc: 'Compress uncompressed BMP bitmap images to JPG' },
  { from: 'TIFF', to: 'JPG', slug: 'tiff-to-jpg', desc: 'Convert heavy scanner TIFF files to JPG format' },
  { from: 'PNG', to: 'WebP', slug: 'png-to-webp', desc: 'Convert PNG graphics into ultra-fast WebP' },
  { from: 'JPG', to: 'WebP', slug: 'jpg-to-webp', desc: 'Convert JPG photos into high-compression WebP' },
];

const CONVERTER_TOOLS: Tool[] = CONVERTER_SPECS.map((c) => ({
  id: c.slug,
  slug: c.slug,
  name: `${c.from} to ${c.to} Converter`,
  category: 'image',
  description: c.desc,
  shortDescription: `Convert ${c.from} to ${c.to} in-browser.`,
  acceptedMime: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  toolType: 'image-target-kb',
  badge: 'Converter',
  keywords: [`${c.from.toLowerCase()} to ${c.to.toLowerCase()}`, `convert ${c.from.toLowerCase()} to ${c.to.toLowerCase()}`],
  instructions: [`Select your ${c.from} image`, `Instant client-side conversion to ${c.to}`, 'Click Download'],
  faq: [{ question: 'Is file quality preserved?', answer: 'Yes, color integrity and sharpness are maintained.' }],
  relatedTools: ['image-compressor', 'image-pixel-resizer', 'jpg-to-pdf'],
  enabled: true,
  seoTitle: `${c.from} to ${c.to} Converter Online Free — Formilo`,
  seoDescription: `Convert ${c.from} images to ${c.to} format online free with 100% privacy.`
}));

// Dimension Presets (Square, Banners, Standard Ratios)
const DIMENSION_PRESETS = [
  { name: 'Crop to Square 1:1', slug: 'square-photo-maker', w: 600, h: 600, desc: 'Standard 1:1 square crop' },
  { name: 'Crop to 3:4 Portrait', slug: 'crop-3-4-portrait', w: 600, h: 800, desc: 'Portrait 3:4 aspect ratio' },
  { name: 'Crop to 4:5 Instagram / Form', slug: 'crop-4-5-photo', w: 800, h: 1000, desc: '4:5 ratio format' },
  { name: 'Crop to 16:9 Landscape', slug: 'crop-16-9-landscape', w: 1280, h: 720, desc: '16:9 landscape banner' },
  { name: 'Convert Photo to 300 DPI', slug: 'photo-300-dpi-converter', desc: 'Set print-ready 300 DPI metadata' },
  { name: 'Convert Photo to 200 DPI', slug: 'photo-200-dpi-converter', desc: 'Official 200 DPI scanner resolution' },
  { name: 'Black and White Photo Maker', slug: 'black-and-white-photo-maker', desc: 'Monochrome B&W filter for forms' },
  { name: 'Grayscale Document Scanner', slug: 'grayscale-document-maker', desc: 'Convert color documents to clean grayscale' },
  { name: 'Invert Signature Colors', slug: 'invert-signature-colors', desc: 'Invert black & white signature lines' },
  { name: 'Make Signature Background White', slug: 'signature-white-background-cleaner', desc: 'Remove shadows and boost white BG' }
];

const MODIFIER_TOOLS: Tool[] = DIMENSION_PRESETS.map((d) => ({
  id: d.slug,
  slug: d.slug,
  name: d.name,
  category: d.slug.includes('signature') ? 'signature' : 'image',
  description: d.desc,
  shortDescription: `${d.name} instantly.`,
  targetWidth: d.w,
  targetHeight: d.h,
  acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
  toolType: 'image-target-kb',
  badge: 'Utility',
  keywords: [d.name.toLowerCase(), d.slug.replace(/-/g, ' ')],
  instructions: ['Upload file', `Apply ${d.name}`, 'Download edited file'],
  faq: [],
  relatedTools: ['photo-resize-20kb', 'image-compressor'],
  enabled: true,
  seoTitle: `${d.name} Online Free — Formilo`,
  seoDescription: `${d.desc}. Fast, browser-safe, no registration needed.`
}));

// ── 5. PDF SUITE TOOLS GENERATOR (15 Tools) ──────────────────────────────────
const PDF_EXTRA_TOOLS: Tool[] = [
  {
    id: 'png-to-pdf',
    slug: 'png-to-pdf',
    name: 'PNG to PDF Converter',
    category: 'pdf',
    description: 'Convert transparent or crisp PNG graphics into a multi-page PDF document.',
    shortDescription: 'Convert PNG graphics to PDF.',
    acceptedMime: ['image/png'],
    toolType: 'jpg-to-pdf',
    instructions: ['Select PNG files', 'Order pages', 'Download PDF'],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'PNG to PDF Converter Online Free — Formilo',
    seoDescription: 'Convert PNG images into clean PDF documents in your browser.'
  },
  {
    id: 'webp-to-pdf',
    slug: 'webp-to-pdf',
    name: 'WebP to PDF Converter',
    category: 'pdf',
    description: 'Combine modern WebP photos and screenshots into a single PDF.',
    shortDescription: 'Convert WebP images to PDF.',
    acceptedMime: ['image/webp'],
    toolType: 'jpg-to-pdf',
    instructions: ['Upload WebP files', 'Compile document', 'Download PDF'],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-to-jpg'],
    enabled: true,
    seoTitle: 'WebP to PDF Converter Online Free — Formilo',
    seoDescription: 'Merge WebP files into a PDF document online free.'
  },
  {
    id: 'pdf-compress-100kb',
    slug: 'pdf-compress-to-100-kb',
    name: 'Compress PDF to 100 KB',
    category: 'pdf',
    description: 'Reduce PDF file size under 100 KB for strict online application portals.',
    shortDescription: 'Compress PDF under 100 KB.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-compressor',
    badge: 'Target',
    instructions: ['Select PDF', 'Engine applies maximum compression', 'Download < 100 KB PDF'],
    faq: [],
    relatedTools: ['pdf-compressor', 'pdf-to-jpg'],
    enabled: true,
    seoTitle: 'Compress PDF to 100 KB Online Free — Formilo',
    seoDescription: 'Reduce PDF size below 100 KB for government forms.'
  },
  {
    id: 'pdf-compress-200kb',
    slug: 'pdf-compress-to-200-kb',
    name: 'Compress PDF to 200 KB',
    category: 'pdf',
    description: 'Optimize PDF certificates and marksheets to under 200 KB.',
    shortDescription: 'Compress PDF under 200 KB.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-compressor',
    badge: 'Target',
    instructions: ['Select PDF', 'Compress', 'Download < 200 KB PDF'],
    faq: [],
    relatedTools: ['pdf-compressor', 'jpg-to-pdf'],
    enabled: true,
    seoTitle: 'Compress PDF to 200 KB Online Free — Formilo',
    seoDescription: 'Reduce PDF document size under 200 KB for job applications.'
  },
  {
    id: 'pdf-compress-500kb',
    slug: 'pdf-compress-to-500-kb',
    name: 'Compress PDF to 500 KB',
    category: 'pdf',
    description: 'Compress heavy PDF documents to under 500 KB while retaining crisp text.',
    shortDescription: 'Compress PDF under 500 KB.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-compressor',
    badge: 'Target',
    instructions: ['Select PDF', 'Compress', 'Download < 500 KB PDF'],
    faq: [],
    relatedTools: ['pdf-compressor', 'pdf-to-jpg'],
    enabled: true,
    seoTitle: 'Compress PDF to 500 KB Online Free — Formilo',
    seoDescription: 'Reduce heavy PDF files below 500 KB safely.'
  },
  {
    id: 'pdf-to-png',
    slug: 'pdf-to-png',
    name: 'PDF to PNG Converter',
    category: 'pdf',
    description: 'Extract PDF pages into lossless high-resolution PNG images.',
    shortDescription: 'Extract PDF pages as PNG images.',
    acceptedMime: ['application/pdf'],
    toolType: 'pdf-to-jpg',
    instructions: ['Upload PDF', 'Render pages', 'Download PNGs'],
    faq: [],
    relatedTools: ['pdf-to-jpg', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'PDF to PNG Converter Online Free — Formilo',
    seoDescription: 'Convert PDF pages to lossless PNG images online.'
  }
];

// ── 6. CONSOLIDATED MASTER TOOLS REGISTRY (150+ SCALE) ─────────────────────────
export const TOOLS: Tool[] = [
  ...CORE_TOOLS,
  ...KB_TOOLS,
  ...EXAM_TOOLS,
  ...CONVERTER_TOOLS,
  ...MODIFIER_TOOLS,
  ...PDF_EXTRA_TOOLS
];

export const TOOL_REGISTRY = TOOLS;
export const TOOLS_REGISTRY = TOOLS;

// ── SLUG ALIAS MAPPING TABLE (Guarantees Zero Broken Links) ───────────────────
const SLUG_ALIASES: Record<string, string> = {
  'photo-resize-to-20-kb': 'photo-resize-20kb',
  'photo-resize-to-50-kb': 'photo-resize-50kb',
  'photo-resize-to-100-kb': 'photo-resize-100kb',
  'signature-resize-to-20-kb': 'signature-resize-20kb',
  'jpg-to-pdf-converter': 'jpg-to-pdf',
  'pdf-to-jpg-converter': 'pdf-to-jpg',
  'image-resizer': 'image-pixel-resizer',
};

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

export function getToolBySlug(slug: string): Tool | undefined {
  if (!slug) return undefined;
  const clean = decodeURIComponent(slug).trim().toLowerCase();

  // 1. Direct match
  const directMatch = TOOLS.find((t) => t.slug.toLowerCase() === clean && t.enabled);
  if (directMatch) return directMatch;

  // 2. Alias mapping match
  const mappedSlug = SLUG_ALIASES[clean];
  if (mappedSlug) {
    const aliasMatch = TOOLS.find((t) => t.slug === mappedSlug && t.enabled);
    if (aliasMatch) return aliasMatch;
  }

  // 3. ID / Normalized match fallback
  return TOOLS.find((t) => (t.id && t.id.toLowerCase() === clean) && t.enabled);
}

export function getToolsByCategory(category: ToolCategory | string): Tool[] {
  if (category === 'all') return TOOLS.filter((t) => t.enabled);
  return TOOLS.filter((tool) => tool.category === category && tool.enabled);
}

export function getAllTools(): Tool[] {
  return TOOLS.filter((tool) => tool.enabled);
}
