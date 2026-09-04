export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  author: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ssc-cgl-chsl-photo-signature-guidelines',
    title: 'Complete SSC CGL & CHSL Photo and Signature Upload Guide',
    description: 'Master SSC photo dimensions, 50 KB size locks, and black ink signature rules to prevent application rejection.',
    date: 'May 12, 2026',
    readTime: '5 min read',
    author: 'Formilo Editorial Team',
    content: [
      {
        heading: 'Understanding SSC Portal Document Standards',
        paragraphs: [
          'The Staff Selection Commission (SSC) conducts massive national recruitments including CGL, CHSL, MTS, and GD Constable. One of the most common reasons candidates face application rejection or image upload errors is failing to meet strict pixel dimensions and binary byte weights.',
          'According to official notification guidelines, passport photographs must be captured against a clean, light or solid white background with a clear frontal view of the face. The file size must be strictly restricted between 20 KB and 50 KB in JPG or JPEG format.'
        ]
      },
      {
        heading: 'Candidate Signature & Handwritten Declaration Rules',
        paragraphs: [
          'For signature uploads, SSC portals require dimensions typically formatted around 140 × 60 pixels with a file size ranging from 10 KB to 20 KB. Signatures must be executed using a black ink pen on clean white paper.',
          'Writing signatures in capital block letters or using blue ink on ruled notebooks often triggers automated portal disqualification. Always crop tightly around your ink strokes without leaving dark borders.'
        ]
      },
      {
        heading: 'How to Verify Before Final Submission',
        paragraphs: [
          'Before locking your application form on the official SSC website, open your resized photo and signature files to inspect facial clarity and text legibility. Utilize browser-based client-side utility tools like Formilo to ensure your files match exact specifications safely without exposing private data to remote servers.'
        ]
      }
    ]
  },
  {
    slug: 'how-to-compress-pdf-certificates-under-100kb',
    title: 'How to Compress Marksheet and Certificate PDFs Under 100 KB',
    description: 'Step-by-step guide on reducing PDF certificate and degree file sizes for government application portals.',
    date: 'May 15, 2026',
    readTime: '4 min read',
    author: 'Formilo Editorial Team',
    content: [
      {
        heading: 'Why Government Portals Limit PDF File Sizes',
        paragraphs: [
          'Government and banking recruitment portals (such as IBPS, UPSC, and RRB) mandate that supporting documents like 10th/12th marksheets, caste certificates, and graduation degrees must be uploaded under tight limits, typically 100 KB, 200 KB, or 300 KB.',
          'High-resolution smartphone scans often produce multi-megabyte PDF files that overload portal upload queues and get automatically rejected.'
        ]
      },
      {
        heading: 'Balancing Resolution and Readability',
        paragraphs: [
          'When compressing PDFs, the primary challenge is ensuring that serial numbers, roll numbers, board seals, and authority signatures remain perfectly legible. Over-compressing can convert text into unreadable pixelated artifacts.',
          'Using client-side vector-preserving PDF compression streams ensures that text sharpness is maintained while stripping redundant background metadata.'
        ]
      }
    ]
  },
  {
    slug: 'avoiding-common-photo-rejections-in-bank-exams',
    title: 'Top 5 Reasons Bank Exam Application Photos Get Rejected',
    description: 'Learn how to avoid flash glare, wrong background colors, and improper aspect ratios in IBPS and SBI forms.',
    date: 'May 18, 2026',
    readTime: '4 min read',
    author: 'Formilo Editorial Team',
    content: [
      {
        heading: '1. Incorrect Pixel Dimensions & Aspect Ratio',
        paragraphs: [
          'Banking portals powered by IBPS have automated pixel checkers. If your photo is uploaded with an incorrect width-to-height ratio, facial features will appear horizontally squashed or vertically elongated, leading to instant rejection.'
        ]
      },
      {
        heading: '2. Flash Glare on Spectacles',
        paragraphs: [
          'If you wear prescription glasses, ensure there is no white light reflection or flash glare obscuring your eyes. Ideally, take off glasses if permitted by current guidelines.'
        ]
      },
      {
        heading: '3. Patterned or Dark Backgrounds',
        paragraphs: [
          'Recruitment boards explicitly require a plain white or very light-colored background. Wall textures, curtains, or outdoor scenery behind you will fail automated image verification.'
        ]
      }
    ]
  },
  {
    slug: 'importance-of-client-side-document-processing',
    title: 'Why Client-Side Document Processing Matters for Privacy',
    description: 'Discover how browser RAM processing protects your confidential marksheets and ID cards from cloud server exposure.',
    date: 'May 22, 2026',
    readTime: '4 min read',
    author: 'Formilo Editorial Team',
    content: [
      {
        heading: 'The Risk of Uploading Private Documents Online',
        paragraphs: [
          'When applying for government examinations, candidates must upload sensitive documents including Aadhaar cards, PAN cards, academic marksheets, and signatures. Traditional online tools upload these files to remote cloud servers where they risk permanent logging or unauthorized storage.'
        ]
      },
      {
        heading: 'How In-Browser HTML5 Canvas Protects You',
        paragraphs: [
          'Modern web utilities leverage client-side HTML5 Canvas APIs, WebAssembly, and JavaScript streams to execute all image cropping, resizing, and PDF compression directly inside your device memory (RAM).',
          'Because the file never leaves your browser device during transformation, your confidential data remains 100% private and secure.'
        ]
      }
    ]
  }
];
