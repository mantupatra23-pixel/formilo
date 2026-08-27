import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real Recruitment Exam Configurations with Exact Board Specifications
const EXAM_MASTER = [
  // 1. Staff Selection Commission (SSC)
  {
    id: 'ssc-cgl-2026',
    name: 'SSC CGL 2026',
    board: 'SSC',
    tools: [
      { type: 'photo', slugSuffix: 'passport-photo-resizer', name: 'SSC CGL Live Passport Photo Resizer (20-50 KB)', desc: 'Resize official SSC CGL candidate photo strictly between 20 KB to 50 KB (3.5 x 4.5 cm) without blur.', kb: 50, dim: '350 × 450 px', badge: 'SSC' },
      { type: 'signature', slugSuffix: 'signature-resizer-under-20kb', name: 'SSC CGL Signature Resizer (10-20 KB)', desc: 'Crop and compress official signature on white background between 10 KB to 20 KB (4.0 x 2.0 cm).', kb: 20, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'photo', slugSuffix: 'name-date-photo-generator', name: 'SSC CGL Photo with Name & Date (DOP) Maker', desc: 'Add printed candidate name and date of photo on passport picture strictly under 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'DOP' }
    ]
  },
  {
    id: 'ssc-gd-constable-2026',
    name: 'SSC GD Constable 2026',
    board: 'SSC',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-20kb-50kb', name: 'SSC GD Constable Photo Resizer (20-50 KB)', desc: 'Format passport photo for CAPF/GD Constable registration strictly under 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'SSC GD' },
      { type: 'signature', slugSuffix: 'signature-crop-20kb', name: 'SSC GD Constable Signature Crop & Compress (< 20 KB)', desc: 'Compress clear black ink signature between 10 KB to 20 KB for SSC GD recruitment.', kb: 20, dim: '280 × 120 px', badge: 'SIGN' }
    ]
  },
  {
    id: 'ssc-chsl-2026',
    name: 'SSC CHSL 2026',
    board: 'SSC',
    tools: [
      { type: 'photo', slugSuffix: 'photo-compressor-50kb', name: 'SSC CHSL 10+2 Photo Compressor (20-50 KB)', desc: 'Resize 10+2 LDC/DEO portal candidate photo strictly between 20 KB to 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'SSC CHSL' },
      { type: 'signature', slugSuffix: 'signature-resizer-20kb', name: 'SSC CHSL Signature Resizer under 20 KB', desc: 'Crop signature on clean white paper strictly between 10 KB to 20 KB.', kb: 20, dim: '280 × 120 px', badge: 'SIGN' }
    ]
  },

  // 2. National Testing Agency (NTA & Medical/Engineering)
  {
    id: 'nta-neet-ug-2026',
    name: 'NTA NEET UG 2026',
    board: 'NTA NEET',
    tools: [
      { type: 'photo', slugSuffix: 'passport-photo-10kb-200kb', name: 'NEET UG Passport Photo Resizer (10-200 KB)', desc: 'White background 80% face coverage passport photo converter between 10 KB to 200 KB.', kb: 200, dim: '350 × 450 px', badge: 'NEET UG' },
      { type: 'photo', slugSuffix: 'postcard-size-photo-4x6', name: 'NEET UG 4x6 Postcard Size Photo Resizer (10-200 KB)', desc: 'Resize official 4x6 inch postcard photograph strictly between 10 KB to 200 KB.', kb: 200, dim: '480 × 720 px', badge: '4x6 POSTCARD' },
      { type: 'signature', slugSuffix: 'signature-resizer-4kb-30kb', name: 'NEET UG Signature Resizer (4-30 KB)', desc: 'Format running handwriting signature on white paper between 4 KB to 30 KB.', kb: 30, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'signature', slugSuffix: 'left-and-right-fingers-thumb-impression', name: 'NEET UG Fingers & Thumb Impression Resizer', desc: 'Compress left and right hand fingers & thumb impression between 10 KB to 200 KB.', kb: 200, dim: '400 × 250 px', badge: 'THUMB' }
    ]
  },
  {
    id: 'nta-jee-main-2026',
    name: 'JEE Main 2026',
    board: 'NTA JEE',
    tools: [
      { type: 'photo', slugSuffix: 'passport-photo-resizer', name: 'JEE Main Candidate Photo Resizer (10-200 KB)', desc: 'Format engineering entrance photo strictly between 10 KB to 200 KB with 80% face coverage.', kb: 200, dim: '350 × 450 px', badge: 'JEE MAIN' },
      { type: 'signature', slugSuffix: 'signature-compressor-30kb', name: 'JEE Main Scanned Signature Compressor (4-30 KB)', desc: 'Compress scanned candidate signature strictly under 30 KB.', kb: 30, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'pdf', slugSuffix: 'category-certificate-pdf-converter', name: 'JEE Main Category Certificate PDF Compressor (50-300 KB)', desc: 'Compress Gen-EWS, OBC-NCL, SC, ST certificate PDF strictly between 50 KB to 300 KB.', kb: 300, dim: 'A4 Document', badge: 'PDF' }
    ]
  },

  // 3. Banking (IBPS, SBI & RBI)
  {
    id: 'sbi-po-clerk-2026',
    name: 'SBI PO & Clerk 2026',
    board: 'SBI',
    tools: [
      { type: 'photo', slugSuffix: 'passport-size-photo-resizer', name: 'SBI PO/Clerk Photo Resizer (20-50 KB)', desc: 'Format official SBI recruitment photograph strictly between 20 KB to 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'SBI' },
      { type: 'signature', slugSuffix: 'signature-resizer-10kb-20kb', name: 'SBI Signature Resizer (10-20 KB)', desc: 'Compress black ink signature strictly under 20 KB (not in capital letters).', kb: 20, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'signature', slugSuffix: 'left-thumb-impression-20kb-50kb', name: 'SBI Left Thumb Impression Resizer (20-50 KB)', desc: 'Format blue/black ink left thumb impression strictly between 20 KB to 50 KB (240x240 px).', kb: 50, dim: '240 × 240 px', badge: 'THUMB' },
      { type: 'photo', slugSuffix: 'handwritten-declaration-resizer-50kb-100kb', name: 'SBI Handwritten Declaration Resizer (50-100 KB)', desc: 'Compress scanned English handwritten declaration text between 50 KB to 100 KB.', kb: 100, dim: '800 × 400 px', badge: 'DECLARATION' }
    ]
  },
  {
    id: 'ibps-po-clerk-rrb-2026',
    name: 'IBPS PO / Clerk / RRB 2026',
    board: 'IBPS',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-20kb-50kb', name: 'IBPS Exam Photo Resizer (20-50 KB)', desc: 'Resize 4.5cm x 3.5cm candidate photograph between 20 KB to 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'IBPS' },
      { type: 'signature', slugSuffix: 'signature-compressor-20kb', name: 'IBPS Signature Compressor (10-20 KB)', desc: 'Format black ink signature between 10 KB to 20 KB for IBPS recruitment.', kb: 20, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'signature', slugSuffix: 'left-thumb-resizer-50kb', name: 'IBPS Thumb Impression Resizer (20-50 KB)', desc: 'Compress clear thumb impression strictly between 20 KB to 50 KB.', kb: 50, dim: '240 × 240 px', badge: 'THUMB' },
      { type: 'photo', slugSuffix: 'handwritten-declaration-100kb', name: 'IBPS Handwritten Declaration Compressor (50-100 KB)', desc: 'Format official handwritten declaration text image strictly between 50 KB to 100 KB.', kb: 100, dim: '800 × 400 px', badge: 'DECLARATION' }
    ]
  },

  // 4. Railways (RRB)
  {
    id: 'rrb-ntpc-alp-technician-2026',
    name: 'RRB NTPC & ALP 2026',
    board: 'RRB',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-30kb-70kb', name: 'Railway RRB NTPC/ALP Photo Resizer (30-70 KB)', desc: 'Format clear color photo with white background strictly between 30 KB to 70 KB (35x45mm).', kb: 70, dim: '350 × 450 px', badge: 'RRB' },
      { type: 'signature', slugSuffix: 'signature-resizer-30kb-70kb', name: 'Railway RRB Signature Resizer (30-70 KB)', desc: 'Compress running hand signature between 30 KB to 70 KB on plain white paper.', kb: 70, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'pdf', slugSuffix: 'sc-st-travel-pass-pdf-compressor', name: 'RRB SC/ST Free Travel Pass Certificate Compressor (< 500 KB)', desc: 'Compress caste certificate PDF/image under 500 KB for free rail travel pass.', kb: 500, dim: 'A4 Document', badge: 'PDF' }
    ]
  },

  // 5. State Police Recruitments
  {
    id: 'up-police-constable-si-2026',
    name: 'UP Police Constable & SI 2026',
    board: 'UPPRPB',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-20kb-50kb', name: 'UP Police Photo Resizer (20-50 KB)', desc: 'Format candidate photo with light grey/white background strictly between 20 KB to 50 KB.', kb: 50, dim: '350 × 450 px', badge: 'UP POLICE' },
      { type: 'signature', slugSuffix: 'signature-resizer-5kb-20kb', name: 'UP Police Signature Resizer (5-20 KB)', desc: 'Resize black ink signature (3.5 x 1.5 cm) strictly between 5 KB to 20 KB.', kb: 20, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'pdf', slugSuffix: 'digilocker-certificate-pdf-resizer', name: 'UP Police 10th/12th & Domicile Certificate PDF Compressor (< 100 KB)', desc: 'Compress educational marksheet and caste certificate strictly under 100 KB.', kb: 100, dim: 'A4 Document', badge: 'PDF' }
    ]
  },
  {
    id: 'bihar-police-csbc-bpssc-2026',
    name: 'Bihar Police & Daroga SI 2026',
    board: 'CSBC / BPSSC',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-under-25kb', name: 'Bihar Police Photo Resizer (< 25 KB)', desc: 'Compress passport photograph strictly under 25 KB with clear facial features.', kb: 25, dim: '350 × 450 px', badge: 'BIHAR POLICE' },
      { type: 'signature', slugSuffix: 'hindi-english-signature-resizer', name: 'Bihar Police Hindi & English Dual Signature Resizer (< 25 KB)', desc: 'Format both Hindi and English scanned signatures strictly under 25 KB each.', kb: 25, dim: '280 × 120 px', badge: 'DUAL SIGN' }
    ]
  },
  {
    id: 'odisha-police-oprb-2026',
    name: 'Odisha Police Constable 2026',
    board: 'OPRB',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-under-50kb', name: 'Odisha Police Photo Resizer (< 50 KB)', desc: 'Format candidate passport photo between 20 KB to 50 KB for OPRB portal.', kb: 50, dim: '350 × 450 px', badge: 'ODISHA POLICE' },
      { type: 'signature', slugSuffix: 'signature-crop-20kb', name: 'Odisha Police Signature Crop & Compress (< 20 KB)', desc: 'Crop clean black/blue signature under 20 KB for Odisha recruitment.', kb: 20, dim: '280 × 120 px', badge: 'SIGN' }
    ]
  },
  {
    id: 'maharashtra-police-bharti-2026',
    name: 'Maharashtra Police Bharti 2026',
    board: 'MahaPolice',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-50kb', name: 'Maharashtra Police Bharti Photo Resizer (< 50 KB)', desc: 'Resize candidate photo under 50 KB (160x212 px) for MahaPolice online form.', kb: 50, dim: '160 × 212 px', badge: 'MAHA POLICE' },
      { type: 'signature', slugSuffix: 'signature-resizer-50kb', name: 'Maharashtra Police Signature Resizer (< 50 KB)', desc: 'Compress signature strictly under 50 KB (256x64 px) for Police Bharti.', kb: 50, dim: '256 × 64 px', badge: 'SIGN' }
    ]
  },

  // 6. Defence Services (Army, Navy, Air Force, Coast Guard)
  {
    id: 'indian-army-agniveer-rally-2026',
    name: 'Indian Army Agniveer Rally 2026',
    board: 'Indian Army',
    tools: [
      { type: 'photo', slugSuffix: 'rally-photo-resizer-10kb-20kb', name: 'Indian Army Rally Photo Resizer (10-20 KB)', desc: 'Compress passport size photo strictly between 10 KB to 20 KB for Join Indian Army portal.', kb: 20, dim: '350 × 450 px', badge: 'ARMY' },
      { type: 'signature', slugSuffix: 'signature-crop-5kb-10kb', name: 'Indian Army Signature Resizer (5-10 KB)', desc: 'Crop signature strictly between 5 KB to 10 KB for Agniveer registration.', kb: 10, dim: '280 × 120 px', badge: 'SIGN' }
    ]
  },
  {
    id: 'iaf-agniveervayu-2026',
    name: 'Indian Air Force Agniveervayu 2026',
    board: 'IAF',
    tools: [
      { type: 'photo', slugSuffix: 'chalk-slate-photo-resizer-10kb-50kb', name: 'Air Force Photo with Name & Date Slate (10-50 KB)', desc: 'Format passport photo holding black slate with candidate name and DOP written in white chalk.', kb: 50, dim: '350 × 450 px', badge: 'SLATE PHOTO' },
      { type: 'signature', slugSuffix: 'signature-compressor-10kb-50kb', name: 'IAF Agniveervayu Signature Resizer (10-50 KB)', desc: 'Compress clear signature image between 10 KB to 50 KB for Air Force portal.', kb: 50, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'signature', slugSuffix: 'left-thumb-impression-resizer-10kb-50kb', name: 'IAF Left Thumb Impression Resizer (10-50 KB)', desc: 'Format candidate thumb print strictly between 10 KB to 50 KB.', kb: 50, dim: '240 × 240 px', badge: 'THUMB' }
    ]
  },

  // 7. High Court & Legal Services
  {
    id: 'allahabad-high-court-ro-aro-2026',
    name: 'Allahabad High Court RO/ARO & Group C/D 2026',
    board: 'AHC / NTA',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-10kb-200kb', name: 'Allahabad High Court Photo Resizer (10-200 KB)', desc: 'Resize passport photo for High Court RO/ARO recruitment between 10 KB to 200 KB.', kb: 200, dim: '350 × 450 px', badge: 'AHC' },
      { type: 'signature', slugSuffix: 'signature-resizer-4kb-30kb', name: 'Allahabad High Court Signature Resizer (4-30 KB)', desc: 'Crop and compress official signature strictly between 4 KB to 30 KB.', kb: 30, dim: '280 × 120 px', badge: 'SIGN' },
      { type: 'pdf', slugSuffix: 'marksheet-caste-pdf-compressor', name: 'High Court Marksheet & Caste Certificate PDF (< 300 KB)', desc: 'Compress qualifying certificates and marksheets to clean PDF under 300 KB.', kb: 300, dim: 'A4 Document', badge: 'PDF' }
    ]
  },

  // 8. Official Government Identity & License
  {
    id: 'pan-card-nsdl-utiitsl',
    name: 'PAN Card NSDL / UTIITSL 2026',
    board: 'Income Tax / NSDL',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-213x213-300dpi', name: 'PAN Card Photo Resizer (Exact 213x213 px, 300 DPI)', desc: 'Resize passport photo to exact 213x213 px, 300 DPI and under 30 KB for NSDL portal.', kb: 30, dim: '213 × 213 px', badge: 'PAN NSDL' },
      { type: 'signature', slugSuffix: 'signature-resizer-400x200-300dpi', name: 'PAN Card Signature Resizer (Exact 400x200 px, 300 DPI)', desc: 'Format signature to exact 400x200 px, 300 DPI and under 30 KB for UTIITSL & NSDL.', kb: 30, dim: '400 × 200 px', badge: 'PAN SIGN' },
      { type: 'pdf', slugSuffix: 'aadhaar-supporting-doc-pdf-converter', name: 'PAN Card Supporting Documents 2MB PDF Converter', desc: 'Combine Aadhaar, address proof and DOB certificate into single 300 DPI PDF.', kb: 2000, dim: 'Multi-Page A4', badge: 'PDF' }
    ]
  },
  {
    id: 'sarathi-parivahan-driving-licence',
    name: 'Sarathi Parivahan Driving Licence',
    board: 'MoRTH',
    tools: [
      { type: 'photo', slugSuffix: 'photo-resizer-10kb-20kb', name: 'Driving Licence Learning / LL Photo Resizer (10-20 KB)', desc: 'Compress candidate photo strictly between 10 KB to 20 KB (420x525 px) for Sarathi.', kb: 20, dim: '420 × 525 px', badge: 'PARIVAHAN' },
      { type: 'signature', slugSuffix: 'signature-resizer-10kb-20kb', name: 'Sarathi Driving Licence Signature Resizer (10-20 KB)', desc: 'Crop and compress signature strictly between 10 KB to 20 KB (256x64 px).', kb: 20, dim: '256 × 64 px', badge: 'SIGN' }
    ]
  }
];

const autoGeneratedTools = [];
const examPresets = [];

EXAM_MASTER.forEach((exam) => {
  examPresets.push({
    slug: exam.id,
    title: exam.name,
    board: exam.board,
    toolsCount: exam.tools.length
  });

  exam.tools.forEach((t) => {
    autoGeneratedTools.push({
      id: `${exam.id}-${t.slugSuffix}`,
      slug: `/exam/${exam.id}-${t.slugSuffix}`,
      name: t.name,
      description: t.desc,
      category: t.type,
      badge: t.badge,
      targetKB: t.kb,
      dimensions: t.dim,
      isPopular: false
    });
  });
});

// Output clean unique data files
fs.writeFileSync(path.join(__dirname, '../data/exam-presets.json'), JSON.stringify(examPresets, null, 2), 'utf-8');
fs.writeFileSync(path.join(__dirname, '../lib/autoGeneratedTools.json'), JSON.stringify(autoGeneratedTools, null, 2), 'utf-8');

console.log(`✅ SEO Engine Updated: Generated ${autoGeneratedTools.length} unique, high-intent programmatic tools across ${examPresets.length} recruitment exams!`);
