// scripts/generate-exams.js
const fs = require('fs');
const path = require('path');

const exams = [
  // National Exams
  { name: 'SSC CGL 2026', org: 'Staff Selection Commission', slug: 'ssc-cgl' },
  { name: 'SSC CHSL 2026', org: 'Staff Selection Commission', slug: 'ssc-chsl' },
  { name: 'SSC GD Constable', org: 'Staff Selection Commission', slug: 'ssc-gd' },
  { name: 'SSC MTS', org: 'Staff Selection Commission', slug: 'ssc-mts' },
  { name: 'SSC CPO Sub-Inspector', org: 'Staff Selection Commission', slug: 'ssc-cpo' },
  { name: 'UPSC Civil Services CSE', org: 'Union Public Service Commission', slug: 'upsc-cse' },
  { name: 'UPSC NDA & NA', org: 'Union Public Service Commission', slug: 'upsc-nda' },
  { name: 'UPSC CDS Exam', org: 'Union Public Service Commission', slug: 'upsc-cds' },
  { name: 'IBPS PO Recruitment', org: 'IBPS', slug: 'ibps-po' },
  { name: 'IBPS Clerk 2026', org: 'IBPS', slug: 'ibps-clerk' },
  { name: 'SBI PO Online Form', org: 'State Bank of India', slug: 'sbi-po' },
  { name: 'SBI Junior Associate', org: 'State Bank of India', slug: 'sbi-clerk' },
  { name: 'RRB NTPC Graduate & Under Graduate', org: 'Railway Recruitment Boards', slug: 'rrb-ntpc' },
  { name: 'RRB Group D Railway', org: 'Railway Recruitment Boards', slug: 'rrb-group-d' },
  { name: 'RRB ALP Assistant Loco Pilot', org: 'Railway Recruitment Boards', slug: 'rrb-alp' },
  { name: 'NEET UG 2026', org: 'National Testing Agency (NTA)', slug: 'neet-ug' },
  { name: 'JEE Main 2026', org: 'National Testing Agency (NTA)', slug: 'jee-main' },
  { name: 'CUET UG Examination', org: 'National Testing Agency (NTA)', slug: 'cuet-ug' },
  { name: 'CTET Central Teacher Eligibility Test', org: 'CBSE', slug: 'ctet' },
  { name: 'Indian Army Agniveer Rally', org: 'Indian Army', slug: 'army-agniveer' },
  { name: 'Indian Navy SSR & MR', org: 'Indian Navy', slug: 'navy-ssr' },
  { name: 'Indian Airforce Agniveervayu', org: 'Indian Airforce', slug: 'iaf-agniveervayu' },
  
  // State Exams
  { name: 'UP Police Constable 2026', org: 'UPPRPB', slug: 'up-police-constable' },
  { name: 'UP Police SI Sub-Inspector', org: 'UPPRPB', slug: 'up-police-si' },
  { name: 'Bihar Police Constable', org: 'CSBC', slug: 'bihar-police-constable' },
  { name: 'Bihar SI Daroga', org: 'BPSSC', slug: 'bihar-police-si' },
  { name: 'BPSC Combined Competitive', org: 'BPSC', slug: 'bpsc-cce' },
  { name: 'UPPSC Combined State Upper Subordinate', org: 'UPPSC', slug: 'uppsc-pre' },
  { name: 'Rajasthan Police Constable', org: 'Rajasthan Police', slug: 'rajasthan-police' },
  { name: 'Rajasthan REET Exam', org: 'RBSE', slug: 'rajasthan-reet' },
  { name: 'MP Police Constable', org: 'MPESB', slug: 'mp-police-constable' },
  { name: 'Haryana CET Group C & D', org: 'HSSC', slug: 'haryana-cet' },
  { name: 'Delhi Police Constable', org: 'SSC', slug: 'delhi-police-constable' },
  { name: 'DSSSB Recruitment Board', org: 'DSSSB', slug: 'dsssb-recruitment' },
  { name: 'West Bengal Police WBP SI', org: 'WBPRB', slug: 'wbp-constable' },
  { name: 'Odisha Police Constable & SI', org: 'OPRB', slug: 'odisha-police' },
  { name: 'Maharashtra Police Bharti', org: 'Maharashtra Police', slug: 'maharashtra-police' },
  { name: 'Telangana TS Police Constable', org: 'TSLPRB', slug: 'ts-police' },
  { name: 'AP Police Constable Recruitment', org: 'SLPRB AP', slug: 'ap-police' }
];

const docTypes = [
  {
    type: 'passport-photo',
    title: 'Passport Size Photo Resizer',
    desc: 'Compress and resize official passport photo strictly between 20 KB to 50 KB with 3.5cm x 4.5cm dimension (350x450 px).',
    targetKB: 50,
    minKB: 20,
    width: 350,
    height: 450,
    dpi: 300
  },
  {
    type: 'signature',
    title: 'Signature Crop & Compress Under 20 KB',
    desc: 'Crop signature on white background and compress strictly under 10 KB to 20 KB with 140x60 px dimensions.',
    targetKB: 20,
    minKB: 10,
    width: 280,
    height: 120,
    dpi: 200
  },
  {
    type: 'left-thumb-impression',
    title: 'Left Thumb Impression Resizer',
    desc: 'Format candidate thumb print impression to blue/black ink standard strictly between 10 KB to 20 KB.',
    targetKB: 20,
    minKB: 10,
    width: 240,
    height: 240,
    dpi: 200
  },
  {
    type: 'postcard-photo-4x6',
    title: 'Postcard Size Photo (4x6 Inch) Resizer',
    desc: 'Resize full postcard size 4x6 photograph with white background strictly between 50 KB to 200 KB.',
    targetKB: 200,
    minKB: 50,
    width: 480,
    height: 720,
    dpi: 300
  }
];

const generatedTools = [];

exams.forEach(exam => {
  docTypes.forEach(doc => {
    generatedTools.push({
      slug: `${exam.slug}-${doc.type}`,
      examName: exam.name,
      org: exam.org,
      docType: doc.type,
      title: `${exam.name} ${doc.title}`,
      description: `Free online ${doc.title.toLowerCase()} for ${exam.name} conducted by ${exam.org}. ${doc.desc} 100% private in-browser tool.`,
      targetKB: doc.targetKB,
      minKB: doc.minKB,
      width: doc.width,
      height: doc.height,
      dpi: doc.dpi,
      dimensions: `${doc.width} x ${doc.height} px`
    });
  });
});

const outputPath = path.join(__dirname, '../data/exam-presets.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedTools, null, 2));
console.log(`Generated ${generatedTools.length} high-intent exam pages in data/exam-presets.json`);
