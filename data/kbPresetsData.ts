// data/kbPresetsData.ts

export interface KbPresetInfo {
  slug: string;
  targetKB: number;
  h1: string;
  seoTitle: string;
  metaDescription: string;
  badge: string;
  intro: string;
  bestFor: string[];
  maxRecommendedDim: string;
  faqs: { q: string; a: string }[];
}

export const KB_PRESETS_DATA: Record<number, KbPresetInfo> = {
  20: {
    slug: 'photo-resizer-20kb',
    targetKB: 20,
    h1: 'Photo Resizer Under 20 KB Online',
    seoTitle: 'Photo Resizer to 20 KB (Under 20 KB Without Blur) - Formilo',
    metaDescription: 'Compress and resize passport photos strictly under 20 KB for online application forms. 100% private in-browser tool with zero blur.',
    badge: 'STRICT < 20 KB',
    intro: 'Compress passport size photos and identity images strictly under 20 KB while retaining clear facial contours and high contrast for strict recruitment portals.',
    bestFor: [
      'SSC GD Constable / MTS Photo Upload',
      'UP Police & State Police Application Forms',
      'State PSC Scanned Identity Photos',
      'Scholarship & Admission Portal Images'
    ],
    maxRecommendedDim: '350 × 450 px',
    faqs: [
      {
        q: 'How does Formilo resize photos under 20 KB without making them blurry?',
        a: 'Formilo downsamples high-resolution smartphone photos using bi-cubic interpolation and executes an 8-step precision JPEG binary search to lock the file size between 17 KB and 19.8 KB without destroying facial features.'
      },
      {
        q: 'Will portals reject photos resized to 20 KB?',
        a: 'No. The output strictly complies with standard government portal constraints (file size <= 20 KB in JPG format).'
      }
    ]
  },
  30: {
    slug: 'photo-resizer-30kb',
    targetKB: 30,
    h1: 'Photo Resizer Under 30 KB Online',
    seoTitle: 'Photo Resizer to 30 KB (Exact File Size Lock) - Formilo',
    metaDescription: 'Resize photos and document images strictly under 30 KB online. Fast, free, and 100% private in-browser compression engine.',
    badge: 'TARGET < 30 KB',
    intro: 'Resize photos, official certificate crops, and identity photos to fit portals with a strict 30 KB upper limit.',
    bestFor: [
      'Banking IBPS & SBI Document Attachments',
      'PAN Card Online Portal Verification',
      'State Entrance & University Portals',
      'Railway RRB Form Documents'
    ],
    maxRecommendedDim: '400 × 500 px',
    faqs: [
      {
        q: 'Why choose 30 KB instead of 20 KB?',
        a: 'Several banking and state government portals require file sizes between 10 KB and 30 KB. This tool locks the maximum quality allowed within 30 KB.'
      }
    ]
  },
  50: {
    slug: 'photo-resizer-50kb',
    targetKB: 50,
    h1: 'Photo Resizer Under 50 KB Online',
    seoTitle: 'Photo Resizer to 50 KB (Crisp Passport Size Photo) - Formilo',
    metaDescription: 'Compress photos under 50 KB for SSC CGL, CHSL, RRB NTPC, and UPSC forms without losing sharpness or clarity.',
    badge: 'MOST POPULAR < 50 KB',
    intro: 'The universal standard for competitive exams. Resize smartphone pictures into crisp passport photos under 50 KB in seconds.',
    bestFor: [
      'SSC CGL, CHSL, CPO & Selection Posts',
      'UPSC Civil Services & CDS Applications',
      'Railway RRB NTPC & Group D Forms',
      'State Police Sub-Inspector & Constable Forms'
    ],
    maxRecommendedDim: '450 × 600 px',
    faqs: [
      {
        q: 'How to resize a photo under 50 KB on mobile?',
        a: 'Select your photo using the gallery or camera button, adjust the zoom to center your face, and click Download. Formilo automatically delivers a 45–49 KB verified JPEG file.'
      },
      {
        q: 'Is this 50 KB tool free?',
        a: 'Yes, 100% free with unlimited usage and zero server uploads.'
      }
    ]
  },
  100: {
    slug: 'photo-resizer-100kb',
    targetKB: 100,
    h1: 'Photo Resizer Under 100 KB Online',
    seoTitle: 'Photo & Document Resizer to 100 KB - Formilo',
    metaDescription: 'Resize photos, marksheets, and certificate images strictly under 100 KB with high resolution and legible text.',
    badge: 'DOCUMENTS < 100 KB',
    intro: 'Ideal for ID cards, handwritten declarations, marksheet crops, and recruitment photo uploads requiring high fidelity up to 100 KB.',
    bestFor: [
      'IBPS Handwritten Declaration Upload',
      'Marksheet & Degree Certificate Crops',
      'Caste & Domicile Certificate Scans',
      'High-Resolution ID Card Photos'
    ],
    maxRecommendedDim: '800 × 1000 px',
    faqs: [
      {
        q: 'Can I compress scanned documents under 100 KB?',
        a: 'Yes. Formilo preserves text sharpness and dark ink contrast so scanned certificates remain readable when compressed under 100 KB.'
      }
    ]
  },
  150: {
    slug: 'photo-resizer-150kb',
    targetKB: 150,
    h1: 'Photo Resizer Under 150 KB Online',
    seoTitle: 'Photo Resizer to 150 KB (High Quality Image) - Formilo',
    metaDescription: 'Resize photos and digital forms strictly under 150 KB without blur. Instant client-side compression.',
    badge: 'ENTRANCE < 150 KB',
    intro: 'Tailored for national entrance examinations and high-detail photo uploads that allow up to 150 KB file sizes.',
    bestFor: [
      'NTA JEE Main & NEET Application Forms',
      'CUET UG / PG Candidate Photographs',
      'GATE & JAM Online Application Portals',
      'Passport & Visa Online Submission Portals'
    ],
    maxRecommendedDim: '1000 × 1200 px',
    faqs: [
      {
        q: 'What formats are supported for 150 KB resize?',
        a: 'You can upload JPG, JPEG, PNG, or WebP. The tool exports a standardized JPEG file under 150 KB.'
      }
    ]
  },
  200: {
    slug: 'photo-resizer-200kb',
    targetKB: 200,
    h1: 'Photo Resizer Under 200 KB Online',
    seoTitle: 'Photo Resizer to 200 KB (Postcard 4x6 & Full Docs) - Formilo',
    metaDescription: 'Compress postcard size photos (4x6 inch) and documents under 200 KB without quality degradation.',
    badge: 'POSTCARD < 200 KB',
    intro: 'Format large 4x6 inch postcard photos, full document pages, and high-resolution certificates strictly under 200 KB.',
    bestFor: [
      'NTA NEET Postcard Size Photo (4 × 6 Inch)',
      'State Police Postcard Size Photographs',
      'Full Page Certificate Attachments',
      'Official Portal Document Attachments'
    ],
    maxRecommendedDim: '1200 × 1600 px',
    faqs: [
      {
        q: 'Is 200 KB suitable for NEET 4x6 postcard photos?',
        a: 'Yes. NEET requires postcard photos between 50 KB and 200 KB. This tool ensures crisp white background and clear candidate details.'
      }
    ]
  }
};
