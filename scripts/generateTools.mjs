// scripts/generateTools.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── 1. MASTER EXAM & PORTAL MATRIX ───────────────────────────────────────────
const EXAM_ENTITIES = [
  // Staff Selection Commission
  { name: 'SSC CGL', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC CHSL', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC MTS', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC GD Constable', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC CPO SI', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC Stenographer', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'SSC JE', category: 'ssc', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },

  // UPSC & Civil Services
  { name: 'UPSC IAS Civil Services', category: 'upsc', photoKb: 100, photoW: 350, photoH: 450, sigKb: 40, sigW: 350, sigH: 150 },
  { name: 'UPSC NDA', category: 'upsc', photoKb: 100, photoW: 350, photoH: 450, sigKb: 40, sigW: 350, sigH: 150 },
  { name: 'UPSC CDS', category: 'upsc', photoKb: 100, photoW: 350, photoH: 450, sigKb: 40, sigW: 350, sigH: 150 },
  { name: 'UPSC CAPF', category: 'upsc', photoKb: 100, photoW: 350, photoH: 450, sigKb: 40, sigW: 350, sigH: 150 },
  { name: 'UPSC EPFO', category: 'upsc', photoKb: 100, photoW: 350, photoH: 450, sigKb: 40, sigW: 350, sigH: 150 },

  // Banking & Insurance
  { name: 'IBPS PO', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'IBPS Clerk', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'IBPS RRB Officer', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'SBI PO', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'SBI Clerk Junior Associate', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'RBI Grade B', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },
  { name: 'LIC AAO', category: 'banking', photoKb: 50, photoW: 200, photoH: 230, sigKb: 20, sigW: 140, sigH: 60 },

  // Railways (RRB)
  { name: 'RRB NTPC', category: 'railway', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'RRB Group D', category: 'railway', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'RRB ALP', category: 'railway', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'RRB Technician', category: 'railway', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'RPF Constable SI', category: 'railway', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },

  // National Entrance Exams
  { name: 'NEET UG', category: 'entrance', photoKb: 200, photoW: 400, photoH: 500, sigKb: 30, sigW: 280, sigH: 120 },
  { name: 'JEE Main', category: 'entrance', photoKb: 200, photoW: 350, photoH: 450, sigKb: 30, sigW: 280, sigH: 120 },
  { name: 'JEE Advanced', category: 'entrance', photoKb: 100, photoW: 350, photoH: 450, sigKb: 30, sigW: 280, sigH: 120 },
  { name: 'CUET UG', category: 'entrance', photoKb: 100, photoW: 350, photoH: 450, sigKb: 30, sigW: 280, sigH: 120 },
  { name: 'GATE Exam', category: 'entrance', photoKb: 100, photoW: 480, photoH: 640, sigKb: 50, sigW: 320, sigH: 160 },
  { name: 'CTET', category: 'entrance', photoKb: 100, photoW: 350, photoH: 450, sigKb: 30, sigW: 280, sigH: 120 },
  { name: 'UGC NET', category: 'entrance', photoKb: 200, photoW: 350, photoH: 450, sigKb: 30, sigW: 280, sigH: 120 },

  // Defence Forces
  { name: 'Indian Army Agniveer', category: 'defence', photoKb: 20, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Indian Air Force Agniveervayu', category: 'defence', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Indian Navy Agniveer SSR MR', category: 'defence', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Coast Guard Navik', category: 'defence', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },

  // State Police & Recruitment Boards
  { name: 'UP Police Constable', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Bihar Police Constable CSBC', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Delhi Police Constable', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Rajasthan Police Constable', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'MP Police Constable', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Odisha Police Constable OPRB', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'West Bengal Police WBPRB', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'Maharashtra Police Bharti', category: 'state-police', photoKb: 50, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },

  // Identity & Government Portals
  { name: 'Driving License Sarathi', category: 'gov-service', photoKb: 20, photoW: 350, photoH: 450, sigKb: 20, sigW: 280, sigH: 120 },
  { name: 'PAN Card NSDL UTI', category: 'gov-service', photoKb: 50, photoW: 213, photoH: 213, sigKb: 30, sigW: 400, sigH: 200 },
  { name: 'Passport Seva Kendra', category: 'gov-service', photoKb: 50, photoW: 413, photoH: 531, sigKb: 30, sigW: 280, sigH: 120 },
];

function generateDynamicTools() {
  const generatedTools = [];

  for (const entity of EXAM_ENTITIES) {
    const baseSlug = entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 1. Photo Tool Auto Generation
    generatedTools.push({
      id: `${baseSlug}-photo-resizer`,
      slug: `${baseSlug}-photo-resizer`,
      name: `${entity.name} Photo Resizer`,
      category: 'photo',
      description: `Format and compress candidate passport photograph for ${entity.name} online form strictly under ${entity.photoKb} KB with ${entity.photoW}×${entity.photoH} px resolution.`,
      shortDescription: `Official ${entity.name} photo under ${entity.photoKb} KB.`,
      targetKB: entity.photoKb,
      targetWidth: entity.photoW,
      targetHeight: entity.photoH,
      instructions: [
        `Upload your front-facing passport photograph.`,
        `The engine automatically applies ${entity.photoW}×${entity.photoH} px dimensions and optimizes size under ${entity.photoKb} KB.`,
        `Click Download to get your application-ready JPG file.`
      ],
      faq: [
        {
          question: `What is the photo size limit for ${entity.name}?`,
          answer: `Official recruitment guidelines mandate candidate photos to be strictly under ${entity.photoKb} KB in JPG/JPEG format.`
        }
      ],
      relatedTools: [`${baseSlug}-signature-resizer`, 'signature-resize-20kb', 'jpg-to-pdf'],
      enabled: true,
      badge: 'Exam Preset',
      seoTitle: `${entity.name} Photo Resizer Online (Under ${entity.photoKb} KB) — Free | Formilo`,
      seoDescription: `Format and resize ${entity.name} application photos under ${entity.photoKb} KB online for free. Official dimensions & size guaranteed.`
    });

    // 2. Signature Tool Auto Generation
    generatedTools.push({
      id: `${baseSlug}-signature-resizer`,
      slug: `${baseSlug}-signature-resizer`,
      name: `${entity.name} Signature Resizer`,
      category: 'signature',
      description: `Resize and enhance scanned signature for ${entity.name} portal strictly under ${entity.sigKb} KB with sharp white background.`,
      shortDescription: `Official ${entity.name} signature under ${entity.sigKb} KB.`,
      targetKB: entity.sigKb,
      targetWidth: entity.sigW,
      targetHeight: entity.sigH,
      instructions: [
        `Upload your scanned signature.`,
        `The algorithm compresses the file below ${entity.sigKb} KB and locks ${entity.sigW}×${entity.sigH} px size.`,
        `Download your formatted signature.`
      ],
      faq: [
        {
          question: `What are the signature specifications for ${entity.name}?`,
          answer: `The signature must be signed with black/blue ink on white paper and uploaded under ${entity.sigKb} KB.`
        }
      ],
      relatedTools: [`${baseSlug}-photo-resizer`, 'photo-resize-20kb', 'jpg-to-pdf'],
      enabled: true,
      badge: 'Exam Preset',
      seoTitle: `${entity.name} Signature Resizer Online (Under ${entity.sigKb} KB) — Free | Formilo`,
      seoDescription: `Resize scanned signature for ${entity.name} online form under ${entity.sigKb} KB with high contrast.`
    });
  }

  const outputPath = path.join(__dirname, '..', 'lib', 'autoGeneratedTools.json');
  fs.writeFileSync(outputPath, JSON.stringify(generatedTools, null, 2), 'utf-8');
  console.log(`✅ Successfully generated ${generatedTools.length} automated programmatic tools at lib/autoGeneratedTools.json!`);
}

generateDynamicTools();
