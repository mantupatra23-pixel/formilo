export type ToolCategory = 'photo' | 'image' | 'pdf' | 'signature' | 'form';

export interface Tool {
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
}

export const TOOLS: Tool[] = [
  {
    slug: 'photo-resize-20kb',
    name: 'Photo Resize to 20 KB',
    category: 'photo',
    description: 'Compress and resize photos to under 20 KB for official application forms and job portals.',
    shortDescription: 'Resize photos to less than 20 KB instantly.',
    targetKB: 20,
    instructions: [
      'Upload your image.',
      'The tool automatically optimizes the file size under 20 KB.',
      'Preview the compressed result and click Download.'
    ],
    faq: [
      {
        question: 'Are my files safe?',
        answer: 'Yes, processing happens locally in your browser memory.'
      }
    ],
    relatedTools: ['photo-resize-50kb', 'photo-resize-100kb', 'signature-resize-20kb'],
    enabled: true,
    seoTitle: 'Photo Resize to 20 KB Online — Free | Formilo',
    seoDescription: 'Compress and resize JPG/PNG photos under 20 KB online for free.'
  },
  {
    slug: 'photo-resize-50kb',
    name: 'Photo Resize to 50 KB',
    category: 'photo',
    description: 'Resize and compress photos to under 50 KB while maintaining visual quality.',
    shortDescription: 'Resize photos to less than 50 KB instantly.',
    targetKB: 50,
    instructions: [
      'Upload your photo.',
      'Automated compression reduces size to under 50 KB.',
      'Download your formatted file.'
    ],
    faq: [
      {
        question: 'What formats are supported?',
        answer: 'JPG, JPEG, PNG, and WebP.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-100kb', 'passport-photo-resizer'],
    enabled: true,
    seoTitle: 'Photo Resize to 50 KB Online — Free | Formilo',
    seoDescription: 'Compress photos to under 50 KB online free.'
  },
  {
    slug: 'photo-resize-100kb',
    name: 'Photo Resize to 100 KB',
    category: 'photo',
    description: 'Compress high-resolution photos down to 100 KB.',
    shortDescription: 'Resize photos to less than 100 KB instantly.',
    targetKB: 100,
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
    slug: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    category: 'photo',
    description: 'Format photos to standard passport dimensions (3.5x4.5 cm / 2x2 inches).',
    shortDescription: 'Format images to standard passport dimensions.',
    instructions: [
      'Upload your front-facing photograph.',
      'Select preset passport dimensions.',
      'Download formatted image.'
    ],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'signature-resize-20kb'],
    enabled: true,
    seoTitle: 'Passport Photo Resizer Online — Free | Formilo',
    seoDescription: 'Resize photos to standard passport dimensions online.'
  },
  {
    slug: 'signature-resize-20kb',
    name: 'Signature Resize to 20 KB',
    category: 'signature',
    description: 'Resize scanned signature photos to under 20 KB with sharp contrast.',
    shortDescription: 'Resize signature images to under 20 KB.',
    targetKB: 20,
    instructions: [
      'Upload scanned signature.',
      'The engine compresses it under 20 KB.',
      'Download formatted signature.'
    ],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true,
    seoTitle: 'Signature Resize to 20 KB Online — Free | Formilo',
    seoDescription: 'Resize scanned signature images under 20 KB online.'
  },
  {
    slug: 'image-pixel-resizer',
    name: 'Image Pixel Resizer',
    category: 'image',
    description: 'Change image width and height in pixels with aspect ratio controls.',
    shortDescription: 'Resize images by width and height in pixels.',
    instructions: [
      'Upload image file.',
      'Enter custom pixel dimensions.',
      'Download resized file.'
    ],
    faq: [],
    relatedTools: ['image-compressor', 'photo-resize-50kb'],
    enabled: true,
    seoTitle: 'Image Pixel Resizer Online — Free | Formilo',
    seoDescription: 'Resize image dimensions in pixels online for free.'
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress JPG, PNG, and WebP files with visual preview.',
    shortDescription: 'Compress JPG, PNG, and WebP files easily.',
    instructions: [
      'Select file to compress.',
      'Preview compressed file size.',
      'Download optimized image.'
    ],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true,
    seoTitle: 'Image Compressor Online — Free | Formilo',
    seoDescription: 'Compress image files online without losing quality.'
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    description: 'Combine multiple JPG or PNG images into a clean PDF document.',
    shortDescription: 'Combine images into a PDF document.',
    instructions: [
      'Upload one or more images.',
      'Reorder pages as needed.',
      'Generate and download PDF.'
    ],
    faq: [],
    relatedTools: ['pdf-to-jpg', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'JPG to PDF Converter Online — Free | Formilo',
    seoDescription: 'Convert JPG images to PDF documents online.'
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'pdf',
    description: 'Extract PDF document pages into high-quality JPEG images.',
    shortDescription: 'Extract PDF pages as JPG images.',
    instructions: [
      'Upload PDF file.',
      'Select pages to convert.',
      'Download JPEG files.'
    ],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-compressor'],
    enabled: true,
    seoTitle: 'PDF to JPG Converter Online — Free | Formilo',
    seoDescription: 'Extract PDF pages into JPG images online.'
  },
  {
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    description: 'Reduce PDF document file size safely.',
    shortDescription: 'Reduce PDF file size safely in-browser.',
    instructions: [
      'Upload PDF file.',
      'Select compression level.',
      'Download reduced PDF.'
    ],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-to-jpg'],
    enabled: true,
    seoTitle: 'PDF Compressor Online — Free | Formilo',
    seoDescription: 'Compress PDF files online for free.'
  }
];
