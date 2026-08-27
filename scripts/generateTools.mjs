import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Exact High-Volume Search Console Utility Tools (Direct Keywords from GSC)
const GSC_DIRECT_UTILITY_TOOLS = [
  // PDF Compression & Conversion Hub
  { id: 'compress-pdf-to-100kb', slug: '/tools/compress-pdf-to-100kb', name: 'Compress PDF to 100 KB Online', desc: 'Reduce PDF file size strictly under 100 KB without losing text sharpness.', cat: 'pdf', badge: '< 100 KB', kb: 100, dim: 'A4 Document' },
  { id: 'compress-pdf-to-200kb', slug: '/tools/compress-pdf-to-200kb', name: 'Compress PDF to 200 KB Online', desc: 'Fast PDF compressor under 200 KB for government forms, marksheet, and certificates.', cat: 'pdf', badge: '< 200 KB', kb: 200, dim: 'A4 Document' },
  { id: 'compress-pdf-to-500kb', slug: '/tools/compress-pdf-to-500kb', name: 'Compress PDF to 500 KB Online', desc: 'Compress large multi-page PDF documents strictly under 500 KB for portal upload.', cat: 'pdf', badge: '< 500 KB', kb: 500, dim: 'A4 Document' },
  { id: 'pdf-size-reducer-under-300kb', slug: '/tools/pdf-size-reducer-300kb', name: 'PDF Size Reducer Under 300 KB', desc: 'Format and reduce PDF file size between 50 KB to 300 KB for online recruitment.', cat: 'pdf', badge: '< 300 KB', kb: 300, dim: 'A4 Document' },

  // Dedicated KB Increaser & Size Target Tools
  { id: 'convert-photo-in-20kb', slug: '/photo-resizer-20kb', name: 'Photo in 20 KB Size Converter', desc: 'Exact passport size photo compressor strictly under 20 KB for strict online forms.', cat: 'photo', badge: '< 20 KB', kb: 20, dim: '350 × 450 px' },
  { id: 'convert-photo-in-35kb', slug: '/tools/photo-resizer-35kb', name: '35 KB Photo & Document Converter', desc: 'Resize image and official certificates strictly under 35 KB.', cat: 'photo', badge: '< 35 KB', kb: 35, dim: 'Aspect-Safe' },
  { id: 'photo-resizer-80kb', slug: '/tools/photo-resizer-80kb', name: 'JPG Size Increase / Compress to 80 KB', desc: 'Target exact 80 KB image file size with zero distortion and high DPI.', cat: 'photo', badge: '< 80 KB', kb: 80, dim: 'Aspect-Safe' },
  { id: 'photo-resizer-150kb', slug: '/photo-resizer-150kb', name: 'Photo Less than 150 KB Resizer', desc: 'Format candidate photograph between 50 KB to 150 KB for NTA and university entrance.', cat: 'photo', badge: '< 150 KB', kb: 150, dim: '350 × 450 px' },
  { id: 'image-resizer-1mb', slug: '/tools/image-resizer-1mb', name: 'Image Resizer Under 1 MB', desc: 'Compress large camera raw photos and scanned documents strictly under 1 MB.', cat: 'photo', badge: '< 1 MB', kb: 1000, dim: 'Original Scale' },
  { id: 'image-resizer-1-5mb', slug: '/tools/image-resizer-1-5mb', name: 'Image Resizer Under 1.5 MB', desc: 'Resize high-resolution scanned certificate files strictly under 1.5 MB.', cat: 'photo', badge: '< 1.5 MB', kb: 1500, dim: 'Original Scale' },

  // PAN & Identity Cropping Utilities
  { id: 'uti-pan-cropping-tool', slug: '/exam/uti-pan-cropping-tool', name: 'UTIITSL PAN Card Photo & Signature Cropping Tool', desc: 'Crop photo to 213x213 px (300 DPI, 30 KB) and sign to 400x200 px (300 DPI, 30 KB) for UTI portal.', cat: 'exam', badge: 'UTIITSL', kb: 30, dim: '213 × 213 px' },
  { id: 'nsdl-pan-card-documents-size', slug: '/exam/nsdl-pan-documents-resizer', name: 'NSDL PAN Card Documents 2MB / 300 DPI Resizer', desc: 'Resize identity, address and DOB proof documents for NSDL e-Gov online application.', cat: 'pdf', badge: 'NSDL', kb: 2000, dim: 'A4 300 DPI' },
  { id: 'pan-signature-size-converter', slug: '/exam/pan-card-signature-resizer', name: 'PAN Card Signature Size Converter (400x200 px)', desc: 'Compress signature strictly under 30 KB with sharp black & white contrast.', cat: 'signature', badge: 'PAN SIGN', kb: 30, dim: '400 × 200 px' },
  { id: 'driving-licence-sarathi-photo', slug: '/exam/sarathi-parivahan-driving-licence-photo-resizer', name: 'Driving Licence Learning (LL/DL) Photo Resizer', desc: 'Format passport photo strictly between 10 KB to 20 KB (420x525 px) for Sarathi Parivahan.', cat: 'photo', badge: 'PARIVAHAN', kb: 20, dim: '420 × 525 px' },

  // Signature White Background & Cleaning Suite
  { id: 'make-background-white-signature', slug: '/tools/make-background-white-of-signature', name: 'Make Background White of Scanned Signature Online', desc: 'Remove grey shadow, yellow paper tint and convert scanned signatures to pure crisp white background.', cat: 'signature', badge: 'CLEAN SIGN', kb: 20, dim: 'High Contrast' },
  { id: 'convert-sign-into-20kb', slug: '/exam/signature-resize-to-20kb', name: 'Convert Signature into 20 KB Online', desc: 'Crop and compress official signature on white background strictly under 20 KB.', cat: 'signature', badge: 'SIGN < 20KB', kb: 20, dim: '280 × 120 px' },
  { id: 'upsc-photo-signature-resizer-online', slug: '/exam/upsc-photo-and-signature-size-resizer', name: 'UPSC OTR Photo and Signature Resizer Online', desc: 'Format UPSC One Time Registration (OTR) photo (20-300 KB) and signature (20-300 KB).', cat: 'exam', badge: 'UPSC OTR', kb: 100, dim: '350 × 450 px' }
];

// 2. Full 200+ Recruitment Exams Database 2026
const ALL_EXAMS_DB = [
  // SSC
  { id: 'ssc-cgl-2026', name: 'SSC CGL 2026', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-chsl-2026', name: 'SSC CHSL 10+2', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-gd-constable-2026', name: 'SSC GD Constable CAPF', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-mts-havaldar-2026', name: 'SSC MTS & Havaldar', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-cpo-si-delhi-police', name: 'SSC CPO SI Delhi Police CAPF', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-stenographer-grade-c-d', name: 'SSC Stenographer Grade C & D', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-je-junior-engineer', name: 'SSC Junior Engineer (JE)', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-selection-post-phase-13', name: 'SSC Selection Post Phase 13', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'ssc-jht-hindi-translator', name: 'SSC Junior Hindi Translator', board: 'SSC', photoKb: 50, signKb: 20 },

  // Railway (RRB)
  { id: 'rrb-ntpc-graduate-2026', name: 'RRB NTPC Graduate Level', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rrb-ntpc-undergraduate-2026', name: 'RRB NTPC Under Graduate 10+2', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rrb-alp-assistant-loco-pilot', name: 'RRB ALP Assistant Loco Pilot', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rrb-technician-grade-1-3', name: 'RRB Technician Grade 1 & 3', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rrb-group-d-level-1', name: 'RRB Group D Track Maintainer', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rrb-je-railway-engineer', name: 'RRB Junior Engineer JE', board: 'RRB', photoKb: 70, signKb: 70 },
  { id: 'rpf-si-railway-police', name: 'RPF Sub Inspector (SI)', board: 'RPF', photoKb: 50, signKb: 20 },
  { id: 'rpf-constable-recruitment', name: 'RPF Police Constable', board: 'RPF', photoKb: 50, signKb: 20 },
  { id: 'rrb-paramedical-staff', name: 'RRB Paramedical Staff Nurse', board: 'RRB', photoKb: 70, signKb: 70 },

  // Banking & Insurance
  { id: 'sbi-po-probationary-officer', name: 'SBI PO Probationary Officer', board: 'SBI', photoKb: 50, signKb: 20 },
  { id: 'sbi-clerk-junior-associate', name: 'SBI Clerk Junior Associate', board: 'SBI', photoKb: 50, signKb: 20 },
  { id: 'sbi-cbo-circle-based-officer', name: 'SBI Circle Based Officer (CBO)', board: 'SBI', photoKb: 50, signKb: 20 },
  { id: 'ibps-po-crp-recruitment', name: 'IBPS PO CRP Officer Scale I', board: 'IBPS', photoKb: 50, signKb: 20 },
  { id: 'ibps-clerk-examination', name: 'IBPS Clerk CRP Clerical', board: 'IBPS', photoKb: 50, signKb: 20 },
  { id: 'ibps-so-specialist-officer', name: 'IBPS Specialist Officer (SO)', board: 'IBPS', photoKb: 50, signKb: 20 },
  { id: 'ibps-rrb-officer-scale-1-2-3', name: 'IBPS RRB Gramin Bank Officer', board: 'IBPS', photoKb: 50, signKb: 20 },
  { id: 'ibps-rrb-office-assistant-multipurpose', name: 'IBPS RRB Office Assistant', board: 'IBPS', photoKb: 50, signKb: 20 },
  { id: 'rbi-grade-b-general-officer', name: 'RBI Grade B Officer', board: 'RBI', photoKb: 50, signKb: 20 },
  { id: 'rbi-assistant-recruitment', name: 'RBI Assistant Recruitment', board: 'RBI', photoKb: 50, signKb: 20 },
  { id: 'lic-aao-generalist-specialist', name: 'LIC AAO Assistant Admin Officer', board: 'LIC', photoKb: 50, signKb: 20 },
  { id: 'lic-ado-apprentice-development', name: 'LIC ADO Development Officer', board: 'LIC', photoKb: 50, signKb: 20 },
  { id: 'lic-hfl-assistant-manager', name: 'LIC HFL Housing Finance', board: 'LIC', photoKb: 50, signKb: 20 },
  { id: 'nabard-grade-a-assistant-manager', name: 'NABARD Grade A Manager', board: 'NABARD', photoKb: 50, signKb: 20 },
  { id: 'sebi-grade-a-officer', name: 'SEBI Grade A Officer', board: 'SEBI', photoKb: 50, signKb: 20 },
  { id: 'niacl-ao-administrative-officer', name: 'NIACL AO Generalist / Specialist', board: 'NIACL', photoKb: 50, signKb: 20 },
  { id: 'epfo-ssa-social-security-assistant', name: 'EPFO SSA Assistant & Steno', board: 'NTA / EPFO', photoKb: 50, signKb: 20 },
  { id: 'uiic-ao-administrative-officer', name: 'UIIC AO Insurance Officer', board: 'UIIC', photoKb: 50, signKb: 20 },

  // Defence & Police
  { id: 'upsc-nda-na-naval-academy', name: 'UPSC NDA & NA Examination', board: 'UPSC', photoKb: 100, signKb: 50 },
  { id: 'upsc-cds-combined-defence', name: 'UPSC CDS Combined Defence', board: 'UPSC', photoKb: 100, signKb: 50 },
  { id: 'afcat-air-force-officer', name: 'AFCAT Indian Air Force Flying & Ground', board: 'IAF', photoKb: 50, signKb: 20 },
  { id: 'indian-army-agniveer-gd', name: 'Indian Army Agniveer General Duty (GD)', board: 'Indian Army', photoKb: 20, signKb: 10 },
  { id: 'indian-army-agniveer-technical', name: 'Indian Army Agniveer Tech & Clerk', board: 'Indian Army', photoKb: 20, signKb: 10 },
  { id: 'indian-army-agniveer-tradesman', name: 'Indian Army Agniveer Tradesman 8th 10th', board: 'Indian Army', photoKb: 20, signKb: 10 },
  { id: 'indian-navy-agniveer-ssr', name: 'Indian Navy Agniveer SSR', board: 'Indian Navy', photoKb: 50, signKb: 20 },
  { id: 'indian-navy-agniveer-mr', name: 'Indian Navy Agniveer MR Matric', board: 'Indian Navy', photoKb: 50, signKb: 20 },
  { id: 'iaf-agniveervayu-intake-2026', name: 'IAF Indian Air Force Agniveervayu', board: 'IAF', photoKb: 50, signKb: 20 },
  { id: 'indian-coast-guard-navik-gd', name: 'Coast Guard Navik General Duty', board: 'ICG', photoKb: 50, signKb: 20 },
  { id: 'indian-coast-guard-navik-db', name: 'Coast Guard Navik Domestic Branch', board: 'ICG', photoKb: 50, signKb: 20 },
  { id: 'cisf-constable-tradesman-fireman', name: 'CISF Constable Fireman & Tradesman', board: 'CISF', photoKb: 50, signKb: 20 },
  { id: 'cisf-asi-steno-hcm', name: 'CISF Head Constable Ministerial & ASI', board: 'CISF', photoKb: 50, signKb: 20 },
  { id: 'bsf-constable-tradesman-ro-rm', name: 'BSF Constable Tradesman & Head Constable', board: 'BSF', photoKb: 50, signKb: 20 },
  { id: 'crpf-constable-technical-tradesman', name: 'CRPF Constable Technical & Tradesman', board: 'CRPF', photoKb: 50, signKb: 20 },
  { id: 'itbp-constable-tradesman-telecom', name: 'ITBP Constable Telecom & Tradesman', board: 'ITBP', photoKb: 50, signKb: 20 },
  { id: 'ssb-constable-tradesman-sub-inspector', name: 'SSB Sashastra Seema Bal Tradesman', board: 'SSB', photoKb: 50, signKb: 20 },
  { id: 'assam-rifles-technical-tradesman', name: 'Assam Rifles Rally Tradesman', board: 'Assam Rifles', photoKb: 50, signKb: 20 },

  // State Police
  { id: 'up-police-constable-civil', name: 'UP Police Constable Civil & PAC', board: 'UPPRPB', photoKb: 50, signKb: 20 },
  { id: 'up-police-si-daroga-recruitment', name: 'UP Police Sub Inspector (SI)', board: 'UPPRPB', photoKb: 50, signKb: 20 },
  { id: 'up-police-computer-operator-grade-a', name: 'UP Police Computer Operator & Programmer', board: 'UPPRPB', photoKb: 50, signKb: 20 },
  { id: 'bihar-police-constable-csbc-exam', name: 'Bihar Police Constable (CSBC)', board: 'CSBC', photoKb: 25, signKb: 25 },
  { id: 'bihar-police-si-daroga-bpssc', name: 'Bihar Police Daroga SI (BPSSC)', board: 'BPSSC', photoKb: 25, signKb: 25 },
  { id: 'delhi-police-constable-executive', name: 'Delhi Police Constable Executive', board: 'SSC / DP', photoKb: 50, signKb: 20 },
  { id: 'delhi-police-head-constable-ministerial', name: 'Delhi Police Head Constable (AWO/TPO)', board: 'SSC', photoKb: 50, signKb: 20 },
  { id: 'rajasthan-police-constable-recruitment', name: 'Rajasthan Police Constable RAC', board: 'Rajasthan Police', photoKb: 50, signKb: 20 },
  { id: 'mp-police-constable-esb', name: 'MP Police Constable (ESB)', board: 'MPESB', photoKb: 50, signKb: 20 },
  { id: 'haryana-police-constable-hssc', name: 'Haryana Police Constable Commando', board: 'HSSC', photoKb: 50, signKb: 20 },
  { id: 'odisha-police-constable-civil-sepoy', name: 'Odisha Police Constable & Sepoy', board: 'OPRB', photoKb: 50, signKb: 20 },
  { id: 'maharashtra-police-bharti-constable-driver', name: 'Maharashtra Police Bharti (MahaPolice)', board: 'MahaPolice', photoKb: 50, signKb: 50 },
  { id: 'wb-police-constable-wbp-lady-constable', name: 'West Bengal Police Constable (WBPRB)', board: 'WBPRB', photoKb: 50, signKb: 20 },
  { id: 'kolkata-police-constable-si', name: 'Kolkata Police Constable & SI', board: 'WBPRB', photoKb: 50, signKb: 20 },
  { id: 'punjab-police-constable-district-armed', name: 'Punjab Police Constable & SI', board: 'Punjab Police', photoKb: 50, signKb: 20 },
  { id: 'gujarat-police-lrd-constable-psi', name: 'Gujarat Police LRD Constable & PSI', board: 'LRB Gujarat', photoKb: 50, signKb: 20 },
  { id: 'jharkhand-police-constable-jcce', name: 'Jharkhand Police Constable (JCCE)', board: 'JSSC', photoKb: 50, signKb: 20 },
  { id: 'cg-police-constable-def-recruitment', name: 'Chhattisgarh CG Police Constable DEF', board: 'CG Police', photoKb: 50, signKb: 20 },
  { id: 'assam-police-constable-commando', name: 'Assam Police AB UB Constable & SI', board: 'SLPRB Assam', photoKb: 50, signKb: 20 },
  { id: 'ts-police-constable-tslprb', name: 'Telangana Police Constable (TSLPRB)', board: 'TSLPRB', photoKb: 50, signKb: 20 },
  { id: 'ap-police-constable-slprb', name: 'Andhra Pradesh Police Constable (SLPRB)', board: 'AP SLPRB', photoKb: 50, signKb: 20 },
  { id: 'karnataka-police-ksp-civil-armed-constable', name: 'Karnataka Police KSP Constable & PSI', board: 'KSP', photoKb: 50, signKb: 20 },
  { id: 'tnusrb-police-constable-jail-warder-fireman', name: 'TN Police Constable (TNUSRB)', board: 'TNUSRB', photoKb: 50, signKb: 20 },
  { id: 'kerala-police-constable-kpsc', name: 'Kerala Police Constable (Kerala PSC)', board: 'KPSC', photoKb: 30, signKb: 30 },
  { id: 'uttarakhand-police-constable-ukpsc', name: 'Uttarakhand Police Constable & PAC', board: 'UKPSC', photoKb: 50, signKb: 20 },
  { id: 'hp-police-constable-recruitment', name: 'Himachal Pradesh HP Police Constable', board: 'HP Police', photoKb: 50, signKb: 20 },

  // State PSC (Civil Services)
  { id: 'upsc-civil-services-ias-ips-prelims', name: 'UPSC Civil Services (IAS / IPS / IFS)', board: 'UPSC', photoKb: 100, signKb: 50 },
  { id: 'upsc-engineering-services-ies-ese', name: 'UPSC Engineering Services (IES/ESE)', board: 'UPSC', photoKb: 100, signKb: 50 },
  { id: 'uppsc-combined-state-upper-subordinate-pcs', name: 'UPPSC Combined State PCS Upper Subordinate', board: 'UPPSC', photoKb: 50, signKb: 20 },
  { id: 'uppsc-ro-aro-samiksha-adhikari', name: 'UPPSC RO / ARO Samiksha Adhikari', board: 'UPPSC', photoKb: 50, signKb: 20 },
  { id: 'bpsc-combined-competitive-examination-cce', name: 'BPSC Integrated 70th / 71st CCE', board: 'BPSC', photoKb: 50, signKb: 20 },
  { id: 'mppsc-state-service-prelims-mains', name: 'MPPSC State Service Examination (SSE)', board: 'MPPSC', photoKb: 50, signKb: 20 },
  { id: 'rpsc-ras-rts-combined-competitive', name: 'RPSC RAS & RTS Combined Exam', board: 'RPSC', photoKb: 50, signKb: 20 },
  { id: 'wbpsc-west-bengal-civil-service-wbcs', name: 'WBPSC West Bengal Civil Service (WBCS)', board: 'WBPSC', photoKb: 50, signKb: 20 },
  { id: 'opsc-odisha-civil-services-oas', name: 'OPSC Odisha Civil Services (OAS/OPS)', board: 'OPSC', photoKb: 50, signKb: 20 },
  { id: 'opsc-aso-assistant-section-officer', name: 'OPSC Assistant Section Officer (ASO)', board: 'OPSC', photoKb: 50, signKb: 20 },
  { id: 'mpsc-maharashtra-rajyaseva-civil-services', name: 'MPSC Rajyaseva Civil Services Group A B', board: 'MPSC', photoKb: 50, signKb: 50 },
  { id: 'tnpsc-group-1-services-prelims', name: 'TNPSC Group 1 Combined Civil Services', board: 'TNPSC', photoKb: 50, signKb: 20 },
  { id: 'tnpsc-group-2-2a-services', name: 'TNPSC Group 2 & 2A Services', board: 'TNPSC', photoKb: 50, signKb: 20 },
  { id: 'tnpsc-group-4-vao-services', name: 'TNPSC Group 4 & VAO Examination', board: 'TNPSC', photoKb: 50, signKb: 20 },
  { id: 'kpsc-kas-karnataka-administrative-services', name: 'KPSC Karnataka Administrative Services (KAS)', board: 'KPSC', photoKb: 50, signKb: 20 },
  { id: 'appsc-group-1-services', name: 'APPSC Group 1 Executive & Non-Executive', board: 'APPSC', photoKb: 50, signKb: 20 },
  { id: 'appsc-group-2-services', name: 'APPSC Group 2 Services Executive', board: 'APPSC', photoKb: 50, signKb: 20 },
  { id: 'tspsc-group-1-services', name: 'TSPSC Group 1 Services Telangana', board: 'TSPSC', photoKb: 50, signKb: 20 },
  { id: 'tspsc-group-2-services', name: 'TSPSC Group 2 Services Telangana', board: 'TSPSC', photoKb: 50, signKb: 20 },
  { id: 'tspsc-group-3-services', name: 'TSPSC Group 3 Junior Assistant / Steno', board: 'TSPSC', photoKb: 50, signKb: 20 },
  { id: 'tspsc-group-4-services', name: 'TSPSC Group 4 Junior Assistant Typist', board: 'TSPSC', photoKb: 50, signKb: 20 },
  { id: 'gpsc-gujarat-administrative-service-gas', name: 'GPSC Gujarat Administrative Service Class 1 2', board: 'GPSC', photoKb: 50, signKb: 20 },
  { id: 'ppsc-punjab-civil-services-executive', name: 'PPSC Punjab Civil Services (Executive Branch)', board: 'PPSC', photoKb: 50, signKb: 20 },
  { id: 'hpsc-haryana-civil-services-hcs', name: 'HPSC Haryana Civil Services (HCS Executive)', board: 'HPSC', photoKb: 50, signKb: 20 },
  { id: 'ukpsc-combined-state-upper-pcs', name: 'UKPSC Combined State Upper Subordinate PCS', board: 'UKPSC', photoKb: 50, signKb: 20 },
  { id: 'ukpsc-ro-aro-samiksha-adhikari', name: 'UKPSC RO / ARO High Court / Secretariat', board: 'UKPSC', photoKb: 50, signKb: 20 },
  { id: 'jpsc-combined-civil-services-examination', name: 'JPSC Combined Civil Services (Jharkhand)', board: 'JPSC', photoKb: 50, signKb: 20 },
  { id: 'cgpsc-state-services-examination', name: 'CGPSC State Service Exam (Chhattisgarh)', board: 'CGPSC', photoKb: 50, signKb: 20 },
  { id: 'apsc-combined-competitive-exam-cce', name: 'APSC Combined Competitive Exam CCE Assam', board: 'APSC', photoKb: 50, signKb: 20 },
  { id: 'jkpsc-combined-competitive-exam-cce', name: 'JKPSC Combined Competitive Exam (KAS)', board: 'JKPSC', photoKb: 50, signKb: 20 },

  // State Subordinate Selection (SSB / Vyapam / CET)
  { id: 'upsssc-pet-preliminary-eligibility-test', name: 'UPSSSC PET Preliminary Eligibility Test', board: 'UPSSSC', photoKb: 50, signKb: 20 },
  { id: 'upsssc-vdo-gram-vikas-adhikari', name: 'UPSSSC VDO Gram Vikas Adhikari', board: 'UPSSSC', photoKb: 50, signKb: 20 },
  { id: 'upsssc-lekhpal-rajasva-chakbandi', name: 'UPSSSC Rajasva & Chakbandi Lekhpal', board: 'UPSSSC', photoKb: 50, signKb: 20 },
  { id: 'upsssc-junior-assistant-clerk', name: 'UPSSSC Junior Assistant & Typist', board: 'UPSSSC', photoKb: 50, signKb: 20 },
  { id: 'upsssc-forest-guard-van-daroga', name: 'UPSSSC Forest Guard & Wildlife Guard', board: 'UPSSSC', photoKb: 50, signKb: 20 },
  { id: 'bssc-cgl-3rd-4th-graduate-level', name: 'BSSC 4th Graduate Level CGL Exam', board: 'BSSC', photoKb: 50, signKb: 20 },
  { id: 'bssc-inter-level-combined-exam', name: 'BSSC 2nd Inter Level Combined Exam (10+2)', board: 'BSSC', photoKb: 50, signKb: 20 },
  { id: 'rsmssb-cet-graduate-level-exam', name: 'RSMSSB CET Graduate Level (Rajasthan)', board: 'RSMSSB', photoKb: 50, signKb: 20 },
  { id: 'rsmssb-cet-senior-secondary-level', name: 'RSMSSB CET Senior Secondary Level (12th)', board: 'RSMSSB', photoKb: 50, signKb: 20 },
  { id: 'rsmssb-patwari-recruitment-exam', name: 'RSMSSB Patwari Revenue Exam', board: 'RSMSSB', photoKb: 50, signKb: 20 },
  { id: 'rsmssb-ldc-junior-assistant', name: 'RSMSSB LDC Clerk Grade II & Junior Assistant', board: 'RSMSSB', photoKb: 50, signKb: 20 },
  { id: 'rsmssb-animal-attendant-pashu-paricharak', name: 'RSMSSB Pashu Paricharak Animal Attendant', board: 'RSMSSB', photoKb: 50, signKb: 20 },
  { id: 'hssc-cet-group-c-mains-exam', name: 'HSSC CET Group C Recruitment', board: 'HSSC', photoKb: 50, signKb: 20 },
  { id: 'hssc-cet-group-d-recruitment', name: 'HSSC CET Group D Multi Tasking', board: 'HSSC', photoKb: 50, signKb: 20 },
  { id: 'osssc-cre-combined-recruitment-exam', name: 'OSSSC CRE Combined Recruitment (RI/Amin)', board: 'OSSSC', photoKb: 50, signKb: 20 },
  { id: 'osssc-junior-assistant-ja-peo', name: 'OSSSC Junior Assistant (JA) & PEO', board: 'OSSSC', photoKb: 50, signKb: 20 },
  { id: 'uksssc-graduate-level-vdo-vpdo', name: 'UKSSSC Graduate Level VDO VPDO', board: 'UKSSSC', photoKb: 50, signKb: 20 },
  { id: 'uksssc-intermediate-level-clerk-steno', name: 'UKSSSC Intermediate Level Junior Assistant', board: 'UKSSSC', photoKb: 50, signKb: 20 },
  { id: 'jssc-cgl-combined-graduate-standard', name: 'JSSC CGL Combined Graduate Level', board: 'JSSC', photoKb: 50, signKb: 20 },
  { id: 'jssc-excise-constable-jece', name: 'JSSC Excise Constable (JECE)', board: 'JSSC', photoKb: 50, signKb: 20 },
  { id: 'cg-vyapam-patwari-recruitment', name: 'CG Vyapam Patwari RDP Training', board: 'CG Vyapam', photoKb: 50, signKb: 20 },
  { id: 'cg-vyapam-hostel-warden-chhatrawas', name: 'CG Vyapam Hostel Warden (Chhatrawas)', board: 'CG Vyapam', photoKb: 50, signKb: 20 },
  { id: 'mp-esb-group-4-assistant-grade-3-steno', name: 'MP ESB Group 4 Assistant Grade 3 Steno', board: 'MPESB', photoKb: 50, signKb: 20 },
  { id: 'mp-esb-sub-engineer-civil-electrical', name: 'MP ESB Sub Engineer Draftsman', board: 'MPESB', photoKb: 50, signKb: 20 },
  { id: 'dsssb-special-educator-tgt-pgt-prt', name: 'DSSSB TGT PGT & Special Educator', board: 'DSSSB', photoKb: 50, signKb: 20 },
  { id: 'dsssb-dass-grade-2-4-junior-assistant', name: 'DSSSB DASS Grade II / IV & LDC', board: 'DSSSB', photoKb: 50, signKb: 20 },
  { id: 'dsssb-nursing-officer-pharmacist', name: 'DSSSB Nursing Officer & Pharmacist', board: 'DSSSB', photoKb: 50, signKb: 20 },
  { id: 'jkssb-panchayat-secretary-vlw-faa', name: 'JKSSB Panchayat Secretary & Accounts Assistant', board: 'JKSSB', photoKb: 50, signKb: 20 },

  // Teaching & TET
  { id: 'cbse-ctet-central-teacher-eligibility', name: 'CTET Central Teacher Eligibility Paper 1 & 2', board: 'CBSE', photoKb: 100, signKb: 30 },
  { id: 'bpsc-tre-teacher-recruitment-phase-4', name: 'BPSC Teacher TRE 4.0 (Primary & Secondary)', board: 'BPSC', photoKb: 50, signKb: 20 },
  { id: 'uptet-uttar-pradesh-teacher-eligibility', name: 'UPTET Primary & Upper Primary Paper', board: 'UPDELED', photoKb: 50, signKb: 20 },
  { id: 'up-super-tet-prt-assistant-teacher', name: 'UP Super TET Assistant Primary Teacher', board: 'UPDELED', photoKb: 50, signKb: 20 },
  { id: 'reet-rajasthan-eligibility-examination', name: 'REET Level 1 & Level 2 Teacher', board: 'BSER', photoKb: 50, signKb: 20 },
  { id: 'rpsc-school-lecturer-1st-grade', name: 'RPSC School Lecturer 1st Grade Teacher', board: 'RPSC', photoKb: 50, signKb: 20 },
  { id: 'rpsc-senior-teacher-2nd-grade', name: 'RPSC Senior Teacher 2nd Grade', board: 'RPSC', photoKb: 50, signKb: 20 },
  { id: 'bihar-stet-secondary-teacher-eligibility', name: 'Bihar STET Paper 1 & Paper 2', board: 'BSEB', photoKb: 50, signKb: 20 },
  { id: 'htet-haryana-teacher-eligibility-test', name: 'HTET PRT TGT PGT Eligibility', board: 'BSEH', photoKb: 50, signKb: 20 },
  { id: 'mptet-varg-1-2-3-shikshak-patrata', name: 'MPTET Varg 1 2 3 Shikshak Patrata', board: 'MPESB', photoKb: 50, signKb: 20 },
  { id: 'otet-odisha-teacher-eligibility-test', name: 'OTET & OSSTET Secondary Teacher', board: 'BSE Odisha', photoKb: 50, signKb: 20 },
  { id: 'tntet-tamil-nadu-teacher-eligibility', name: 'TNTET Tamil Nadu Teacher Paper 1 2', board: 'TRB TN', photoKb: 50, signKb: 20 },
  { id: 'ktet-kerala-teacher-eligibility-test', name: 'KTET Kerala Teacher Category 1 2 3 4', board: 'Pareeksha Bhavan', photoKb: 30, signKb: 30 },
  { id: 'mahatet-maharashtra-teacher-eligibility', name: 'MahaTET Maharashtra Teacher Paper 1 2', board: 'MSCE Pune', photoKb: 50, signKb: 50 },
  { id: 'wbtet-west-bengal-primary-tet', name: 'WB Primary TET Assistant Teacher', board: 'WBBPE', photoKb: 50, signKb: 20 },
  { id: 'kvs-prt-tgt-pgt-recruitment-exam', name: 'KVS Kendriya Vidyalaya PRT TGT PGT', board: 'KVS / NTA', photoKb: 50, signKb: 20 },
  { id: 'nvs-navodaya-vidyalaya-teacher-steno', name: 'NVS Navodaya Vidyalaya TGT PGT Staff', board: 'NVS', photoKb: 50, signKb: 20 },
  { id: 'emrs-eklavya-model-residential-school', name: 'EMRS Eklavya Model School Principal & TGT', board: 'NESTS', photoKb: 50, signKb: 20 },
  { id: 'ugc-net-junior-research-fellowship-jrf', name: 'UGC NET Assistant Professor & JRF', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'csir-ugc-net-junior-research-fellowship', name: 'CSIR UGC NET Chemical / Physical Sciences', board: 'NTA', photoKb: 200, signKb: 30 },

  // National Entrance
  { id: 'nta-neet-ug-medical-entrance', name: 'NEET UG Medical MBBS / BDS Entrance', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'nta-neet-pg-national-board-exam', name: 'NEET PG Doctor Residency Entrance', board: 'NBEMS', photoKb: 100, signKb: 30 },
  { id: 'nta-jee-main-engineering-btech', name: 'JEE Main B.Tech / B.Arch Entrance', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'iit-jee-advanced-engineering', name: 'JEE Advanced IIT Entrance Examination', board: 'IIT', photoKb: 200, signKb: 50 },
  { id: 'gate-graduate-aptitude-test-engineering', name: 'GATE Graduate Aptitude Test in Engineering', board: 'IIT', photoKb: 200, signKb: 50 },
  { id: 'nta-cuet-ug-central-university-entrance', name: 'CUET UG Central University Degree Entrance', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'nta-cuet-pg-post-graduate-entrance', name: 'CUET PG Master Degree Admission Entrance', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'aiims-norcet-nursing-officer-recruitment', name: 'AIIMS NORCET Nursing Officer Examination', board: 'AIIMS New Delhi', photoKb: 100, signKb: 50 },
  { id: 'aiims-bsc-msc-nursing-paramedical', name: 'AIIMS B.Sc & M.Sc Nursing Entrance', board: 'AIIMS New Delhi', photoKb: 100, signKb: 50 },
  { id: 'clat-common-law-admission-test-ug-pg', name: 'CLAT Common Law Admission Test (LLB/LLM)', board: 'Consortium of NLUs', photoKb: 100, signKb: 50 },
  { id: 'cat-common-admission-test-iim-mba', name: 'CAT IIM MBA Admission Examination', board: 'IIM', photoKb: 100, signKb: 50 },
  { id: 'nimcet-nit-mca-common-entrance-test', name: 'NIMCET NIT MCA Common Entrance Test', board: 'NIT', photoKb: 100, signKb: 50 },
  { id: 'nchmct-jee-hotel-management-entrance', name: 'NCHMCT JEE Hotel Management Entrance', board: 'NTA', photoKb: 200, signKb: 30 },
  { id: 'nift-national-institute-fashion-technology', name: 'NIFT B.Des M.Des Fashion Entrance Test', board: 'NTA', photoKb: 200, signKb: 30 },

  // High Courts & Judiciary
  { id: 'allahabad-high-court-ro-aro-group-c-d', name: 'Allahabad High Court RO ARO & Group C D', board: 'AHC / NTA', photoKb: 200, signKb: 30 },
  { id: 'patna-high-court-assistant-group-b-steno', name: 'Patna High Court Assistant & Stenographer', board: 'Patna HC', photoKb: 100, signKb: 20 },
  { id: 'delhi-high-court-jja-judicial-assistant', name: 'Delhi High Court Junior Judicial Assistant', board: 'Delhi HC', photoKb: 100, signKb: 20 },
  { id: 'bombay-high-court-clerk-peon-hamal', name: 'Bombay High Court Clerk & Peon', board: 'Bombay HC', photoKb: 50, signKb: 20 },
  { id: 'rajasthan-high-court-ldc-junior-assistant', name: 'Rajasthan High Court LDC & Junior Assistant', board: 'RHC Jodhpur', photoKb: 50, signKb: 20 },
  { id: 'mp-high-court-assistant-grade-3-steno', name: 'MP High Court Assistant Grade 3 & Steno', board: 'MPHC Jabalpur', photoKb: 50, signKb: 20 },
  { id: 'gujarat-high-court-assistant-peon-process', name: 'Gujarat High Court Assistant & Peon', board: 'Gujarat HC', photoKb: 50, signKb: 20 },
  { id: 'calcutta-high-court-data-entry-group-d', name: 'Calcutta High Court LDC DEO & Group D', board: 'Calcutta HC', photoKb: 50, signKb: 20 },
  { id: 'madras-high-court-examiner-reader-driver', name: 'Madras High Court Examiner Reader & Driver', board: 'Madras HC', photoKb: 50, signKb: 20 },
  { id: 'supreme-court-of-india-junior-court-assistant', name: 'Supreme Court of India (SCI) JCA Assistant', board: 'SCI New Delhi', photoKb: 50, signKb: 20 },

  // Identity & Portals
  { id: 'india-post-gds-gramin-dak-sevak', name: 'India Post GDS Gramin Dak Sevak (BPM/ABPM)', board: 'India Post', photoKb: 50, signKb: 20 },
  { id: 'sarathi-parivahan-driving-licence-ll-dl', name: 'Sarathi Parivahan Driving Licence Learning', board: 'MoRTH', photoKb: 20, signKb: 20 },
  { id: 'pan-card-nsdl-utiitsl-online-portal', name: 'PAN Card NSDL & UTIITSL (213x213 px)', board: 'NSDL / UTI', photoKb: 30, signKb: 30 },
  { id: 'uidai-aadhaar-card-update-photo-sign', name: 'UIDAI Aadhaar Update Supporting Document', board: 'UIDAI', photoKb: 200, signKb: 50 },
  { id: 'sso-rajasthan-single-sign-on-portal', name: 'SSO Rajasthan Identity Profile Update', board: 'Govt of Rajasthan', photoKb: 50, signKb: 20 },
  { id: 'samagra-id-mp-ekyc-photo-portal', name: 'MP Samagra ID eKYC Photo Resizer', board: 'Govt of MP', photoKb: 50, signKb: 20 },
  { id: 'isro-icrb-scientist-engineer-assistant', name: 'ISRO ICRB Scientist Engineer & Assistant', board: 'ISRO', photoKb: 50, signKb: 20 },
  { id: 'drdo-ceptam-senior-technical-assistant-sta', name: 'DRDO CEPTAM Tech A & STA B Assistant', board: 'DRDO', photoKb: 50, signKb: 20 },
  { id: 'barc-bhabha-atomic-research-centre-ocess', name: 'BARC Scientific Officer & Stipendiary Trainee', board: 'BARC', photoKb: 50, signKb: 20 },
  { id: 'sail-steel-authority-management-trainee', name: 'SAIL Management Trainee & OCTT Recruitment', board: 'SAIL', photoKb: 50, signKb: 20 },
  { id: 'iocl-indian-oil-apprentice-non-executive', name: 'IOCL Indian Oil Trade & Technician Apprentice', board: 'IOCL', photoKb: 50, signKb: 20 },
  { id: 'ongc-oil-and-natural-gas-graduate-trainee', name: 'ONGC Graduate Trainee Class 1 Executive', board: 'ONGC', photoKb: 50, signKb: 20 },
  { id: 'bel-bharat-electronics-probationary-engineer', name: 'BEL Probationary Engineer & Project Trainee', board: 'BEL', photoKb: 50, signKb: 20 },
  { id: 'coal-india-cil-management-trainee-mt', name: 'Coal India Management Trainee (CIL MT)', board: 'Coal India', photoKb: 50, signKb: 20 },
  { id: 'aai-airports-authority-junior-executive-atc', name: 'AAI ATC Junior Executive & Manager', board: 'AAI', photoKb: 50, signKb: 20 }
];

const autoGeneratedTools = [...GSC_DIRECT_UTILITY_TOOLS];
const examPresets = [];

ALL_EXAMS_DB.forEach((exam) => {
  examPresets.push({
    slug: exam.id,
    title: exam.name,
    board: exam.board,
    photoKb: exam.photoKb,
    signKb: exam.signKb
  });

  // 1. Passport Photo
  autoGeneratedTools.push({
    id: `${exam.id}-passport-size-photo-resizer`,
    slug: `/exam/${exam.id}-passport-size-photo-resizer`,
    name: `${exam.name} Passport Size Photo Resizer`,
    description: `Official passport photo resizer for ${exam.name} (${exam.board}). Format strictly between 20 KB to ${exam.photoKb} KB with sharp facial clarity.`,
    category: 'photo',
    badge: exam.board,
    targetKB: exam.photoKb,
    dimensions: '350 × 450 px',
    isPopular: false
  });

  // 2. Signature
  autoGeneratedTools.push({
    id: `${exam.id}-signature-crop-compress`,
    slug: `/exam/${exam.id}-signature-crop-compress`,
    name: `${exam.name} Signature Crop & Compress`,
    description: `Crop and compress candidate signature strictly under ${exam.signKb} KB for ${exam.name} with clean white background and high contrast.`,
    category: 'signature',
    badge: 'SIGN',
    targetKB: exam.signKb,
    dimensions: '280 × 120 px',
    isPopular: false
  });

  // 3. Thumb / Declaration
  const isBank = exam.id.includes('ibps') || exam.id.includes('sbi') || exam.id.includes('rbi');
  autoGeneratedTools.push({
    id: isBank ? `${exam.id}-handwritten-declaration-resizer` : `${exam.id}-left-thumb-impression-resizer`,
    slug: `/exam/${isBank ? `${exam.id}-handwritten-declaration-resizer` : `${exam.id}-left-thumb-impression-resizer`}`,
    name: isBank ? `${exam.name} Handwritten Declaration Resizer (50-100 KB)` : `${exam.name} Left Thumb Impression Resizer`,
    description: isBank
      ? `Compress official handwritten declaration text image between 50 KB to 100 KB for ${exam.name}.`
      : `Resize blue/black ink candidate left thumb impression photo under 20 KB for ${exam.name}.`,
    category: isBank ? 'photo' : 'signature',
    badge: isBank ? 'DECLARATION' : 'THUMB',
    targetKB: isBank ? 100 : 20,
    dimensions: isBank ? '800 × 400 px' : '240 × 240 px',
    isPopular: false
  });

  // 4. Postcard / Certificate PDF
  const isPostcard = exam.id.includes('neet') || exam.id.includes('army') || exam.id.includes('navy') || exam.id.includes('air-force') || exam.id.includes('iaf');
  autoGeneratedTools.push({
    id: isPostcard ? `${exam.id}-postcard-size-photo-4x6-resizer` : `${exam.id}-certificate-pdf-compressor`,
    slug: `/exam/${isPostcard ? `${exam.id}-postcard-size-photo-4x6-resizer` : `${exam.id}-certificate-pdf-compressor`}`,
    name: isPostcard ? `${exam.name} Postcard Size Photo (4x6) Resizer` : `${exam.name} Marksheet & Caste Certificate PDF (< 200 KB)`,
    description: isPostcard
      ? `Format 4x6 inch postcard photograph strictly between 10 KB to 200 KB for ${exam.name}.`
      : `Compress category certificate, 10th marksheet, and domicile PDF strictly under 200 KB for ${exam.name}.`,
    category: isPostcard ? 'photo' : 'pdf',
    badge: isPostcard ? '< 200 KB' : 'PDF',
    targetKB: 200,
    dimensions: isPostcard ? '480 × 720 px' : 'A4 Document',
    isPopular: false
  });
});

fs.writeFileSync(path.join(__dirname, '../data/exam-presets.json'), JSON.stringify(examPresets, null, 2), 'utf-8');
fs.writeFileSync(path.join(__dirname, '../lib/autoGeneratedTools.json'), JSON.stringify(autoGeneratedTools, null, 2), 'utf-8');

console.log(`🚀 Formilo Engine: Generated ${autoGeneratedTools.length} tools across ${examPresets.length} exams & GSC keyword clusters!`);
