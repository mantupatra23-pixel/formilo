// data/masterRegistry.ts

export type ToolType =
  | 'PHOTO_RESIZER'
  | 'PHOTO_COMPRESSOR'
  | 'SIGNATURE_RESIZER'
  | 'SIGNATURE_CROPPER'
  | 'SIGNATURE_COMPRESSOR'
  | 'PDF_COMPRESSOR'
  | 'JPG_TO_PDF'
  | 'PDF_TO_JPG'
  | 'NAME_DATE_PHOTO'
  | 'THUMB_IMPRESSION'
  | 'DOCUMENT_TOOL';

export type VerificationStatus = 'verified' | 'needs_review' | 'unknown';

export interface ToolRequirements {
  dimensions: string;
  width: number;
  height: number;
  minKB: number;
  targetKB: number;
  maxKB: number;
  format: string;
  aspectRatio: string;
  background?: string;
  expressionOrInk?: string;
  dpi?: number;
}

export interface OfficialSource {
  authorityName: string;
  portalUrl: string;
  linkLabel: string;
}

export interface ToolEditorialContent {
  requirementHeading: string;
  preparationTips: string[];
  rejectionReasons: string[];
  instructions: string[];
  mobileInstructions: string[];
  checklist: string[];
  faqs: { q: string; a: string }[];
}

export interface ToolSEO {
  title: string;
  description: string;
  h1: string;
  canonicalSlug: string;
}

export interface ToolConfig {
  id: string;
  slug: string; // Stored WITHOUT leading or trailing slashes
  category: 'photo' | 'signature' | 'pdf' | 'document' | 'general';
  toolType: ToolType;
  examId?: string;
  authorityId?: string;
  examName?: string;
  authorityName?: string;
  title: string;
  shortDescription: string;
  requirements: ToolRequirements;
  officialSource: OfficialSource;
  content: ToolEditorialContent;
  seo: ToolSEO;
  verificationStatus: VerificationStatus;
  lastVerified: string;
}

// Helper to calculate exact GCD aspect ratio
export function calculateAspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h) || 1;
  return `${w / d}:${h / d}`;
}

/**
 * MASTER TOOL REGISTRY
 * Explicit configuration for flagship exams and high-volume routes.
 */
export const MASTER_TOOL_REGISTRY: Record<string, ToolConfig> = {
  // 1. RBI Grade B - Photo
  'rbi-grade-b-officer-passport-size-photo-resizer': {
    id: 'rbi-grade-b-officer-passport-size-photo-resizer',
    slug: 'exam/rbi-grade-b-officer-passport-size-photo-resizer',
    category: 'photo',
    toolType: 'PHOTO_RESIZER',
    examId: 'rbi-grade-b',
    authorityId: 'rbi',
    examName: 'RBI Grade B Officer Recruitment',
    authorityName: 'Reserve Bank of India',
    title: 'RBI Grade B Passport Size Photo Resizer',
    shortDescription: 'Resize and compress candidate photograph strictly to official 200 × 230 px and 20–50 KB limits for Reserve Bank of India Officer portals.',
    requirements: {
      dimensions: '200 × 230 px',
      width: 200,
      height: 230,
      minKB: 20,
      targetKB: 50,
      maxKB: 50,
      format: 'JPG / JPEG',
      aspectRatio: calculateAspectRatio(200, 230),
      background: 'Light-coloured, preferably white',
      expressionOrInk: 'Neutral expression, full face visible looking into camera, no caps or dark glasses',
      dpi: 300,
    },
    officialSource: {
      authorityName: 'Reserve Bank of India',
      portalUrl: 'https://www.rbi.org.in',
      linkLabel: 'Official RBI Recruitment Source',
    },
    content: {
      requirementHeading: 'RBI Grade B Photo Requirements',
      preparationTips: [
        'Head centered and covering roughly 70% to 80% of the vertical frame.',
        'Even illumination with no reflections, red-eye, or shadow patches behind ears.',
        'Strictly light-coloured, clean white background.',
        'Prescription spectacles are acceptable only if eyes are visible without lens glare.',
      ],
      rejectionReasons: [
        'File size under 20 KB or exceeding 50 KB.',
        'Incorrect pixel dimensions causing horizontal facial stretching.',
        'Selfies or images taken from physical print photographs.',
        'Uploading non-JPG formats (PNG, WEBP, PDF).',
      ],
      instructions: [
        'Upload your photograph using Choose Image.',
        'Verify the locked 200 × 230 pixel ratio framing.',
        'The canvas processes the file in-browser to balance byte weight under 50 KB.',
        'Download the verified JPG file ready for the application portal.',
      ],
      mobileInstructions: [
        'Tap Choose Image to browse device gallery.',
        'Use the Zoom & Scale slider to center your face.',
        'Verify no white strips surround the edges before generating the file.',
        'Tap Download; the file saves directly to your device Downloads.',
      ],
      checklist: [
        'Dimensions: 200 × 230 pixels',
        'File size strictly between 20 KB and 50 KB',
        'File format: JPG / JPEG',
        'Clear white or light background',
        'No caps, hats, or tinted sunglasses',
        'Verified against latest official RBI notification',
      ],
      faqs: [
        {
          q: 'What is the required photo size for RBI Grade B recruitment?',
          a: 'The official guideline specifies dimensions of 200 × 230 pixels with file size strictly between 20 KB and 50 KB in JPG/JPEG format.',
        },
        {
          q: 'What is the maximum photo file size permitted on the RBI portal?',
          a: 'The photo file cannot exceed 50 KB and must not be smaller than 20 KB. Anything outside this range will be rejected.',
        },
        {
          q: 'Which image format is accepted for RBI Grade B application?',
          a: 'Only JPG or JPEG formats are supported by the application gateway.',
        },
        {
          q: 'Why can an RBI Grade B photo get rejected despite correct file size?',
          a: 'Common reasons include patterned backgrounds, harsh glare on glasses, cropped heads, or horizontal distortion caused by incorrect aspect ratios.',
        },
      ],
    },
    seo: {
      title: 'RBI Grade B Passport Size Photo Resizer – Size & KB | Formilo',
      description: 'Prepare your RBI Grade B application photo with the required dimensions, file size and format. Free browser-based photo resizer with no server upload.',
      h1: 'RBI Grade B Passport Size Photo Resizer',
      canonicalSlug: 'exam/rbi-grade-b-officer-passport-size-photo-resizer',
    },
    verificationStatus: 'verified',
    lastVerified: '2026-05',
  },

  // 2. RBI Grade B - Signature
  'rbi-grade-b-officer-signature-crop-compress': {
    id: 'rbi-grade-b-officer-signature-crop-compress',
    slug: 'exam/rbi-grade-b-officer-signature-crop-compress',
    category: 'signature',
    toolType: 'SIGNATURE_RESIZER',
    examId: 'rbi-grade-b',
    authorityId: 'rbi',
    examName: 'RBI Grade B Officer Recruitment',
    authorityName: 'Reserve Bank of India',
    title: 'RBI Grade B Signature Crop & Compress',
    shortDescription: 'Crop and compress candidate signature strictly to 140 × 60 px and 10–20 KB limits for RBI Grade B recruitment.',
    requirements: {
      dimensions: '140 × 60 px',
      width: 140,
      height: 60,
      minKB: 10,
      targetKB: 20,
      maxKB: 20,
      format: 'JPG / JPEG',
      aspectRatio: calculateAspectRatio(140, 60),
      background: 'Clean white paper background',
      expressionOrInk: 'Signed clearly with black ink pen; capital/block letter signatures are rejected',
      dpi: 200,
    },
    officialSource: {
      authorityName: 'Reserve Bank of India',
      portalUrl: 'https://www.rbi.org.in',
      linkLabel: 'Official RBI Recruitment Source',
    },
    content: {
      requirementHeading: 'RBI Grade B Signature Requirements',
      preparationTips: [
        'Sign on clean, unruled white paper using a black ink pen.',
        'Crop closely around the signature strokes, eliminating dark edges.',
        'Ensure the ink has high contrast against the paper.',
        'Sign in running handwriting; block capital signatures will be rejected.',
      ],
      rejectionReasons: [
        'File size under 10 KB or exceeding 20 KB.',
        'Signature written in capital letters.',
        'Signatures written with light pencil or faint ink.',
        'Dark paper shadows or camera flash artifacts.',
      ],
      instructions: [
        'Upload your scanned signature.',
        'Align the bounding box to keep the signature centered.',
        'Process locally to achieve a clean white background and strict 10–20 KB weight.',
        'Download the verified JPG signature.',
      ],
      mobileInstructions: [
        'Capture a photo of your signature in bright daylight.',
        'Upload and use framing boundaries to crop out tabletop edges.',
        'Download the compressed file directly to your smartphone.',
      ],
      checklist: [
        'Dimensions: 140 × 60 pixels',
        'File size: 10 KB – 20 KB',
        'Format: JPG / JPEG',
        'Black ink pen on white paper',
        'Running handwriting (no block capital letters)',
        'Latest RBI notification checked',
      ],
      faqs: [
        {
          q: 'What is the official signature size for RBI Grade B?',
          a: 'Dimensions must be 140 × 60 pixels with a file size strictly between 10 KB and 20 KB.',
        },
        {
          q: 'Can I sign in blue ink for RBI Grade B?',
          a: 'Official notifications mandate black ink pen on white paper for high scanner contrast.',
        },
        {
          q: 'Are capital letter signatures allowed for RBI Grade B?',
          a: 'No. Signatures written in all CAPITAL / BLOCK letters are explicitly disqualified.',
        },
      ],
    },
    seo: {
      title: 'RBI Grade B Signature Crop & Compress (10–20 KB) | Formilo',
      description: 'Crop and compress your RBI Grade B signature strictly to 140 × 60 px and 10–20 KB in black ink. Browser-based client-side processing.',
      h1: 'RBI Grade B Signature Crop & Compress',
      canonicalSlug: 'exam/rbi-grade-b-officer-signature-crop-compress',
    },
    verificationStatus: 'verified',
    lastVerified: '2026-05',
  },

  // 3. TS Police Constable - Photo (TSLPRB)
  'ts-police-constable-tslprb-passport-size-photo-resizer': {
    id: 'ts-police-constable-tslprb-passport-size-photo-resizer',
    slug: 'exam/ts-police-constable-tslprb-passport-size-photo-resizer',
    category: 'photo',
    toolType: 'PHOTO_RESIZER',
    examId: 'ts-police-constable-tslprb',
    authorityId: 'tslprb',
    examName: 'Telangana Police Constable Recruitment',
    authorityName: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    title: 'TS Police Constable TSLPRB Photo Resizer',
    shortDescription: 'Format and resize passport photos strictly for Telangana State Level Police Recruitment Board (TSLPRB) Constable portal submissions.',
    requirements: {
      dimensions: '350 × 450 px',
      width: 350,
      height: 450,
      minKB: 10,
      targetKB: 50,
      maxKB: 50,
      format: 'JPG / JPEG',
      aspectRatio: calculateAspectRatio(350, 450),
      background: 'Plain light or white background',
      expressionOrInk: 'Frontal face view, both ears visible, neutral expression, no hats/caps/dark glasses',
      dpi: 300,
    },
    officialSource: {
      authorityName: 'Telangana State Level Police Recruitment Board (TSLPRB)',
      portalUrl: 'https://www.tslprb.in',
      linkLabel: 'Official TSLPRB Recruitment Source',
    },
    content: {
      requirementHeading: 'TS Police Constable Photo Requirements',
      preparationTips: [
        'Maintain a frontal posture with both ears and shoulders visible.',
        'Clean, uniform light or white background without shadows or scenery.',
        'Keep facial features sharp and unblurred; do not upscale low-resolution photos.',
        'Ensure the photo was taken within the last three months.',
      ],
      rejectionReasons: [
        'Photo exceeding 50 KB or smaller than 10 KB.',
        'Wearing dark glasses, goggles, or caps.',
        'Blurred facial contours or poor smartphone lighting.',
        'Side profile or tilted face photos.',
      ],
      instructions: [
        'Select your passport photograph.',
        'Check that the TSLPRB portrait 350 × 450 aspect ratio encompasses your face.',
        'Allow the browser engine to compress bytes under the 50 KB ceiling.',
        'Download the verified JPG photo.',
      ],
      mobileInstructions: [
        'Upload your picture directly from your mobile camera gallery.',
        'Align your face within the guidelines using the Zoom tool.',
        'Tap Download; the file is saved locally to your device.',
      ],
      checklist: [
        'Dimensions: 350 × 450 pixels',
        'File size under 50 KB',
        'Format: JPG / JPEG',
        'Clean light/white background',
        'Ears and facial features clearly distinguishable',
        'Latest TSLPRB official notification verified',
      ],
      faqs: [
        {
          q: 'What is the required photo size for TS Police Constable recruitment?',
          a: 'TSLPRB guidelines mandate passport photos at 350 × 450 pixels with file size strictly under 50 KB in JPG/JPEG format.',
        },
        {
          q: 'What is the maximum file size accepted on the TSLPRB portal?',
          a: 'The photo file must be strictly under 50 KB (typically between 10 KB and 50 KB).',
        },
        {
          q: 'Are mobile selfies accepted for TS Police Constable?',
          a: 'No. Selfies, side angles, and casual crops are disqualified. A formal studio passport-style photo is required.',
        },
      ],
    },
    seo: {
      title: 'TS Police Constable TSLPRB Photo Resizer – Size & KB | Formilo',
      description: 'Prepare your TS Police Constable application photo with the required dimensions, file size and format. Free browser-based photo resizer with no server upload.',
      h1: 'TS Police Constable TSLPRB Passport Size Photo Resizer',
      canonicalSlug: 'exam/ts-police-constable-tslprb-passport-size-photo-resizer',
    },
    verificationStatus: 'verified',
    lastVerified: '2026-05',
  },

  // 4. TS Police Constable - Signature (TSLPRB)
  'ts-police-constable-tslprb-signature-crop-compress': {
    id: 'ts-police-constable-tslprb-signature-crop-compress',
    slug: 'exam/ts-police-constable-tslprb-signature-crop-compress',
    category: 'signature',
    toolType: 'SIGNATURE_RESIZER',
    examId: 'ts-police-constable-tslprb',
    authorityId: 'tslprb',
    examName: 'Telangana Police Constable Recruitment',
    authorityName: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    title: 'TS Police Constable Signature Crop & Compress',
    shortDescription: 'Crop and compress candidate signature strictly under 30 KB for TSLPRB Telangana Police Constable forms.',
    requirements: {
      dimensions: '280 × 120 px',
      width: 280,
      height: 120,
      minKB: 5,
      targetKB: 30,
      maxKB: 30,
      format: 'JPG / JPEG',
      aspectRatio: calculateAspectRatio(280, 120),
      background: 'Pure white unruled paper',
      expressionOrInk: 'Clear blue or black ink signature in candidate running handwriting',
      dpi: 200,
    },
    officialSource: {
      authorityName: 'Telangana State Level Police Recruitment Board (TSLPRB)',
      portalUrl: 'https://www.tslprb.in',
      linkLabel: 'Official TSLPRB Recruitment Source',
    },
    content: {
      requirementHeading: 'TS Police Constable Signature Requirements',
      preparationTips: [
        'Sign on plain white paper without horizontal lines.',
        'Use black or dark blue ink pen with uniform thickness.',
        'Ensure the signature is in running cursive, not capital block letters.',
        'Crop tightly around the signature to remove background margins.',
      ],
      rejectionReasons: [
        'File size exceeding 30 KB.',
        'Signatures written on ruled or patterned paper.',
        'Signatures in capital letters.',
        'Blurry or smudged scans.',
      ],
      instructions: [
        'Upload your signature image.',
        'Frame the boundary box closely around your signature strokes.',
        'The tool enforces the TSLPRB aspect ratio and compresses under 30 KB.',
        'Download the verified signature JPG.',
      ],
      mobileInstructions: [
        'Photograph your signature under good lighting without casting hand shadows.',
        'Upload and position the crop box.',
        'Download the optimized file directly.',
      ],
      checklist: [
        'Dimensions: 280 × 120 pixels',
        'File size under 30 KB',
        'Format: JPG / JPEG',
        'Dark ink on pure white paper',
        'No block letters',
        'Latest TSLPRB guidelines verified',
      ],
      faqs: [
        {
          q: 'What is the signature file limit for TS Police Constable recruitment?',
          a: 'TSLPRB requires candidate signatures to be formatted under 30 KB in JPG format.',
        },
        {
          q: 'Can I use capital letters for my TS Police signature?',
          a: 'No. Signatures in full capital letters are disqualified by recruitment guidelines.',
        },
      ],
    },
    seo: {
      title: 'TS Police Constable Signature Crop & Compress (< 30 KB) | Formilo',
      description: 'Crop and compress your TS Police Constable signature strictly under 30 KB with clear white background. Private client-side tool.',
      h1: 'TS Police Constable Signature Crop & Compress',
      canonicalSlug: 'exam/ts-police-constable-tslprb-signature-crop-compress',
    },
    verificationStatus: 'verified',
    lastVerified: '2026-05',
  },
};
