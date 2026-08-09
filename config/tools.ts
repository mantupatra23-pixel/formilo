export type ToolCategory = 'photo' | 'image' | 'pdf' | 'signature' | 'form';

export interface ToolConfig {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  shortDescription: string;
  icon: string;
  toolType: 
    | 'image-target-kb' 
    | 'image-resizer' 
    | 'image-compressor' 
    | 'passport-photo' 
    | 'jpg-to-pdf' 
    | 'pdf-to-jpg' 
    | 'pdf-compressor';
  targetKB?: number;
  isSignature?: boolean;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  instructions: string[];
  faq: { question: string; answer: string }[];
  relatedTools: string[];
  enabled: boolean;
}

export const TOOL_REGISTRY: ToolConfig[] = [
  {
    slug: 'photo-resize-20kb',
    name: 'Photo Resize to 20 KB',
    category: 'photo',
    description: 'Compress and resize your photos to under 20 KB for online applications and government forms.',
    shortDescription: 'Resize photos to less than 20 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 20,
    keywords: ['photo resize 20kb', 'compress photo to 20kb', 'image resizer online'],
    seoTitle: 'Resize Photo to 20 KB Online Free | Formilo',
    seoDescription: 'Compress and resize JPG, PNG images to less than 20 KB online for free.',
    instructions: [
      'Upload your image.',
      'The engine automatically compresses the photo to meet the 20 KB limit.',
      'Click Download to save your file.'
    ],
    faq: [],
    relatedTools: ['photo-resize-50kb', 'photo-resize-100kb', 'signature-resize-20kb'],
    enabled: true
  },
  {
    slug: 'photo-resize-50kb',
    name: 'Photo Resize to 50 KB',
    category: 'photo',
    description: 'Quickly resize and compress images to under 50 KB.',
    shortDescription: 'Resize photos to less than 50 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 50,
    keywords: ['photo resize 50kb', 'compress photo to 50kb'],
    seoTitle: 'Resize Photo to 50 KB Online Free | Formilo',
    seoDescription: 'Compress and resize photos to less than 50 KB online for free.',
    instructions: ['Select image.', 'Automatic compression under 50 KB.', 'Download file.'],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'photo-resize-100kb'],
    enabled: true
  },
  {
    slug: 'photo-resize-100kb',
    name: 'Photo Resize to 100 KB',
    category: 'photo',
    description: 'Compress high-resolution photos down to 100 KB.',
    shortDescription: 'Resize photos to less than 100 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 100,
    keywords: ['photo resize 100kb'],
    seoTitle: 'Resize Photo to 100 KB Online Free | Formilo',
    seoDescription: 'Compress images to under 100 KB online for free.',
    instructions: ['Upload image.', 'Automatic compression.', 'Download file.'],
    faq: [],
    relatedTools: ['photo-resize-50kb', 'image-compressor'],
    enabled: true
  },
  {
    slug: 'signature-resize-20kb',
    name: 'Signature Resize to 20 KB',
    category: 'signature',
    description: 'Resize scanned signature photos to under 20 KB with crisp contrast.',
    shortDescription: 'Resize signature images to under 20 KB.',
    icon: 'PencilIcon',
    toolType: 'image-target-kb',
    targetKB: 20,
    isSignature: true,
    keywords: ['signature resize 20kb', 'signature compress 20kb'],
    seoTitle: 'Signature Resize to 20 KB Online Free | Formilo',
    seoDescription: 'Resize scanned signature photos to under 20 KB.',
    instructions: ['Upload scanned signature.', 'Compress under 20 KB.', 'Download signature.'],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true
  },
  {
    slug: 'image-pixel-resizer',
    name: 'Image Pixel Resizer',
    category: 'image',
    description: 'Change image dimensions in pixels with custom width and height.',
    shortDescription: 'Resize images by width and height in pixels.',
    icon: 'AspectIcon',
    toolType: 'image-resizer',
    keywords: ['image pixel resizer', 'change image dimensions'],
    seoTitle: 'Online Image Pixel Resizer | Formilo',
    seoDescription: 'Resize image dimensions in pixels online.',
    instructions: ['Upload image.', 'Enter custom pixel dimensions.', 'Download resized image.'],
    faq: [],
    relatedTools: ['image-compressor', 'passport-photo-resizer'],
    enabled: true
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress images with dynamic quality adjustment.',
    shortDescription: 'Compress JPG, PNG, and WebP files easily.',
    icon: 'CompressIcon',
    toolType: 'image-compressor',
    keywords: ['image compressor', 'compress jpg'],
    seoTitle: 'Free Online Image Compressor | Formilo',
    seoDescription: 'Compress images online with quality slider.',
    instructions: ['Upload file.', 'Adjust compression quality.', 'Download file.'],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'image-pixel-resizer'],
    enabled: true
  },
  {
    slug: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    category: 'photo',
    description: 'Resize photos to standard passport dimensions.',
    shortDescription: 'Format images to standard passport dimensions.',
    icon: 'UserSquareIcon',
    toolType: 'passport-photo',
    keywords: ['passport photo resizer'],
    seoTitle: 'Passport Photo Resizer & Cropper Online | Formilo',
    seoDescription: 'Format photos to standard passport dimensions in cm.',
    instructions: ['Upload photo.', 'Select passport preset.', 'Download photo.'],
    faq: [],
    relatedTools: ['photo-resize-20kb', 'signature-resize-20kb'],
    enabled: true
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    description: 'Convert multiple JPG or PNG images into a single clean PDF.',
    shortDescription: 'Combine images into a PDF document.',
    icon: 'PdfIcon',
    toolType: 'jpg-to-pdf',
    keywords: ['jpg to pdf'],
    seoTitle: 'Convert JPG to PDF Online Free | Formilo',
    seoDescription: 'Convert images into a single PDF document online.',
    instructions: ['Upload images.', 'Reorder pages.', 'Download PDF.'],
    faq: [],
    relatedTools: ['pdf-to-jpg', 'pdf-compressor'],
    enabled: true
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'pdf',
    description: 'Extract PDF pages and convert them into JPEG images.',
    shortDescription: 'Extract PDF pages as JPG images.',
    icon: 'FileImageIcon',
    toolType: 'pdf-to-jpg',
    keywords: ['pdf to jpg'],
    seoTitle: 'Convert PDF to JPG Online Free | Formilo',
    seoDescription: 'Extract pages from PDF files as JPG images.',
    instructions: ['Upload PDF.', 'Select pages.', 'Download extracted images.'],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-compressor'],
    enabled: true
  },
  {
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    description: 'Reduce PDF file sizes directly inside your browser.',
    shortDescription: 'Reduce PDF file size safely in-browser.',
    icon: 'FileZipIcon',
    toolType: 'pdf-compressor',
    keywords: ['pdf compressor'],
    seoTitle: 'Compress PDF Online Free | Formilo',
    seoDescription: 'Reduce PDF file size in browser.',
    instructions: ['Select PDF file.', 'Select compression.', 'Download PDF.'],
    faq: [],
    relatedTools: ['jpg-to-pdf', 'pdf-to-jpg'],
    enabled: true
  }
];
