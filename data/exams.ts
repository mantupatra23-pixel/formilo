export interface ExamItem {
  id: string;
  title: string;
  board: string;
  category: string;
  description: string;
  hasThumb?: boolean;
  hasPostcard?: boolean;
  hasDeclaration?: boolean;
}

export const examsData: ExamItem[] = [
  // SSC (Staff Selection Commission)
  { id: 'ssc-cgl', title: 'SSC CGL', board: 'Staff Selection Commission', category: 'ssc', description: 'Combined Graduate Level Examination.', hasThumb: true },
  { id: 'ssc-chsl', title: 'SSC CHSL', board: 'Staff Selection Commission', category: 'ssc', description: 'Combined Higher Secondary Level 10+2 Examination.', hasThumb: true },
  { id: 'ssc-gd', title: 'SSC GD Constable', board: 'Staff Selection Commission', category: 'ssc', description: 'General Duty Constable in CAPFs & Assam Rifles.', hasThumb: true },
  { id: 'ssc-mts', title: 'SSC MTS & Havaldar', board: 'Staff Selection Commission', category: 'ssc', description: 'Multi Tasking Non-Technical Staff Recruitment.', hasThumb: true },
  { id: 'ssc-cpo', title: 'SSC CPO Sub-Inspector', board: 'Staff Selection Commission', category: 'ssc', description: 'SI in Delhi Police & Central Armed Police Forces.', hasThumb: true },
  { id: 'ssc-stenographer', title: 'SSC Stenographer Grade C & D', board: 'Staff Selection Commission', category: 'ssc', description: 'Stenographer Grade C and D Examination.', hasThumb: true },
  { id: 'ssc-selection-post', title: 'SSC Selection Post Phase XII', board: 'Staff Selection Commission', category: 'ssc', description: 'Selection Post Matric, Inter & Graduate Levels.', hasThumb: true },
  { id: 'ssc-je', title: 'SSC Junior Engineer (JE)', board: 'Staff Selection Commission', category: 'ssc', description: 'Junior Engineer Civil, Electrical & Mechanical.', hasThumb: true },
  { id: 'ssc-jht', title: 'SSC Junior Hindi Translator', board: 'Staff Selection Commission', category: 'ssc', description: 'Junior Hindi Translator and Senior Hindi Translator.', hasThumb: true },

  // Railway Recruitment Board (RRB & RRC)
  { id: 'rrb-ntpc', title: 'Railway RRB NTPC Graduate', board: 'Railway Recruitment Board', category: 'railway', description: 'Non-Technical Popular Categories Graduate Recruitment.' },
  { id: 'rrb-ntpc-ug', title: 'Railway RRB NTPC Under Graduate', board: 'Railway Recruitment Board', category: 'railway', description: 'Non-Technical Popular Categories 12th Pass Posts.' },
  { id: 'rrb-group-d', title: 'Railway RRC Group D (Level 1)', board: 'Railway Recruitment Cell', category: 'railway', description: 'Track Maintainer, Pointsman & Level 1 Posts.' },
  { id: 'rrb-alp', title: 'Railway RRB ALP', board: 'Railway Recruitment Board', category: 'railway', description: 'Assistant Loco Pilot Technical Recruitment.' },
  { id: 'rrb-technician-1', title: 'Railway Technician Grade I Signal', board: 'Railway Recruitment Board', category: 'railway', description: 'Technician Grade 1 Signal Recruitment.' },
  { id: 'rrb-technician-3', title: 'Railway Technician Grade III', board: 'Railway Recruitment Board', category: 'railway', description: 'Technician Grade 3 Workshop and Locomotive Posts.' },
  { id: 'rrb-je', title: 'Railway RRB Junior Engineer', board: 'Railway Recruitment Board', category: 'railway', description: 'Junior Engineer, Depot Material Superintendent (DMS).' },
  { id: 'rpf-constable', title: 'Railway RPF Constable', board: 'Railway Protection Force', category: 'railway', description: 'Railway Protection Force Constable Recruitment.' },
  { id: 'rpf-si', title: 'Railway RPF Sub-Inspector', board: 'Railway Protection Force', category: 'railway', description: 'Railway Protection Force Executive Sub-Inspector.' },
  { id: 'rrb-paramedical', title: 'Railway Paramedical Staff', board: 'Railway Recruitment Board', category: 'railway', description: 'Staff Nurse, Pharmacist & Lab Technician Posts.' },

  // Banking & Insurance (IBPS, SBI, RBI, NABARD, LIC)
  { id: 'sbi-po', title: 'SBI PO (Probationary Officer)', board: 'State Bank of India', category: 'banking', description: 'State Bank of India Probationary Officer Recruitment.', hasDeclaration: true },
  { id: 'sbi-clerk', title: 'SBI Clerk (Junior Associate)', board: 'State Bank of India', category: 'banking', description: 'Customer Support and Sales Junior Associates.', hasDeclaration: true },
  { id: 'sbi-cbo', title: 'SBI Circle Based Officer (CBO)', board: 'State Bank of India', category: 'banking', description: 'Circle Based Officer Scale II Recruitment.', hasDeclaration: true },
  { id: 'ibps-po', title: 'IBPS PO / MT CRP', board: 'IBPS', category: 'banking', description: 'Common Recruitment Process for Probationary Officers.', hasDeclaration: true },
  { id: 'ibps-clerk', title: 'IBPS Clerk CRP', board: 'IBPS', category: 'banking', description: 'Common Recruitment Process for Clerical Cadre.', hasDeclaration: true },
  { id: 'ibps-so', title: 'IBPS Specialist Officer (SO)', board: 'IBPS', category: 'banking', description: 'IT, Agriculture, Law, HR & Rajbhasha Officers.', hasDeclaration: true },
  { id: 'ibps-rrb-po', title: 'IBPS RRB Officer Scale I (PO)', board: 'IBPS', category: 'banking', description: 'Regional Rural Banks Assistant Manager Recruitment.', hasDeclaration: true },
  { id: 'ibps-rrb-clerk', title: 'IBPS RRB Office Assistant (Multipurpose)', board: 'IBPS', category: 'banking', description: 'Regional Rural Banks Clerk Recruitment.', hasDeclaration: true },
  { id: 'rbi-grade-b', title: 'RBI Grade B Officer', board: 'Reserve Bank of India', category: 'banking', description: 'Officers in Grade B General, DEPR and DSIM.', hasDeclaration: true },
  { id: 'rbi-assistant', title: 'RBI Assistant', board: 'Reserve Bank of India', category: 'banking', description: 'Reserve Bank of India Assistant Recruitment.', hasDeclaration: true },
  { id: 'lic-aao', title: 'LIC AAO (Assistant Administrative Officer)', board: 'Life Insurance Corporation', category: 'banking', description: 'Generalist Assistant Administrative Officers.' },
  { id: 'lic-ado', title: 'LIC ADO (Apprentice Development Officer)', board: 'Life Insurance Corporation', category: 'banking', description: 'Apprentice Development Officer Recruitment.' },
  { id: 'nabard-grade-a', title: 'NABARD Grade A Assistant Manager', board: 'NABARD', category: 'banking', description: 'Rural Development Banking Service Assistant Manager.' },
  { id: 'idbi-executive', title: 'IDBI Bank Executive (ESO)', board: 'IDBI Bank', category: 'banking', description: 'Executive Sales and Operations Recruitment.' },

  // NTA & National Entrance Exams
  { id: 'nta-neet-ug', title: 'NTA NEET UG', board: 'National Testing Agency', category: 'entrance', description: 'National Eligibility cum Entrance Test Undergraduate.', hasPostcard: true },
  { id: 'nta-jee-main', title: 'NTA JEE Main', board: 'National Testing Agency', category: 'entrance', description: 'Joint Entrance Examination Engineering.' },
  { id: 'nta-jee-advanced', title: 'IIT JEE Advanced', board: 'National NTA / IIT', category: 'entrance', description: 'Joint Entrance Examination for IIT Admissions.' },
  { id: 'nta-cuet-ug', title: 'NTA CUET UG', board: 'National Testing Agency', category: 'entrance', description: 'Common University Entrance Test Undergraduate.' },
  { id: 'nta-cuet-pg', title: 'NTA CUET PG', board: 'National Testing Agency', category: 'entrance', description: 'Common University Entrance Test Postgraduate.' },
  { id: 'nta-ugc-net', title: 'NTA UGC NET JRF', board: 'National Testing Agency', category: 'entrance', description: 'Assistant Professor and Junior Research Fellowship.' },
  { id: 'nta-csir-net', title: 'CSIR UGC NET', board: 'National Testing Agency', category: 'entrance', description: 'Joint CSIR UGC NET for Chemical, Physical & Life Sciences.' },
  { id: 'gate-exam', title: 'GATE Examination', board: 'IIT / IISc Bangalore', category: 'entrance', description: 'Graduate Aptitude Test in Engineering.' },
  { id: 'cat-exam', title: 'IIM CAT Examination', board: 'Indian Institutes of Management', category: 'entrance', description: 'Common Admission Test for MBA & PGDM Admissions.' },

  // UPSC & Defence Recruitment
  { id: 'upsc-civil-services', title: 'UPSC Civil Services (IAS/IPS)', board: 'Union Public Service Commission', category: 'upsc', description: 'Civil Services Prelims & Mains Examination.' },
  { id: 'upsc-nda', title: 'UPSC NDA & NA', board: 'Union Public Service Commission', category: 'defence', description: 'National Defence Academy & Naval Academy.' },
  { id: 'upsc-cds', title: 'UPSC CDS (Combined Defence Services)', board: 'Union Public Service Commission', category: 'defence', description: 'Combined Defence Services Examination for IMA, OTA, INA.' },
  { id: 'upsc-capf', title: 'UPSC CAPF Assistant Commandant (AC)', board: 'Union Public Service Commission', category: 'defence', description: 'Central Armed Police Forces Assistant Commandant.' },
  { id: 'upsc-epfo', title: 'UPSC EPFO (EO/AO/APFC)', board: 'Union Public Service Commission', category: 'upsc', description: 'Enforcement Officer & Accounts Officer in EPFO.' },
  { id: 'agniveer-army', title: 'Indian Army Agniveer GD & Tech', board: 'Indian Army', category: 'defence', description: 'Agniveer General Duty, Technical & Tradesmen.' },
  { id: 'agniveer-navy', title: 'Indian Navy Agniveer SSR & MR', board: 'Indian Navy', category: 'defence', description: 'Senior Secondary Recruit & Matric Recruit.' },
  { id: 'agniveer-airforce', title: 'Indian Air Force Agniveer Vayu', board: 'Indian Air Force', category: 'defence', description: 'Agniveer Vayu Science & Non-Science Subjects.' },
  { id: 'afcat-exam', title: 'IAF AFCAT Flying & Ground Duty', board: 'Indian Air Force', category: 'defence', description: 'Air Force Common Admission Test for Officers.' },
  { id: 'coast-guard-navik', title: 'Indian Coast Guard Navik (GD/DB)', board: 'Indian Coast Guard', category: 'defence', description: 'Coast Guard Navik General Duty & Domestic Branch.' },

  // State Police Recruitment Boards
  { id: 'odisha-police-constable', title: 'Odisha Police Constable', board: 'State Selection Board Odisha', category: 'police', description: 'Sepoy & Constable in Odisha Police Battalions.' },
  { id: 'odisha-police-si', title: 'Odisha Police Sub-Inspector', board: 'Odisha Police Recruitment Board', category: 'police', description: 'Sub-Inspector in Odisha Police Executive Cadre.' },
  { id: 'up-police-constable', title: 'UP Police Constable (Civil/PAC)', board: 'UPPRPB Lucknow', category: 'police', description: 'Civil Police Constable, PAC & Fireman Posts.' },
  { id: 'up-police-si', title: 'UP Police Sub Inspector (Daroga)', board: 'UPPRPB Lucknow', category: 'police', description: 'Sub Inspector Confidential & Platoon Commander.' },
  { id: 'bihar-police-constable', title: 'Bihar Police Constable (CSBC)', board: 'CSBC Bihar', category: 'police', description: 'Central Selection Board of Constable Bihar.' },
  { id: 'bihar-daroga-si', title: 'Bihar Police Daroga SI (BPSSC)', board: 'BPSSC Bihar', category: 'police', description: 'Sub Inspector & Sergeant in Bihar Police.' },
  { id: 'maharashtra-police-bharti', title: 'Maharashtra Police Constable Bharti', board: 'Maharashtra Police Board', category: 'police', description: 'Maharashtra Police Shipai & Driver Recruitment.' },
  { id: 'ts-police-constable', title: 'Telangana TS Police Constable', board: 'TSLPRB Hyderabad', category: 'police', description: 'Stipendiary Cadet Trainee (SCT) PC Civil/AR.' },
  { id: 'ts-police-si', title: 'Telangana TS Police SI', board: 'TSLPRB Hyderabad', category: 'police', description: 'Stipendiary Cadet Trainee Sub Inspector of Police.' },
  { id: 'ap-police-constable', title: 'Andhra Pradesh AP Police Constable', board: 'SLPRB Andhra Pradesh', category: 'police', description: 'Stipendiary Cadet Trainee PC Civil & APSP.' },
  { id: 'ap-police-si', title: 'Andhra Pradesh AP Police SI', board: 'SLPRB Andhra Pradesh', category: 'police', description: 'SCT Sub Inspector of Police Civil & AR.' },
  { id: 'delhi-police-constable', title: 'Delhi Police Executive Constable', board: 'SSC / Delhi Police', category: 'police', description: 'Constable Executive Male & Female in Delhi Police.' },
  { id: 'delhi-police-head-constable', title: 'Delhi Police Head Constable (AWO/TPO)', board: 'SSC / Delhi Police', category: 'police', description: 'Head Constable Assistant Wireless Operator.' },
  { id: 'rajasthan-police-constable', title: 'Rajasthan Police Constable', board: 'Rajasthan Police HQ', category: 'police', description: 'General Duty, Driver & Band Constable.' },
  { id: 'mp-police-constable', title: 'MP Police Constable (ESB)', board: 'MPESB Bhopal', category: 'police', description: 'Constable GD & Special Armed Force.' },
  { id: 'haryana-police-constable', title: 'Haryana Police Constable (HSSC)', board: 'HSSC Panchkula', category: 'police', description: 'Male & Female Police Constable General Duty.' },
  { id: 'punjab-police-constable', title: 'Punjab Police District & Armed Cadet', board: 'Punjab Police Board', category: 'police', description: 'District Police and Armed Police Constable.' },
  { id: 'wb-police-constable', title: 'West Bengal Police Constable (PRB)', board: 'WBPRB Kolkata', category: 'police', description: 'Constable & Lady Constable in West Bengal Police.' },
  { id: 'karnataka-police-constable', title: 'Karnataka KSP Police Constable', board: 'Karnataka State Police', category: 'police', description: 'Civil & Armed Police Constable Recruitment.' },

  // State Public Service Commissions (PSC)
  { id: 'bpsc-cce', title: 'BPSC Combined Competitive Exam (CCE)', board: 'Bihar Public Service Commission', category: 'state-psc', description: 'Administrative, Police & Revenue Officers.' },
  { id: 'bpsc-tre', title: 'BPSC Teacher Recruitment (TRE)', board: 'Bihar Public Service Commission', category: 'teaching', description: 'Primary, Middle & Secondary School Teachers.' },
  { id: 'uppsc-pcs', title: 'UPPSC Combined State Upper Subordinate', board: 'Uttar Pradesh PSC', category: 'state-psc', description: 'SDM, DSP, BDO & State Executive Officers.' },
  { id: 'uppsc-ro-aro', title: 'UPPSC Review Officer (RO / ARO)', board: 'Uttar Pradesh PSC', category: 'state-psc', description: 'Samiksha Adhikari and Sahayak Samiksha Adhikari.' },
  { id: 'mppsc-state-services', title: 'MPPSC State Service Exam (SSE)', board: 'Madhya Pradesh PSC', category: 'state-psc', description: 'Deputy Collector, DSP & Commercial Tax Officers.' },
  { id: 'rpsc-ras', title: 'RPSC RAS / RTS Combined Competitive', board: 'Rajasthan PSC', category: 'state-psc', description: 'Rajasthan Administrative & Police Service.' },
  { id: 'wbcs-executive', title: 'WBCS Executive (West Bengal Civil Service)', board: 'WBPSC Kolkata', category: 'state-psc', description: 'Group A, B, C & D Executive Services.' },
  { id: 'opsc-oasis', title: 'OPSC Odisha Civil Services (OCS)', board: 'Odisha Public Service Commission', category: 'state-psc', description: 'OAS, OPS, OFS & Odisha Revenue Services.' },
  { id: 'tspsc-group-1', title: 'TSPSC Group 1 Services', board: 'Telangana State PSC', category: 'state-psc', description: 'Deputy Collector, DSP & Commercial Tax Officers.' },
  { id: 'tspsc-group-2', title: 'TSPSC Group 2 Services', board: 'Telangana State PSC', category: 'state-psc', description: 'Municipal Commissioner, Sub Registrar & ACTO.' },
  { id: 'appsc-group-1', title: 'APPSC Group 1 Services', board: 'Andhra Pradesh PSC', category: 'state-psc', description: 'Deputy Collector, DSP & Commercial Tax Officers.' },
  { id: 'appsc-group-2', title: 'APPSC Group 2 Services', board: 'Andhra Pradesh PSC', category: 'state-psc', description: 'Executive and Non-Executive Posts.' },
  { id: 'kpsc-kas', title: 'KPSC KAS (Gazetted Probationers)', board: 'Karnataka PSC', category: 'state-psc', description: 'Assistant Commissioner, DySP & Tahsildar.' },
  { id: 'gpsc-class-1-2', title: 'GPSC Gujarat Administrative Service', board: 'Gujarat Public Service Commission', category: 'state-psc', description: 'GAS Class 1 and GPS Class 2 Officers.' },
  { id: 'ukpsc-pcs', title: 'UKPSC Uttarakhand Combined State Civil', board: 'Uttarakhand PSC', category: 'state-psc', description: 'State Civil and Upper Subordinate Examination.' },
  { id: 'jpsc-cce', title: 'JPSC Combined Civil Services', board: 'Jharkhand PSC', category: 'state-psc', description: 'Jharkhand Administrative and Police Service.' },
  { id: 'cgpsc-sse', title: 'CGPSC State Service Examination', board: 'Chhattisgarh PSC', category: 'state-psc', description: 'Deputy Collector, DSP and State Accounts Officers.' },

  // State Subordinate Selection Boards (SSSC / OSSSC / HSSC / RSMSSB)
  { id: 'upsssc-pet', title: 'UPSSSC PET Preliminary Eligibility Test', board: 'UPSSSC Lucknow', category: 'state-ssc', description: 'Mandatory Screening Test for UP Group C Posts.' },
  { id: 'upsssc-vdo', title: 'UPSSSC Gram Vikas Adhikari (VDO)', board: 'UPSSSC Lucknow', category: 'state-ssc', description: 'Village Development Officer & Panchayat Secretary.' },
  { id: 'upsssc-lekhpal', title: 'UPSSSC Rajaswa Lekhpal', board: 'UPSSSC Lucknow', category: 'state-ssc', description: 'Revenue Lekhpal in UP Board of Revenue.' },
  { id: 'osssc-cre', title: 'OSSSC Combined Recruitment (RI/ARI/AMIN)', board: 'OSSSC Bhubaneswar', category: 'state-ssc', description: 'Revenue Inspector, Assistant RI, AMIN & ICDS.' },
  { id: 'ossc-cgl', title: 'OSSC Combined Graduate Level (CGL)', board: 'OSSC Bhubaneswar', category: 'state-ssc', description: 'Auditor, Inspector of Supplies & Junior Fisheries.' },
  { id: 'rsmssb-cet-graduate', title: 'RSMSSB CET Graduate Level', board: 'RSMSSB Jaipur', category: 'state-ssc', description: 'Common Eligibility Test for Rajasthan Graduate Posts.' },
  { id: 'rsmssb-cet-12th', title: 'RSMSSB CET Senior Secondary (12th)', board: 'RSMSSB Jaipur', category: 'state-ssc', description: 'Common Eligibility Test for Rajasthan 12th Level Posts.' },
  { id: 'rsmssb-patwari', title: 'RSMSSB Patwari Recruitment', board: 'RSMSSB Jaipur', category: 'state-ssc', description: 'Rajasthan Revenue Board Patwari Posts.' },
  { id: 'hssc-cet-group-c', title: 'HSSC CET Group C Recruitment', board: 'HSSC Panchkula', category: 'state-ssc', description: 'Haryana Staff Selection Common Eligibility Test.' },
  { id: 'hssc-cet-group-d', title: 'HSSC CET Group D Recruitment', board: 'HSSC Panchkula', category: 'state-ssc', description: 'Haryana Group D Multi Tasking Staff.' },
  { id: 'bssc-cgl', title: 'BSSC 3rd / 4th Graduate Level (CGL)', board: 'BSSC Patna', category: 'state-ssc', description: 'Secretariat Assistant & Planning Assistant.' },
  { id: 'bssc-inter-level', title: 'BSSC 2nd Inter Level Combined Exam', board: 'BSSC Patna', category: 'state-ssc', description: 'Revenue Employee, Panchayat Secretary & LDC.' },
  { id: 'mssc-talathi', title: 'Maharashtra Talathi Bharti', board: 'Revenue Department Maharashtra', category: 'state-ssc', description: 'Revenue Department Talathi Examination.' },
  { id: 'dsssb-tgt-pgt', title: 'DSSSB TGT / PGT & Non-Teaching', board: 'DSSSB Delhi', category: 'teaching', description: 'Delhi Subordinate Services Selection Board.' },

  // National Identity & Statutory Services
  { id: 'pan-card', title: 'PAN Card Photo & Signature', board: 'Income Tax Department (NSDL/UTIITSL)', category: 'identity', description: '213x213 px photo and 400x200 px signature for Instant/Normal PAN.' },
  { id: 'nielit-ccc', title: 'NIELIT CCC & O Level Certificate', board: 'NIELIT New Delhi', category: 'certification', description: '132x170 px photo, 170x132 px signature and Left Thumb Impression.' },
  { id: 'ctet-exam', title: 'CBSE CTET Central Teacher Eligibility', board: 'CBSE New Delhi', category: 'teaching', description: 'Central Teacher Eligibility Test Paper I and Paper II.' },
  { id: 'dsssb-prt', title: 'DSSSB Assistant Teacher (Primary PRT)', board: 'DSSSB Delhi', category: 'teaching', description: 'Assistant Teacher Nursery and Primary Posts.' },
];
