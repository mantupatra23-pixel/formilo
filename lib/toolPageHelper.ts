import { getAllTools, ToolItem } from '@/lib/toolsData';

export const TELEGRAM_CHANNEL_URL = 'https://t.me/formilo_alerts_hub';

export type ToolType = 
  | 'photo-resizer'
  | 'signature-tool'
  | 'pdf-converter'
  | 'pdf-compressor'
  | 'pdf-tool'
  | 'calculator'
  | 'converter'
  | 'generator'
  | 'exam-preset'
  | 'general';

export interface ToolPageData {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  toolType: ToolType;
  description: string;
  badge?: string;
  targetKB?: number;
  minKB?: number;
  dimensions?: string;
  aspectRatioText?: string;
  format?: string;
  examName?: string;
  boardName?: string;
  formula?: {
    expression: string;
    variables: { symbol: string; label: string }[];
  };
  howToSteps: string[];
  bestFor: string[];
  methodology: {
    heading: string;
    description: string;
    details?: string[];
  };
  importantNotes: string[];
  privacyMessage: string;
  faqs: { q: string; a: string }[];
  relatedTools: ToolItem[];
  categoryTools: ToolItem[];
}

// Slug se clean readable title generate karne ka fallback
function formatSlugToTitle(slug: string): string {
  const base = slug
    .replace(/^\/+/, '')
    .replace(/^(exam|tools)\//, '')
    .replace(/-/g, ' ');
  return base
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function detectToolType(slug: string, category: string, title: string): ToolType {
  const s = slug.toLowerCase();
  const t = title.toLowerCase();

  if (s.includes('calculator') || t.includes('calculator') || s.includes('emi') || s.includes('sip') || s.includes('gst')) {
    return 'calculator';
  }
  if (s.includes('converter') && (s.includes('unit') || s.includes('age') || s.includes('currency') || s.includes('cm-to-inch'))) {
    return 'converter';
  }
  if (s.includes('pdf-compress') || s.includes('compress-pdf') || s.includes('pdf-size-reducer')) {
    return 'pdf-compressor';
  }
  if (s.includes('jpg-to-pdf') || s.includes('pdf-to-jpg') || s.includes('image-to-pdf')) {
    return 'pdf-converter';
  }
  if (category === 'pdf' || s.includes('pdf')) {
    return 'pdf-tool';
  }
  if (category === 'signature' || s.includes('sign') || s.includes('thumb')) {
    return 'signature-tool';
  }
  if (s.startsWith('exam/') || s.includes('-passport-size-photo-resizer') || s.includes('pan-card')) {
    return 'exam-preset';
  }
  if (category === 'photo' || s.includes('photo') || s.includes('resizer') || s.includes('postcard')) {
    return 'photo-resizer';
  }
  return 'general';
}

export function resolveToolPageData(rawSlug: string, customConfig?: Partial<ToolPageData>): ToolPageData {
  const allTools = getAllTools();
  
  // Normalize input slug: remove leading/trailing slashes
  const cleanSlug = (rawSlug || '').replace(/^\/+|\/+$/g, '').trim();
  const slugBase = cleanSlug.replace(/^(exam|tools)\//, '');

  // 1. Specific High-Priority Presets (RBI Grade B Officer Official Specs)
  if (cleanSlug.includes('rbi-grade-b')) {
    customConfig = {
      title: 'RBI Grade B Passport Size Photo Resizer',
      examName: 'RBI Grade B Officer Recruitment',
      boardName: 'Reserve Bank of India (RBI)',
      dimensions: '200 × 230 px',
      targetKB: 50,
      minKB: 20,
      format: 'JPG / JPEG',
      description: 'Prepare, crop, and compress your photograph strictly to official 200 × 230 px and 20–50 KB limits for RBI Grade B Officer application portals.',
      bestFor: [
        'RBI Grade B Officers (DR - General / DEPR / DSIM) registration',
        'Official IBPS candidate photo gateway compliance',
        'Pre-submission photograph dimension & byte verification',
      ],
      faqs: [
        {
          q: 'What is the required photo size for RBI Grade B Officer recruitment?',
          a: 'The official guideline specifies dimensions of 200 × 230 pixels (width × height) with a required file size strictly between 20 KB and 50 KB in JPG/JPEG format.',
        },
        {
          q: 'What is the maximum and minimum photo file size permitted?',
          a: 'The photo file must be a minimum of 20 KB and cannot exceed 50 KB. Files larger than 50 KB are automatically rejected by the RBI/IBPS application portal.',
        },
        {
          q: 'Which image format is accepted on the RBI portal?',
          a: 'Only JPG or JPEG image formats are accepted. Files in PNG, WEBP, or PDF will fail during upload in the photograph field.',
        },
        {
          q: 'Does Formilo upload my photo to any server?',
          a: 'No. All image resizing, cropping, and compression run 100% locally within your device RAM using client-side HTML5 Canvas APIs.',
        },
      ],
      ...customConfig,
    };
  }

  // 2. Resilient multi-tier slug matching against static & auto-generated data
  const matchedTool = allTools.find((t: any) => {
    const s = (t.slug || '').replace(/^\/+|\/+$/g, '').trim();
    const sBase = s.replace(/^(exam|tools)\//, '');
    const id = (t.id || '').replace(/^\/+|\/+$/g, '').trim();
    const idBase = id.replace(/^(exam|tools)\//, '');

    return (
      s === cleanSlug ||
      s === slugBase ||
      sBase === cleanSlug ||
      sBase === slugBase ||
      id === cleanSlug ||
      id === slugBase ||
      idBase === slugBase
    );
  }) as any;

  // Title fallback hierarchy: customConfig -> matchedTool.title -> matchedTool.name -> dynamic generated title
  const title =
    customConfig?.title ||
    matchedTool?.title ||
    matchedTool?.name ||
    formatSlugToTitle(cleanSlug) ||
    'Online Document Tool';

  const category = matchedTool?.category || customConfig?.category || 'photo';
  const toolType = customConfig?.toolType || detectToolType(cleanSlug, category, title);

  // Target KB auto-resolution (Data property -> Slug extraction -> Default 50 KB)
  let resolvedTargetKB =
    customConfig?.targetKB ||
    matchedTool?.targetKB ||
    matchedTool?.photoKb ||
    matchedTool?.signKb ||
    matchedTool?.maxKb;

  if (!resolvedTargetKB) {
    const kbMatch = cleanSlug.match(/(\d+)\s*kb/i);
    if (kbMatch) {
      resolvedTargetKB = parseInt(kbMatch[1], 10);
    }
  }
  const targetKB = resolvedTargetKB || 50;

  const minKB =
    customConfig?.minKB ||
    matchedTool?.minKB ||
    matchedTool?.minKb ||
    (targetKB ? Math.max(5, Math.round(targetKB * 0.2)) : undefined);

  // Dimensions auto-resolution
  let dimensions = customConfig?.dimensions;
  if (!dimensions) {
    if (matchedTool?.width && matchedTool?.height) {
      dimensions = `${matchedTool.width} × ${matchedTool.height} px`;
    } else if (matchedTool?.dimensionText) {
      dimensions = matchedTool.dimensionText;
    } else if (cleanSlug.includes('signature') || category === 'signature') {
      dimensions = '280 × 120 px';
    } else if (cleanSlug.includes('postcard') || cleanSlug.includes('4x6')) {
      dimensions = '400 × 720 px (4 × 6 Inch)';
    } else if (cleanSlug.includes('pan-card')) {
      dimensions = '213 × 213 px (300 DPI)';
    } else {
      dimensions = '350 × 450 px';
    }
  }

  const examName =
    customConfig?.examName ||
    matchedTool?.exam ||
    matchedTool?.examName ||
    matchedTool?.board;

  const categoryMap: Record<string, string> = {
    photo: 'Photo Resizers',
    signature: 'Signature Tools',
    pdf: 'PDF Tools',
    presets: 'Exam Presets',
    converters: 'Converters',
  };
  const categoryName = categoryMap[category] || 'Document Tools';

  // 3. Dynamic How-To Steps
  let howToSteps: string[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    howToSteps = [
      'Select or upload your photo using the Choose Photo button.',
      `Set or verify your required target file size (${targetKB ? `< ${targetKB} KB` : 'preset dimensions'}).`,
      'Adjust framing or alignment controls to center your subject.',
      'Click "Resize & Download" to process your image locally in browser memory.',
      'Preview the verified file size and download your compliant document.',
    ];
  } else if (toolType === 'signature-tool') {
    howToSteps = [
      'Upload your scanned signature or left thumb impression image.',
      `Select your target size limit (${targetKB ? `< ${targetKB} KB` : 'standard limit'}) and framing options.`,
      'Clean background shadows or adjust contrast if needed.',
      'Process the signature locally inside device memory.',
      'Download your final compliant signature file.',
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor' || toolType === 'pdf-tool') {
    howToSteps = [
      'Select single or multiple JPG, PNG, or PDF files from your device.',
      'Choose standard A4 page fitting, margin, or target KB size limit.',
      'Reorder pages in sequential order if required.',
      'Start client-side document rasterization and PDF generation.',
      'Download your merged or compressed PDF document ready for upload.',
    ];
  } else if (toolType === 'calculator') {
    howToSteps = [
      'Enter the required initial values into the input fields.',
      'Review the calculated results and breakdown figures.',
      'Adjust inputs to compare different financial or numerical scenarios.',
      'Use the final verified estimates for your planning.',
    ];
  } else if (toolType === 'converter') {
    howToSteps = [
      'Enter the source magnitude or numerical value.',
      'Select your source unit and destination target unit.',
      'View instant high-precision conversion results.',
      'Copy the converted metric for your application or form.',
    ];
  } else {
    howToSteps = [
      'Upload your file or select the required settings.',
      'Verify target specifications and document parameters.',
      'Process the file directly within your web browser.',
      'Download the final verified result.',
    ];
  }

  // 4. Best For / Use Cases
  let bestFor: string[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    bestFor = [
      'Central & State Government recruitment applications (SSC, UPSC, Railway, Police)',
      'Banking & Insurance recruitment portals (IBPS, SBI, RBI, LIC)',
      'National entrance examination registrations (NTA NEET UG, JEE Main, CUET)',
      'Passport size photo formatting for state scholarship and admission forms',
    ];
  } else if (toolType === 'signature-tool') {
    bestFor = [
      'Recruitment portal signature uploads requiring strict 10 KB – 20 KB limit',
      'Left thumb impression formatting for technical & defence examinations',
      'PAN Card application & correction forms (400 × 200 px at 300 DPI)',
      'Digital application forms and handwritten declarations',
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor' || toolType === 'pdf-tool') {
    bestFor = [
      'Marksheet and degree certificate attachment under 100 KB / 200 KB',
      'Caste, income, and domicile certificate uploads',
      'Multi-image document stitching into standardized A4 PDF files',
      'Cyber Cafe & CSC center high-speed customer document formatting',
    ];
  } else if (toolType === 'calculator') {
    bestFor = [
      'Personal finance planning and loan repayment estimation',
      'Quick numerical projections and scenario comparisons',
      'Educational and everyday business calculations',
    ];
  } else {
    bestFor = [
      'Online application form document preparation',
      'Educational and institutional uploads',
      'High-speed digital service center workflows',
    ];
  }

  // 5. Methodology / Processing Details
  let methodology = {
    heading: 'In-Browser Image Processing Method',
    description: 'This tool uses client-side HTML5 Canvas and bi-cubic downscaling interpolation within your browser RAM. It iteratively optimizes compression quality and dimensions to hit exact byte restrictions without sending uncompressed binaries across the network.',
  };
  if (toolType === 'calculator') {
    methodology = {
      heading: 'Standard Calculation Methodology',
      description: 'Calculations follow established mathematical and financial amortization algorithms with precision floating-point evaluation to provide reliable estimates.',
    };
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor') {
    methodology = {
      heading: 'Client-Side PDF Rasterization & Assembly',
      description: 'PDF structures are rendered and compiled in-memory using client-side JavaScript streams. Pages are fitted to standard international A4 dimensions with optimized JPEG compression.',
    };
  }

  // 6. Important Notes / Assumptions
  let importantNotes: string[] = [];
  if (toolType === 'calculator') {
    importantNotes = [
      'Results are analytical estimates based on entered parameters.',
      'Actual bank interest rates, taxes, or charges may vary based on institutional terms.',
      'Verify important financial decisions with official institution schedules.',
    ];
  } else {
    importantNotes = [
      'Output file size can slightly vary depending on original image detail, contrast, and color distribution.',
      'Compression balances file weight and clarity; verify candidate facial features, name strips, and signatures before submission.',
      'Always verify latest document instructions on the official notification of the respective examination authority.',
    ];
  }

  // 7. Truthful Privacy Statement
  const privacyMessage = 'Your image is processed locally inside your web browser memory (RAM) using client-side HTML5 Canvas APIs. Formilo does not upload, save, or index files on remote servers.';

  // 8. Tool-Type Adaptive FAQs
  let faqs: { q: string; a: string }[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    faqs = [
      {
        q: `How do I resize my photo to strictly under ${targetKB} KB?`,
        a: `Upload your photo, select the < ${targetKB} KB limit, and the canvas engine will automatically downscale and compress the image to fit strictly within the required byte limit while preserving aspect ratio.`,
      },
      {
        q: 'Will reducing file size make facial features blurry or cause form rejection?',
        a: 'No. Formilo uses step-down bi-cubic downscaling that preserves sharp facial boundaries, contrast, and candidate name/date strips.',
      },
      {
        q: 'Can I use this tool on Android and iPhone mobile browsers?',
        a: 'Yes. Formilo is fully mobile-optimized and allows you to select photos directly from your camera gallery or file manager.',
      },
      {
        q: 'Are my confidential photographs uploaded to a server?',
        a: 'No. All image cropping and compression operations run 100% locally inside your device RAM.',
      },
    ];
  } else if (toolType === 'signature-tool') {
    faqs = [
      {
        q: 'What is the official size limit for signature uploads in online forms?',
        a: 'Most government examination portals (SSC, UPSC, Railway, State Police) mandate candidate signatures to be strictly between 10 KB and 20 KB on a clear white background.',
      },
      {
        q: 'How can I clean grey paper shadows from my signature photo?',
        a: 'Use the Signature Background Whitener tool to remove scanner shadows and convert grey paper scans to high-contrast black ink on pure white paper.',
      },
      {
        q: 'Is my signature stored in any external database?',
        a: 'No. All signature crops and brightness adjustments execute strictly within your local browser memory.',
      },
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor') {
    faqs = [
      {
        q: 'How many images can I combine into a single PDF document?',
        a: 'You can combine multiple pages in a single conversion session. Pages are automatically formatted into standardized A4 sheets.',
      },
      {
        q: 'Will marksheet text and roll numbers remain readable after compression?',
        a: 'Yes. The engine balances canvas DPI and JPEG quality to ensure certificate marks, roll numbers, and authority stamps remain sharp.',
      },
      {
        q: 'Is it safe to convert confidential marksheet and caste certificates?',
        a: 'Yes. All PDF generation and compression takes place client-side. No document files leave your device.',
      },
    ];
  } else if (toolType === 'calculator') {
    faqs = [
      {
        q: 'How is the result calculated?',
        a: 'Calculations utilize standard financial and mathematical formula models based on periodic compounding and amortization.',
      },
      {
        q: 'Can I test multiple scenarios by adjusting inputs?',
        a: 'Yes. The calculation engine updates instantly in real time whenever you change input parameters.',
      },
    ];
  } else {
    faqs = [
      {
        q: 'How does this tool process files?',
        a: 'The tool uses browser-native APIs to format and process your inputs locally.',
      },
      {
        q: 'Is there any daily limit on using this tool?',
        a: 'No. Formilo tools are completely free to use without queues or daily limits.',
      },
    ];
  }

  // 9. Dynamic Related Tools
  const relatedTools = allTools
    .filter((t: any) => {
      const s = (t.slug || '').replace(/^\/+|\/+$/g, '');
      return s !== cleanSlug && s !== slugBase && (t.category === category || t.popular);
    })
    .slice(0, 4);

  // 10. Category Discovery Tools
  const categoryTools = allTools
    .filter((t: any) => {
      const s = (t.slug || '').replace(/^\/+|\/+$/g, '');
      return s !== cleanSlug && s !== slugBase && t.category === category;
    })
    .slice(0, 6);

  return {
    id: matchedTool?.id || cleanSlug,
    slug: cleanSlug,
    title,
    category,
    categoryName,
    toolType,
    description:
      customConfig?.description ||
      matchedTool?.description ||
      `Format and prepare compliant documents for ${title} strictly for official portal submission.`,
    badge: matchedTool?.badge || customConfig?.badge,
    targetKB,
    minKB,
    dimensions,
    aspectRatioText: customConfig?.aspectRatioText,
    format: customConfig?.format || 'JPG / JPEG',
    examName,
    boardName: customConfig?.boardName || matchedTool?.board,
    formula: customConfig?.formula,
    howToSteps: customConfig?.howToSteps || howToSteps,
    bestFor: customConfig?.bestFor || bestFor,
    methodology: customConfig?.methodology || methodology,
    importantNotes: customConfig?.importantNotes || importantNotes,
    privacyMessage: customConfig?.privacyMessage || privacyMessage,
    faqs: customConfig?.faqs || faqs,
    relatedTools,
    categoryTools,
  };
}
