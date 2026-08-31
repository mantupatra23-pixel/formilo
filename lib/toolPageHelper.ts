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
  const cleanSlug = rawSlug.replace(/^\//, '').trim();
  const matchedTool = allTools.find((t) => t.slug === cleanSlug || t.slug.endsWith(cleanSlug) || t.id === cleanSlug);

  const title = customConfig?.title || matchedTool?.title || 'Online Document Tool';
  const category = matchedTool?.category || customConfig?.category || 'photo';
  const toolType = customConfig?.toolType || detectToolType(cleanSlug, category, title);
  const targetKB = customConfig?.targetKB || matchedTool?.targetKB || 50;
  const minKB = customConfig?.minKB || matchedTool?.minKB || (targetKB ? Math.max(5, Math.round(targetKB * 0.2)) : undefined);
  const dimensions = customConfig?.dimensions || (matchedTool?.width && matchedTool?.height ? `${matchedTool.width} × ${matchedTool.height} px` : undefined);
  const examName = customConfig?.examName || matchedTool?.exam;

  // Category Friendly Name
  const categoryMap: Record<string, string> = {
    photo: 'Photo Resizers',
    signature: 'Signature Tools',
    pdf: 'PDF Tools',
    presets: 'Exam Presets',
    converters: 'Converters',
  };
  const categoryName = categoryMap[category] || 'Document Tools';

  // 1. Dynamic How-To Steps
  let howToSteps: string[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    howToSteps = [
      `Tap "Choose Photo" to upload your candidate image from your device.`,
      `Verify the target limit (${targetKB ? `< ${targetKB} KB` : 'preset dimensions'}).`,
      `Allow the browser canvas engine to crop and downscale to standard dimensions.`,
      `Preview the output size and click "Download Ready Document".`,
    ];
  } else if (toolType === 'signature-tool') {
    howToSteps = [
      `Select your scanned signature or thumb impression image.`,
      `Adjust framing, background contrast, or size limit (< ${targetKB} KB).`,
      `Process the signature locally inside your browser memory.`,
      `Download the clean file ready for recruitment form upload.`,
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor' || toolType === 'pdf-tool') {
    howToSteps = [
      `Select single or multiple document pages from your device.`,
      `Choose target PDF page layout (Standard A4) or target KB reduction limit.`,
      `Start the client-side compilation and page rasterization.`,
      `Download the generated multi-page or compressed PDF instantly.`,
    ];
  } else if (toolType === 'calculator') {
    howToSteps = [
      `Enter your base numerical inputs into the respective input fields.`,
      `Review real-time computed outputs and breakdown metrics.`,
      `Adjust parameters to compare alternative financial or mathematical scenarios.`,
      `Save or copy the final calculated figures for your reference.`,
    ];
  } else if (toolType === 'converter') {
    howToSteps = [
      `Input the source magnitude or numerical value.`,
      `Choose the source unit and destination target unit.`,
      `View instant high-precision conversion results.`,
      `Copy the converted metric directly to your clipboard.`,
    ];
  } else {
    howToSteps = [
      `Upload your file or enter the required parameters.`,
      `Review output specifications and formatting options.`,
      `Execute processing directly within your browser.`,
      `Download or save your verified result.`,
    ];
  }

  // 2. Best For / Use Cases
  let bestFor: string[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    bestFor = [
      'Central & State Government recruitment application portals',
      'Banking & Insurance recruitment uploads (IBPS, SBI, RBI)',
      'National entrance examination registrations (NTA NEET, JEE Main, CUET)',
      'State Police, Defence & Public Service Commission portals',
    ];
  } else if (toolType === 'signature-tool') {
    bestFor = [
      'Official examination signature submission (< 20 KB limit)',
      'Left thumb impression uploads for technical & police tests',
      'PAN Card application & correction forms (400 × 200 px, 300 DPI)',
      'Digital document signing and declaration forms',
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor' || toolType === 'pdf-tool') {
    bestFor = [
      'Marksheet and degree certificate attachment under 200 KB',
      'Caste, domicile, and income certificate submissions',
      'Multi-image document stitching into single A4 PDF files',
      'Cyber Cafe & CSC operator high-speed customer document handling',
    ];
  } else if (toolType === 'calculator') {
    bestFor = [
      'Personal financial planning and loan repayment estimation',
      'Accurate tax, interest, and investment return projections',
      'Everyday business, commercial, and mathematical evaluations',
    ];
  } else {
    bestFor = [
      'Official form application formatting and verification',
      'Educational and institutional document submissions',
      'Digital service center quick workflows',
    ];
  }

  // 3. Methodology / Formula / Processing
  let methodology = {
    heading: 'Browser-Native Processing Method',
    description: 'This tool uses client-side HTML5 Canvas and memory rasterization to downscale images with bi-cubic interpolation, ensuring facial features and ink strokes remain sharp while strictly respecting target file byte limits.',
  };
  if (toolType === 'calculator') {
    methodology = {
      heading: 'Standard Calculation Methodology',
      description: 'Calculations utilize standard financial and mathematical formula models based on compound interest, periodic amortization, or linear percentage multipliers without approximations.',
    };
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor') {
    methodology = {
      heading: 'In-Memory PDF Vector & Raster Assembly',
      description: 'PDF structures are rendered and assembled entirely within browser RAM using client-side WebAssembly and jsPDF streams, maintaining uniform A4 margins without sending uncompressed binaries across the network.',
    };
  }

  // 4. Important Notes / Assumptions
  let importantNotes: string[] = [];
  if (toolType === 'calculator') {
    importantNotes = [
      'Calculations provide analytical estimates based on user-supplied parameters.',
      'Actual bank or tax rates may vary depending on policy changes and institution-specific fees.',
      'Verify important financial decisions with verified official institution schedules.',
    ];
  } else {
    importantNotes = [
      'Output byte weight can slightly vary depending on image complexity and contrast.',
      'Always inspect the downloaded file to verify that candidate details, dates, or signatures are clearly legible.',
      'Final submission acceptance depends on the rules published in the active notification of the respective recruitment board.',
    ];
  }

  // 5. Privacy Message
  const privacyMessage = 'Files are processed locally in your browser memory (RAM) when supported. Files are not uploaded, indexed, or stored on remote Formilo servers.';

  // 6. FAQs (Tool-Type Adaptive)
  let faqs: { q: string; a: string }[] = [];
  if (toolType === 'photo-resizer' || toolType === 'exam-preset') {
    faqs = [
      {
        q: `How do I compress my photo strictly under ${targetKB} KB?`,
        a: `Upload your photo, select the < ${targetKB} KB option, and the engine will downscale the file using bi-cubic interpolation to fit the required file size while retaining aspect ratio.`,
      },
      {
        q: 'Will reducing the file size make facial features blurry?',
        a: 'No. Formilo applies multi-step canvas downscaling that preserves sharp facial boundaries, contrast, and candidate name/date strips.',
      },
      {
        q: 'Are candidate photos uploaded to any external server?',
        a: 'No. All image operations execute 100% inside your browser memory (RAM). Zero files are transmitted over the internet.',
      },
      {
        q: 'Can I use this tool on Android or iPhone mobile devices?',
        a: 'Yes. Formilo is fully responsive and supports direct photo uploads and downloads on all modern mobile web browsers.',
      },
    ];
  } else if (toolType === 'signature-tool') {
    faqs = [
      {
        q: `What is the standard size limit for recruitment signatures?`,
        a: `Most government examination portals (SSC, UPSC, Railway, State Police) require candidate signatures to be between 10 KB and 20 KB on a clear white background.`,
      },
      {
        q: 'How can I whiten a grey paper background on my signature photo?',
        a: 'You can use the Signature Background Whitener tool to remove background shadows and convert paper scans to crisp black ink on pure white paper.',
      },
      {
        q: 'Is my scanned signature saved on any database?',
        a: 'No. All cropping and contrast adjustments happen locally on your device. Your signatures are never stored.',
      },
    ];
  } else if (toolType === 'pdf-converter' || toolType === 'pdf-compressor') {
    faqs = [
      {
        q: 'How many pages can I stitch into a single PDF?',
        a: 'You can combine unlimited pages in your session. All pages are formatted into standardized A4 portrait or landscape sheets.',
      },
      {
        q: 'Will marksheet text and official stamps remain readable after compression?',
        a: 'Yes. The compression engine balances canvas DPI and JPEG quality to keep roll numbers, grades, and official signatures legible.',
      },
      {
        q: 'Are confidential government marksheets safe to process?',
        a: 'Yes. Processing runs client-side using JavaScript libraries. No document data leaves your device.',
      },
    ];
  } else if (toolType === 'calculator') {
    faqs = [
      {
        q: 'How accurate are the calculated figures?',
        a: 'Calculations follow verified mathematical and financial amortization algorithms with full decimal precision.',
      },
      {
        q: 'Can I test multiple scenarios by changing input values?',
        a: 'Yes. Results update instantly as you adjust numbers, tenure, or interest rates.',
      },
      {
        q: 'Can I use this calculator offline?',
        a: 'Yes. Once loaded in your browser, all calculation logic operates locally without needing constant internet connectivity.',
      },
    ];
  } else {
    faqs = [
      {
        q: 'How does this tool format files?',
        a: 'The tool reads your input parameters and processes the data locally using browser-native APIs.',
      },
      {
        q: 'Is there any daily limit on tool usage?',
        a: 'No. Formilo tools are completely free to use without queue limits or daily quotas.',
      },
    ];
  }

  // 7. Dynamic Related Tools (3–6 Tools)
  const relatedTools = allTools
    .filter((t) => t.slug !== cleanSlug && (t.category === category || t.popular))
    .slice(0, 4);

  // 8. Category Discovery (4–8 Tools)
  const categoryTools = allTools
    .filter((t) => t.slug !== cleanSlug && t.category === category)
    .slice(0, 6);

  return {
    id: matchedTool?.id || cleanSlug,
    slug: cleanSlug,
    title,
    category,
    categoryName,
    toolType,
    description: customConfig?.description || matchedTool?.description || `Format and prepare compliant documents strictly for official portal submission.`,
    badge: matchedTool?.badge || customConfig?.badge,
    targetKB,
    minKB,
    dimensions,
    aspectRatioText: customConfig?.aspectRatioText,
    format: customConfig?.format || 'JPG / JPEG',
    examName,
    boardName: customConfig?.boardName,
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
