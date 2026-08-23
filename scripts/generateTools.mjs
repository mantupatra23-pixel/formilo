// scripts/generateTools.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top GSC Keyword Clusters: State Police, Central, Medical, High Courts & Document Utilities
const HIGH_INTENT_EXAMS = [
  // 1. Surging State Police & Defense Recruitment
  { name: 'Bihar Police Constable & SI', baseSlug: 'bihar-police', board: 'CSBC / BPSSC', kbPhoto: 50, kbSign: 20 },
  { name: 'UP Police Constable & SI', baseSlug: 'up-police', board: 'UPPRPB', kbPhoto: 50, kbSign: 20 },
  { name: 'Odisha Police Constable', baseSlug: 'odisha-police-constable', board: 'OPRB', kbPhoto: 50, kbSign: 20 },
  { name: 'Maharashtra Police Bharti', baseSlug: 'maharashtra-police-bharti', board: 'MahaPolice', kbPhoto: 50, kbSign: 20 },
  { name: 'Delhi Police Constable & Driver', baseSlug: 'delhi-police', board: 'SSC / DP', kbPhoto: 50, kbSign: 20 },
  { name: 'Indian Army Agniveer GD & Tech', baseSlug: 'indian-army-agniveer', board: 'Indian Army', kbPhoto: 50, kbSign: 20 },
  { name: 'Indian Air Force Agniveervayu', baseSlug: 'indian-air-force-agniveervayu', board: 'IAF', kbPhoto: 50, kbSign: 20 },
  { name: 'Indian Navy Agniveer SSR MR', baseSlug: 'indian-navy-agniveer-ssr-mr', board: 'Indian Navy', kbPhoto: 50, kbSign: 20 },
  { name: 'Coast Guard Navik DB GD', baseSlug: 'coast-guard-navik', board: 'ICG', kbPhoto: 50, kbSign: 20 },
  { name: 'ITBP Constable & Tradesman', baseSlug: 'itbp-constable', board: 'ITBP', kbPhoto: 50, kbSign: 20 },
  { name: 'CISF Constable Tradesman & HCM', baseSlug: 'cisf-constable-hcm', board: 'CISF', kbPhoto: 50, kbSign: 20 },
  { name: 'BSF Constable Tradesman & RO RM', baseSlug: 'bsf-constable', board: 'BSF', kbPhoto: 50, kbSign: 20 },

  // 2. High Search Authority Banking & Insurance
  { name: 'SBI PO & Clerk Recruitment', baseSlug: 'sbi-po-clerk', board: 'State Bank of India', kbPhoto: 50, kbSign: 20 },
  { name: 'IBPS PO & Clerk Examination', baseSlug: 'ibps-po-clerk', board: 'IBPS', kbPhoto: 50, kbSign: 20 },
  { name: 'IBPS RRB Officer Scale & Assistant', baseSlug: 'ibps-rrb-officer-assistant', board: 'IBPS', kbPhoto: 50, kbSign: 20 },
  { name: 'RBI Grade B & Assistant', baseSlug: 'rbi-grade-b-assistant', board: 'Reserve Bank of India', kbPhoto: 50, kbSign: 20 },
  { name: 'EPFO SSA & Stenographer', baseSlug: 'epfo-ssa-steno', board: 'EPFO / NTA', kbPhoto: 50, kbSign: 20 },
  { name: 'LIC AAO & ADO Recruitment', baseSlug: 'lic-aao-ado', board: 'Life Insurance Corporation', kbPhoto: 50, kbSign: 20 },

  // 3. Central & State Public Service Commissions
  { name: 'UPSC IAS Civil Services Examination', baseSlug: 'upsc-ias-civil-services', board: 'UPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'UPSC CDS & NDA Examination', baseSlug: 'upsc-cds-nda', board: 'UPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'UPPSC Combined State Upper Subordinate', baseSlug: 'uppsc-pcs', board: 'UPPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'BPSC Combined Competitive Exam (CCE)', baseSlug: 'bpsc-cce', board: 'BPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'MPPSC State Service Examination', baseSlug: 'mppsc-state-service', board: 'MPPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'RPSC RAS & RTS Examination', baseSlug: 'rpsc-ras', board: 'RPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'WBPSC WBCS Executive', baseSlug: 'wbpsc-wbcs', board: 'WBPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'TSPSC Group 1 2 3 Services', baseSlug: 'tspsc-group-services', board: 'TSPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'APPSC Group 1 & 2 Examination', baseSlug: 'appsc-group-services', board: 'APPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'KPSC KAS Examination', baseSlug: 'kpsc-kas', board: 'KPSC', kbPhoto: 50, kbSign: 20 },
  { name: 'TNPSC Group 2 & 4 Services', baseSlug: 'tnpsc-group-services', board: 'TNPSC', kbPhoto: 50, kbSign: 20 },

  // 4. National Entrance & Medical Councils
  { name: 'NTA NEET UG Postcard & Photo', baseSlug: 'nta-neet-ug', board: 'National Testing Agency', kbPhoto: 200, kbSign: 20 },
  { name: 'JEE Main Candidate Registration', baseSlug: 'jee-main', board: 'National Testing Agency', kbPhoto: 200, kbSign: 20 },
  { name: 'CUET UG Examination', baseSlug: 'cuet-ug', board: 'NTA', kbPhoto: 200, kbSign: 20 },
  { name: 'AIIMS Nursing & Paramedical', baseSlug: 'aiims-nursing-paramedical', board: 'AIIMS New Delhi', kbPhoto: 50, kbSign: 20 },
  { name: 'NORCET Nursing Officer Examination', baseSlug: 'norcet-nursing-officer', board: 'AIIMS', kbPhoto: 50, kbSign: 20 },

  // 5. High Court, Subordinate Courts & Legal Services
  { name: 'Allahabad High Court Group C D & RO ARO', baseSlug: 'allahabad-high-court-ro-aro', board: 'NTA / AHC', kbPhoto: 50, kbSign: 20 },
  { name: 'Patna High Court Assistant & Stenographer', baseSlug: 'patna-high-court-assistant', board: 'Patna HC', kbPhoto: 50, kbSign: 20 },
  { name: 'Delhi High Court Judicial Service', baseSlug: 'delhi-high-court-judicial', board: 'Delhi HC', kbPhoto: 50, kbSign: 20 },
  { name: 'Supreme Court of India Junior Court Assistant', baseSlug: 'supreme-court-jca', board: 'SCI', kbPhoto: 50, kbSign: 20 },

  // 6. State Selection Subordinate Boards
  { name: 'DSSSB TGT PGT & Special Educator', baseSlug: 'dsssb-teacher-recruitment', board: 'DSSSB', kbPhoto: 50, kbSign: 20 },
  { name: 'HSSC CET Group C D Recruitment', baseSlug: 'hssc-cet-recruitment', board: 'HSSC Haryana', kbPhoto: 50, kbSign: 20 },
  { name: 'UKSSSC Graduate Level & Forest Guard', baseSlug: 'uksssc-recruitment', board: 'UKSSSC', kbPhoto: 50, kbSign: 20 },
  { name: 'RSMSSB CET Patwari & Village Officer', baseSlug: 'rsmssb-cet-patwari', board: 'RSMSSB', kbPhoto: 50, kbSign: 20 },

  // 7. Identity & Official Form Presets
  { name: 'Sarathi Parivahan Driving Licence', baseSlug: 'sarathi-parivahan-driving-licence', board: 'MoRTH', kbPhoto: 50, kbSign: 20 },
  { name: 'SSO Rajasthan Identity Portal', baseSlug: 'sso-rajasthan-profile', board: 'Govt of Rajasthan', kbPhoto: 50, kbSign: 20 }
];

const generatedRegistry = [];

HIGH_INTENT_EXAMS.forEach((item) => {
  const base = item.baseSlug;
  const title = item.name;
  const board = item.board;

  // Variant 1: Passport Size Photo
  generatedRegistry.push({
    id: `${base}-passport-size-photo-resizer`,
    slug: `/exam/${base}-passport-size-photo-resizer`,
    name: `${title} Passport Size Photo Resizer`,
    description: `Free online passport size photo resizer for ${title} (${board}). Compress strictly under ${item.kbPhoto} KB with clear facial clarity.`,
    category: 'photo',
    badge: board,
    targetKB: item.kbPhoto,
    dimensions: '350 × 450 px',
    isPopular: false,
  });

  // Variant 2: Signature Crop & Compress
  generatedRegistry.push({
    id: `${base}-signature-crop-compress`,
    slug: `/exam/${base}-signature-crop-compress`,
    name: `${title} Signature Crop & Compress`,
    description: `Crop and compress official signature strictly under ${item.kbSign} KB for ${title} on clean white background.`,
    category: 'signature',
    badge: 'SIGN',
    targetKB: item.kbSign,
    dimensions: '280 × 120 px',
    isPopular: false,
  });

  // Variant 3: Left Thumb Impression
  generatedRegistry.push({
    id: `${base}-left-thumb-impression-resizer`,
    slug: `/exam/${base}-left-thumb-impression-resizer`,
    name: `${title} Left Thumb Impression Resizer`,
    description: `Format blue/black ink thumb impression photo strictly under ${item.kbSign} KB for ${title}.`,
    category: 'signature',
    badge: 'THUMB',
    targetKB: item.kbSign,
    dimensions: '240 × 240 px',
    isPopular: false,
  });

  // Variant 4: Postcard Size Photo (4x6)
  generatedRegistry.push({
    id: `${base}-postcard-size-photo-4x6-resizer`,
    slug: `/exam/${base}-postcard-size-photo-4x6-resizer`,
    name: `${title} Postcard Size Photo (4x6 Inch) Resizer`,
    description: `Resize 4x6 inch postcard photograph strictly under 200 KB for ${title} online submission.`,
    category: 'photo',
    badge: '< 200 KB',
    targetKB: 200,
    dimensions: '480 × 720 px',
    isPopular: false,
  });
});

const outputPath = path.join(__dirname, '../lib/autoGeneratedTools.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedRegistry, null, 2), 'utf-8');
console.log(`✅ Successfully generated ${generatedRegistry.length} search-intent programmatic tools!`);
