export type ToolCategory = 'photo' | 'pdf' | 'signature' | 'image' | 'form';

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  category: ToolCategory;
  badge?: string;
  targetKB?: number;
  acceptedMime: string[];
  features: string[];
  icon: string;
  toolType: string;
  keywords: string[];
  enabled: boolean;
  seoTitle: string;
  seoDescription: string;
  instructions: string[];
  faq: { question: string; answer: string }[];
  relatedTools: string[];
}

export const TOOL_REGISTRY: ToolConfig[] = [
  // Photo Tools
  {
    id: 'photo-resize-20kb',
    slug: 'photo-resize-to-20-kb',
    name: 'Photo Resize to 20 KB',
    title: 'Photo Resize to 20 KB',
    description: 'Resize passport and form photos under 20 KB instantly.',
    category: 'photo',
    badge: 'Popular',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Instant compression', 'Maintains aspect ratio', 'Client-side safe'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['photo resize', '20kb photo', 'ssc photo', 'passport photo 20kb'],
    enabled: true,
    seoTitle: 'Photo Resize to 20 KB Online - Formilo',
    seoDescription: 'Free online tool to resize photo to 20 KB for online application forms.',
    instructions: ['Upload your image', 'Preview the output file size', 'Click Download Image'],
    faq: [{ question: 'Is it completely free?', answer: 'Yes, 100% free with no watermark or limits.' }],
    relatedTools: ['photo-resize-to-50-kb', 'signature-resize-to-20-kb']
  },
  {
    id: 'photo-resize-50kb',
    slug: 'photo-resize-to-50-kb',
    name: 'Photo Resize to 50 KB',
    title: 'Photo Resize to 50 KB',
    description: 'Compress candidate photos under 50 KB for online portals.',
    category: 'photo',
    badge: 'Fast',
    targetKB: 50,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Direct export', 'Custom dimensions', 'No quality loss'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['photo resize 50kb', 'admit card photo', 'upsc photo resize'],
    enabled: true,
    seoTitle: 'Photo Resize to 50 KB Online - Formilo',
    seoDescription: 'Compress and resize photos to under 50 KB for government exams.',
    instructions: ['Select photo', 'Check preview', 'Download'],
    faq: [{ question: 'Does it reduce quality?', answer: 'Our binary search engine maintains maximum possible clarity.' }],
    relatedTools: ['photo-resize-to-20-kb', 'passport-photo-resizer']
  },
  {
    id: 'photo-resize-100kb',
    slug: 'photo-resize-to-100-kb',
    name: 'Photo Resize to 100 KB',
    title: 'Photo Resize to 100 KB',
    description: 'Optimize high-res photos to under 100 KB.',
    category: 'photo',
    targetKB: 100,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Fast compression', 'Lossless tuning'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['photo resize 100kb', 'image compress 100kb'],
    enabled: true,
    seoTitle: 'Photo Resize to 100 KB - Formilo',
    seoDescription: 'Resize photos under 100 KB without quality loss.',
    instructions: ['Upload photo', 'Download 100 KB image'],
    faq: [],
    relatedTools: ['photo-resize-to-50-kb']
  },
  {
    id: 'passport-photo-resizer',
    slug: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    title: 'Passport Photo Resizer',
    description: 'Format photos to standard 3.5 x 4.5 cm passport dimensions.',
    category: 'photo',
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Standard 35x45mm', 'White background boost', '300 DPI support'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['passport photo maker', '3.5x4.5 photo size'],
    enabled: true,
    seoTitle: 'Passport Photo Resizer (3.5 x 4.5 cm) - Formilo',
    seoDescription: 'Resize and crop passport photos online accurately.',
    instructions: ['Upload passport photo', 'Crop face', 'Download ready photo'],
    faq: [],
    relatedTools: ['photo-resize-to-20-kb', 'signature-resize-to-20-kb']
  },

  // Signature Tools
  {
    id: 'signature-resize-20kb',
    slug: 'signature-resize-to-20-kb',
    name: 'Signature Resize to 20 KB',
    title: 'Signature Resize to 20 KB',
    description: 'Clean signature background and compress under 20 KB.',
    category: 'signature',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Background cleanup', 'Aspect ratio lock', 'Max 20 KB'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['signature resize 20kb', 'online signature 20kb'],
    enabled: true,
    seoTitle: 'Signature Resize to 20 KB - Formilo',
    seoDescription: 'Resize signature to under 20 KB with crisp white background.',
    instructions: ['Upload signature crop', 'Clean background', 'Download signature'],
    faq: [],
    relatedTools: ['photo-resize-to-20-kb']
  },

  // Image Tools
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Smart Image Compressor',
    title: 'Smart Image Compressor',
    description: 'Compress JPG, PNG, and WebP files up to 90% without quality drop.',
    category: 'image',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Lossy/Lossless modes', 'Multi-format support', 'Real-time preview'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['image compressor', 'compress jpg', 'compress png'],
    enabled: true,
    seoTitle: 'Smart Image Compressor Online - Formilo',
    seoDescription: 'Compress images safely in browser without uploading to server.',
    instructions: ['Upload image', 'Adjust compression level', 'Download compressed file'],
    faq: [],
    relatedTools: ['image-pixel-resizer']
  },
  {
    id: 'image-pixel-resizer',
    slug: 'image-pixel-resizer',
    name: 'Image Pixel Resizer',
    title: 'Image Pixel Resizer',
    description: 'Resize image width and height precisely in pixels or percent.',
    category: 'image',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Custom WxH', 'Maintain aspect ratio', 'Batch sizing'],
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    keywords: ['resize image pixels', 'image dimension resizer'],
    enabled: true,
    seoTitle: 'Image Pixel Resizer - Formilo',
    seoDescription: 'Change width and height of images in exact pixels.',
    instructions: ['Upload image', 'Enter width and height', 'Download'],
    faq: [],
    relatedTools: ['image-compressor']
  },

  // PDF Tools
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf-converter',
    name: 'JPG to PDF Converter',
    title: 'JPG to PDF Converter',
    description: 'Combine multiple JPG/PNG images into a single PDF document.',
    category: 'pdf',
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Multi-page support', 'Drag & drop reorder', 'Instant PDF generation'],
    icon: 'FileText',
    toolType: 'jpg-to-pdf',
    keywords: ['jpg to pdf', 'images to pdf', 'photo to pdf converter'],
    enabled: true,
    seoTitle: 'JPG to PDF Converter Online - Formilo',
    seoDescription: 'Convert multiple photos into a single PDF file instantly.',
    instructions: ['Select multiple images', 'Reorder pages', 'Download PDF document'],
    faq: [],
    relatedTools: ['pdf-to-jpg-converter', 'pdf-compressor']
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg-converter',
    name: 'PDF to JPG Converter',
    title: 'PDF to JPG Converter',
    description: 'Extract high-resolution JPG pages from any PDF document.',
    category: 'pdf',
    acceptedMime: ['application/pdf'],
    features: ['Extract all pages', 'ZIP download', 'High DPI render'],
    icon: 'FileText',
    toolType: 'pdf-to-jpg',
    keywords: ['pdf to jpg', 'pdf to image converter'],
    enabled: true,
    seoTitle: 'PDF to JPG Converter Online - Formilo',
    seoDescription: 'Extract pages from PDF to JPG files in high quality.',
    instructions: ['Upload PDF', 'Choose pages', 'Download JPG images'],
    faq: [],
    relatedTools: ['jpg-to-pdf-converter']
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    title: 'PDF Compressor',
    description: 'Safely reduce PDF document size directly in your browser.',
    category: 'pdf',
    acceptedMime: ['application/pdf'],
    features: ['Client-side safe', 'Fast rendering'],
    icon: 'FileText',
    toolType: 'pdf-compressor',
    keywords: ['compress pdf', 'reduce pdf size'],
    enabled: true,
    seoTitle: 'PDF Compressor Online - Formilo',
    seoDescription: 'Compress heavy PDF files without losing readability.',
    instructions: ['Select PDF file', 'Wait for compression', 'Download compressed PDF'],
    faq: [],
    relatedTools: ['jpg-to-pdf-converter']
  }
];

// Aliases for compatibility across components
export const TOOLS = TOOL_REGISTRY;
export const TOOLS_REGISTRY = TOOL_REGISTRY;

export function getToolBySlug(slug: string): ToolConfig | undefined {
  const clean = (slug || '').toLowerCase().trim();
  return TOOL_REGISTRY.find(
    (t) => t.slug.toLowerCase().trim() === clean || t.id.toLowerCase().trim() === clean
  );
}

export function getToolsByCategory(category: ToolCategory | string): ToolConfig[] {
  return TOOL_REGISTRY.filter((t) => t.category === category && t.enabled);
}
