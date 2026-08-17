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

export const TOOLS: Tool[] = [
  // ── PHOTO TOOLS ───────────────────────────────────────────────────────────
  {
    id: 'photo-resize-20kb',
    slug: 'photo-resize-20kb',
    name: 'Photo Resize to 20 KB',
    category: 'photo',
    description: 'Compress and resize photos to under 20 KB for official application forms and job portals.',
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
    description: 'Resize and compress photos to under 50 KB while maintaining visual quality.',
    shortDescription: 'Resize photos to less than 50 KB instantly.',
    targetKB: 50,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Fast',
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
    id: 'photo-resize-100kb',
    slug: 'photo-resize-100kb',
    name: 'Photo Resize to 100 KB',
    category: 'photo',
    description: 'Compress high-resolution photos down to 100 KB.',
    shortDescription: 'Resize photos to less than 100 KB instantly.',
    targetKB: 100,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    keywords: ['photo resize 100kb', 'compress image 100kb'],
    instructions: [
      'Select your image file.',
      'Automatic quality adjustment optimizes size to < 100 KB.',
      'Click Download.'
    ],
    faq: [],
    relatedTools: ['photo-resize-50kb', 'image-compressor'],
    enabled: true,
    seoTitle: 'Photo Resize to 100 KB Online — Free | Formilo',
    seoDescription: 'Compress images to less than 100 KB online for free.'
  },
  {
    id: 'passport-photo-resizer',
    slug: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    category: 'photo',
    description: 'Format photos to standard passport dimensions (3.5x4.5 cm / 2x2 inches).',
    shortDescription: 'Format images to standard passport dimensions.',
    acceptedMime: ['image/jpeg', 'image/png'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    badge: 'Preset',
    keywords: ['passport photo resizer', '3.5x4.5 cm photo', 'visa photo size maker'],
    instructions: [
      'Upload your front-facing photograph.',
      'Select preset passport dimensions (3.5 x 4.5 cm).',
      'Download your application-ready passport image.'
    ],
    faq: [
      {
        question: 'Does this crop to standard passport size?',
        answer: 'Yes, it provides the standard 3.5cm x 4.5cm aspect ratio required by most passport and visa forms.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'signature-resize-20kb'],
    enabled: true,
    seoTitle: 'Passport Photo Resizer Online (3.5 x 4.5 cm) — Free | Formilo',
    seoDescription: 'Resize photos to standard passport and visa dimensions online for free.'
  },

  // ── SIGNATURE TOOLS ───────────────────────────────────────────────────────
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
    badge: 'Auto-Fit',
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

  // ── IMAGE TOOLS ───────────────────────────────────────────────────────────
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
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress JPG, PNG, and WebP files up to 90% without visible quality loss.',
    shortDescription: 'Compress JPG, PNG, and WebP files easily.',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'image-target-kb',
    icon: 'ImageIcon',
    keywords: ['image compressor', 'compress jpg', 'compress png online'],
    instructions: [
      'Select image file to compress.',
      'Preview output file size.',
      'Download optimized image.'
    ],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true,
    seoTitle: 'Image Compressor Online — Free | Formilo',
    seoDescription: 'Compress image files online without losing quality. 100% private in-browser tool.'
  },

  // ── PDF TOOLS ─────────────────────────────────────────────────────────────
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    description: 'Combine multiple JPG, PNG, or WebP images into a single professional PDF document.',
    shortDescription: 'Combine images into a PDF document.',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    toolType: 'jpg-to-pdf',
    icon: 'FileText',
    badge: 'Multi-Image',
    keywords: ['jpg to pdf', 'images to pdf converter', 'multiple photos to pdf'],
    instructions: [
      'Upload one or more images.',
      'Reorder pages as needed using the thumbnail controls.',
      'Click Convert & Download PDF.'
    ],
    faq: [
      {
        question: 'Can I upload more than 10 photos at once?',
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
  }
];

// ── COMPATIBILITY ALIASES ─────────────────────────────────────────────────────
export const TOOL_REGISTRY = TOOLS;
export const TOOLS_REGISTRY = TOOLS;

// ── SLUG ALIAS MAPPING TABLE ──────────────────────────────────────────────────
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

  // 2. Alias match
  const mappedSlug = SLUG_ALIASES[clean];
  if (mappedSlug) {
    return TOOLS.find((t) => t.slug === mappedSlug && t.enabled);
  }

  // 3. ID match fallback
  return TOOLS.find((t) => t.id && t.id.toLowerCase() === clean && t.enabled);
}

export function getToolsByCategory(category: ToolCategory | string): Tool[] {
  return TOOLS.filter((tool) => tool.category === category && tool.enabled);
}

export function getAllTools(): Tool[] {
  return TOOLS.filter((tool) => tool.enabled);
}
