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
    description: 'Compress and resize your photos to under 20 KB for online applications, government forms, and job portals.',
    shortDescription: 'Resize photos to less than 20 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 20,
    keywords: ['photo resize 20kb', 'compress photo to 20kb', 'image resizer online', 'passport photo 20kb'],
    seoTitle: 'Resize Photo to 20 KB Online Free | Formilo',
    seoDescription: 'Compress and resize JPG, PNG images to less than 20 KB online for free without losing quality. 100% browser-based & private.',
    instructions: [
      'Upload your image using the drag-and-drop box or click to select.',
      'The engine automatically compresses the photo to meet the 20 KB limit.',
      'Preview the processed image along with original and new file sizes.',
      'Click "Download Image" to save your file.'
    ],
    faq: [
      {
        question: 'Why do online forms require images under 20 KB?',
        answer: 'Many portals restrict upload file sizes to optimize storage and speed up processing. This tool reduces image size while maintaining readability.'
      },
      {
        question: 'Are my uploaded photos safe?',
        answer: 'Yes. All processing happens locally in your browser using JavaScript and HTML5 Canvas. Your photo is never sent to any server.'
      }
    ],
    relatedTools: ['photo-resize-50kb', 'photo-resize-100kb', 'signature-resize-20kb', 'image-compressor'],
    enabled: true
  },
  {
    slug: 'photo-resize-50kb',
    name: 'Photo Resize to 50 KB',
    category: 'photo',
    description: 'Quickly resize and compress images to under 50 KB while preserving clarity.',
    shortDescription: 'Resize photos to less than 50 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 50,
    keywords: ['photo resize 50kb', 'compress photo to 50kb', 'image resizer 50 kb'],
    seoTitle: 'Resize Photo to 50 KB Online Free | Formilo',
    seoDescription: 'Compress and resize photos to less than 50 KB online for free. Fast, browser-side image processing.',
    instructions: [
      'Select or drag your image into the drop zone.',
      'The tool automatically optimizes image quality to achieve a size under 50 KB.',
      'Review the before/after file size and download the result.'
    ],
    faq: [
      {
        question: 'What image formats are supported?',
        answer: 'We support JPG, JPEG, PNG, and WebP image formats.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-100kb', 'signature-resize-20kb', 'image-resizer'],
    enabled: true
  },
  {
    slug: 'photo-resize-100kb',
    name: 'Photo Resize to 100 KB',
    category: 'photo',
    description: 'Compress high-resolution photos down to 100 KB for web submissions.',
    shortDescription: 'Resize photos to less than 100 KB instantly.',
    icon: 'ImageIcon',
    toolType: 'image-target-kb',
    targetKB: 100,
    keywords: ['photo resize 100kb', 'compress image 100kb', 'jpg compressor 100kb'],
    seoTitle: 'Resize Photo to 100 KB Online Free | Formilo',
    seoDescription: 'Compress images to under 100 KB online. Safe, fast, and free browser-based processing.',
    instructions: [
      'Upload your image.',
      'Wait for automatic binary-search compression to reach < 100 KB.',
      'Download your optimized file.'
    ],
    faq: [
      {
        question: 'Will image quality drop significantly?',
        answer: 'Our algorithm uses adaptive binary search encoding to maintain maximum possible visual quality while staying under 100 KB.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-50kb', 'image-compressor', 'image-resizer'],
    enabled: true
  },
  {
    slug: 'signature-resize-20kb',
    name: 'Signature Resize to 20 KB',
    category: 'signature',
    description: 'Resize scanned signature images to under 20 KB with crisp contrast for official forms.',
    shortDescription: 'Resize signature images to under 20 KB.',
    icon: 'PencilIcon',
    toolType: 'image-target-kb',
    targetKB: 20,
    isSignature: true,
    keywords: ['signature resize 20kb', 'signature compress 20kb', 'online signature resizer'],
    seoTitle: 'Signature Resize to 20 KB Online Free | Formilo',
    seoDescription: 'Resize and compress scanned signature photos to under 20 KB. Fast and private signature processing.',
    instructions: [
      'Upload a scanned photo or image of your signature.',
      'The tool processes and compresses the signature to under 20 KB.',
      'Download the resized signature.'
    ],
    faq: [
      {
        question: 'Is my signature uploaded to any server?',
        answer: 'No. All processing occurs inside your device browser memory. Nothing is transmitted over the network.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-50kb', 'image-resizer'],
    enabled: true
  },
  {
    slug: 'image-resizer',
    name: 'Image Pixel Resizer',
    category: 'image',
    description: 'Change image dimensions in pixels with custom width, height, and aspect ratio locking.',
    shortDescription: 'Resize images by width and height in pixels.',
    icon: 'AspectIcon',
    toolType: 'image-resizer',
    keywords: ['image pixel resizer', 'change image dimensions', 'resize photo pixels'],
    seoTitle: 'Online Image Pixel Resizer | Formilo',
    seoDescription: 'Resize image dimensions in pixels online. Maintain aspect ratio or set custom width and height.',
    instructions: [
      'Upload your image.',
      'Specify desired width and height in pixels or choose a percentage preset.',
      'Toggle "Lock Aspect Ratio" as needed.',
      'Download the resized image.'
    ],
    faq: [
      {
        question: 'Does this tool change file format?',
        answer: 'You can choose to keep the original format or export as JPG, PNG, or WebP.'
      }
    ],
    relatedTools: ['image-compressor', 'passport-photo-resizer', 'photo-resize-50kb'],
    enabled: true
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress images with dynamic quality adjustment and real-time size reduction preview.',
    shortDescription: 'Compress JPG, PNG, and WebP files easily.',
    icon: 'CompressIcon',
    toolType: 'image-compressor',
    keywords: ['image compressor', 'compress jpg', 'reduce photo file size'],
    seoTitle: 'Free Online Image Compressor | Formilo',
    seoDescription: 'Compress images online with adjustable quality slider. See live file size reduction before downloading.',
    instructions: [
      'Upload your file.',
      'Adjust the quality slider to find your desired balance between file size and visual fidelity.',
      'Click Download to save the compressed file.'
    ],
    faq: [
      {
        question: 'Which format gives best compression ratio?',
        answer: 'WebP and JPEG typically offer superior compression compared to PNG for photographic images.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'image-resizer', 'pdf-compressor'],
    enabled: true
  },
  {
    slug: 'passport-photo-resizer',
    name: 'Passport Photo Resizer',
    category: 'photo',
    description: 'Resize photos to standard passport dimensions (3.5x4.5 cm, 2x2 inches, or custom mm).',
    shortDescription: 'Format images to standard passport dimensions.',
    icon: 'UserSquareIcon',
    toolType: 'passport-photo',
    keywords: ['passport photo resizer', '3.5 x 4.5 cm photo maker', '2x2 inch photo resizer'],
    seoTitle: 'Passport Photo Resizer & Cropper Online | Formilo',
    seoDescription: 'Format photos to standard passport dimensions in cm or inches online for application forms.',
    instructions: [
      'Upload a clear front-facing photograph.',
      'Select standard preset dimensions (e.g., 3.5cm x 4.5cm or 2 x 2 inches).',
      'Download the formatted photo.'
    ],
    faq: [
      {
        question: 'Is this officially certified?',
        answer: 'No. This utility formats images to common physical dimension requirements. Always verify specific specifications required by your issuing authority.'
      }
    ],
    relatedTools: ['photo-resize-20kb', 'photo-resize-50kb', 'signature-resize-20kb'],
    enabled: true
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    description: 'Convert multiple JPG or PNG images into a single clean PDF document.',
    shortDescription: 'Combine images into a PDF document.',
    icon: 'PdfIcon',
    toolType: 'jpg-to-pdf',
    keywords: ['jpg to pdf', 'convert image to pdf', 'combine photos into pdf'],
    seoTitle: 'Convert JPG to PDF Online Free | Formilo',
    seoDescription: 'Convert images (JPG, PNG) into a single PDF document online. Clean, secure, browser-side conversion.',
    instructions: [
      'Upload one or more images.',
      'Reorder images if required.',
      'Select page orientation and margin preferences.',
      'Click "Generate PDF" and download.'
    ],
    faq: [
      {
        question: 'Can I combine multiple photos into one PDF?',
        answer: 'Yes, you can upload multiple images and merge them sequentially into a single PDF file.'
      }
    ],
    relatedTools: ['pdf-to-jpg', 'pdf-compressor', 'image-compressor'],
    enabled: true
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'pdf',
    description: 'Extract PDF pages and convert them into high-quality JPEG images.',
    shortDescription: 'Extract PDF pages as JPG images.',
    icon: 'FileImageIcon',
    toolType: 'pdf-to-jpg',
    keywords: ['pdf to jpg', 'convert pdf to image', 'extract pdf pages'],
    seoTitle: 'Convert PDF to JPG Online Free | Formilo',
    seoDescription: 'Extract pages from PDF files and save them as individual JPG images in your browser.',
    instructions: [
      'Upload your PDF document.',
      'Select pages to convert or convert all pages.',
      'Download extracted images.'
    ],
    faq: [
      {
        question: 'Are PDF files uploaded to server?',
        answer: 'No, PDF rendering is executed locally via browser Canvas/PDF render APIs.'
      }
    ],
    relatedTools: ['jpg-to-pdf', 'pdf-compressor', 'image-resizer'],
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
    keywords: ['pdf compressor', 'reduce pdf size', 'shrink pdf file'],
    seoTitle: 'Compress PDF Online Free | Formilo',
    seoDescription: 'Reduce PDF file size in browser while maintaining document readability.',
    instructions: [
      'Select your PDF file.',
      'Choose compression level.',
      'Download optimized PDF.'
    ],
    faq: [
      {
        question: 'How does client-side PDF compression work?',
        answer: 'The engine re-encodes embedded image streams and strips unnecessary metadata within browser memory.'
      }
    ],
    relatedTools: ['jpg-to-pdf', 'pdf-to-jpg', 'image-compressor'],
    enabled: true
  }
];
