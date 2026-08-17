// config/tools.ts

export type ToolCategory = 'photo' | 'pdf' | 'signature' | 'image' | 'form';

export interface ToolConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  badge?: string;
  targetKB?: number;
  acceptedMime: string[];
  features: string[];
}

export const TOOLS_REGISTRY: ToolConfig[] = [
  // Photo Tools
  {
    id: 'photo-resize-20kb',
    slug: 'photo-resize-to-20-kb',
    title: 'Photo Resize to 20 KB',
    description: 'Resize passport and form photos under 20 KB instantly.',
    category: 'photo',
    badge: 'Popular',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Instant compression', 'Maintains aspect ratio', 'Client-side safe']
  },
  {
    id: 'photo-resize-50kb',
    slug: 'photo-resize-to-50-kb',
    title: 'Photo Resize to 50 KB',
    description: 'Compress candidate photos under 50 KB for online portals.',
    category: 'photo',
    targetKB: 50,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Direct export', 'Custom dimensions', 'No quality loss']
  },
  {
    id: 'photo-resize-100kb',
    slug: 'photo-resize-to-100-kb',
    title: 'Photo Resize to 100 KB',
    description: 'Optimize high-res photos to under 100 KB.',
    category: 'photo',
    targetKB: 100,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Fast compression', 'Lossless tuning']
  },
  {
    id: 'passport-photo-resizer',
    slug: 'passport-photo-resizer',
    title: 'Passport Photo Resizer',
    description: 'Format photos to standard 3.5 x 4.5 cm passport dimensions.',
    category: 'photo',
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Standard 35x45mm', 'White background boost', '300 DPI support']
  },

  // Signature Tools
  {
    id: 'signature-resize-20kb',
    slug: 'signature-resize-to-20-kb',
    title: 'Signature Resize to 20 KB',
    description: 'Clean signature background and compress under 20 KB.',
    category: 'signature',
    targetKB: 20,
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Background cleanup', 'Aspect ratio lock', 'Max 20 KB']
  },

  // Image Tools
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    title: 'Smart Image Compressor',
    description: 'Compress JPG, PNG, and WebP files up to 90% without quality drop.',
    category: 'image',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Lossy/Lossless modes', 'Multi-format support', 'Real-time preview']
  },
  {
    id: 'image-pixel-resizer',
    slug: 'image-pixel-resizer',
    title: 'Image Pixel Resizer',
    description: 'Resize image width and height precisely in pixels or percent.',
    category: 'image',
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'],
    features: ['Custom WxH', 'Maintain aspect ratio', 'Batch sizing']
  },

  // PDF Tools
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf-converter',
    title: 'JPG to PDF Converter',
    description: 'Combine multiple JPG/PNG images into a single PDF document.',
    category: 'pdf',
    acceptedMime: ['image/jpeg', 'image/png'],
    features: ['Multi-page support', 'Drag & drop reorder', 'Instant PDF generation']
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg-converter',
    title: 'PDF to JPG Converter',
    description: 'Extract high-resolution JPG pages from any PDF document.',
    category: 'pdf',
    acceptedMime: ['application/pdf'],
    features: ['Extract all pages', 'ZIP download', 'High DPI render']
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    title: 'PDF Compressor',
    description: 'Safely reduce PDF document size directly in your browser.',
    category: 'pdf',
    acceptedMime: ['application/pdf'],
    features: ['Client-side safe', 'Fast rendering']
  }
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category);
}
