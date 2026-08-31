export interface ExamItem {
  id: string;
  title: string;
  board: string;
  category: string;
  description: string;
}

export const examsData: ExamItem[] = [
  // SSC Exams
  { id: 'ssc-cgl', title: 'SSC CGL', board: 'Staff Selection Commission', category: 'ssc', description: 'Staff Selection Commission Combined Graduate Level examination.' },
  { id: 'ssc-chsl', title: 'SSC CHSL', board: 'Staff Selection Commission', category: 'ssc', description: 'Combined Higher Secondary Level examination.' },
  { id: 'ssc-gd', title: 'SSC GD Constable', board: 'Staff Selection Commission', category: 'ssc', description: 'General Duty Constable recruitment.' },
  { id: 'ssc-mts', title: 'SSC MTS', board: 'Staff Selection Commission', category: 'ssc', description: 'Multi-Tasking (Non-Technical) Staff examination.' },
  { id: 'ssc-cpo', title: 'SSC CPO / SI', board: 'Staff Selection Commission', category: 'ssc', description: 'Central Police Organization Sub-Inspector examination.' },
  { id: 'ssc-stenographer', title: 'SSC Stenographer', board: 'Staff Selection Commission', category: 'ssc', description: 'Stenographer Grade C and D examination.' },
  { id: 'ssc-selection-post', title: 'SSC Selection Post Phase XII', board: 'Staff Selection Commission', category: 'ssc', description: 'Selection Post Phase examination.' },

  // Railway Recruitment Board
  { id: 'rrb-ntpc', title: 'Railway RRB NTPC', board: 'Railway Recruitment Board', category: 'railway', description: 'Non-Technical Popular Categories recruitment.' },
  { id: 'rrb-group-d', title: 'Railway Group D', board: 'Railway Recruitment Board', category: 'railway', description: 'Railway Level 1 Posts recruitment.' },
  { id: 'rrb-alp', title: 'Railway RRB ALP', board: 'Railway Recruitment Board', category: 'railway', description: 'Assistant Loco Pilot recruitment.' },
  { id: 'rrb-technician', title: 'Railway Technician', board: 'Railway Recruitment Board', category: 'railway', description: 'Railway Technician Grade I and III.' },
  { id: 'rpf-constable', title: 'RPF Constable', board: 'Railway Protection Force', category: 'railway', description: 'Railway Police Force Constable recruitment.' },
  { id: 'rpf-si', title: 'RPF Sub Inspector', board: 'Railway Protection Force', category: 'railway', description: 'Railway Police Force Sub-Inspector.' },

  // Banking & Financial
  { id: 'sbi-po', title: 'SBI PO', board: 'State Bank of India', category: 'banking', description: 'State Bank of India Probationary Officer recruitment.' },
  { id: 'sbi-clerk', title: 'SBI Clerk (Junior Associate)', board: 'State Bank of India', category: 'banking', description: 'SBI Junior Associate recruitment.' },
  { id: 'ibps-po', title: 'IBPS PO CRP', board: 'Institute of Banking Personnel Selection', category: 'banking', description: 'Probationary Officer CRP recruitment.' },
  { id: 'ibps-clerk', title: 'IBPS Clerk CRP', board: 'Institute of Banking Personnel Selection', category: 'banking', description: 'Clerical Cadre examination.' },
  { id: 'ibps-rrb-po', title: 'IBPS RRB Officer Scale I', board: 'IBPS', category: 'banking', description: 'Regional Rural Banks Officer recruitment.' },
  { id: 'ibps-rrb-clerk', title: 'IBPS RRB Office Assistant', board: 'IBPS', category: 'banking', description: 'Regional Rural Banks Office Assistant.' },
  { id: 'rbi-grade-b', title: 'RBI Grade B Officer', board: 'Reserve Bank of India', category: 'banking', description: 'Reserve Bank of India Officers in Grade B.' },
  { id: 'rbi-assistant', title: 'RBI Assistant', board: 'Reserve Bank of India', category: 'banking', description: 'Reserve Bank of India Assistant recruitment.' },

  // National Testing Agency & Entrance
  { id: 'nta-neet-ug', title: 'NTA NEET UG', board: 'National Testing Agency', category: 'entrance', description: 'National Eligibility cum Entrance Test for Undergraduate Medical.' },
  { id: 'nta-jee-main', title: 'NTA JEE Main', board: 'National Testing Agency', category: 'entrance', description: 'Joint Entrance Examination Main.' },
  { id: 'nta-cuet-ug', title: 'CUET UG', board: 'National Testing Agency', category: 'entrance', description: 'Common University Entrance Test Undergraduate.' },
  { id: 'nta-ugc-net', title: 'UGC NET JRF', board: 'National Testing Agency', category: 'entrance', description: 'University Grants Commission National Eligibility Test.' },

  // UPSC & Defence
  { id: 'upsc-civil-services', title: 'UPSC Civil Services (IAS/IPS)', board: 'Union Public Service Commission', category: 'upsc', description: 'Civil Services Examination.' },
  { id: 'upsc-nda', title: 'UPSC NDA & NA', board: 'Union Public Service Commission', category: 'defence', description: 'National Defence Academy & Naval Academy.' },
  { id: 'upsc-cds', title: 'UPSC Combined Defence Services (CDS)', board: 'Union Public Service Commission', category: 'defence', description: 'Combined Defence Services Examination.' },
  { id: 'agniveer-army', title: 'Indian Army Agniveer', board: 'Indian Army', category: 'defence', description: 'Indian Army Agniveer General Duty & Technical.' },
  { id: 'agniveer-navy', title: 'Indian Navy Agniveer SSR / MR', board: 'Indian Navy', category: 'defence', description: 'Indian Navy Agniveer recruitment.' },
  { id: 'agniveer-airforce', title: 'Indian Air Force Agniveer Vayu', board: 'Indian Air Force', category: 'defence', description: 'Indian Air Force Vayu intake.' },

  // Police & State Recruitments
  { id: 'odisha-police-constable', title: 'Odisha Police Constable', board: 'State Selection Board Odisha Police', category: 'police', description: 'Odisha Police Constable recruitment.' },
  { id: 'odisha-police-si', title: 'Odisha Police Sub Inspector', board: 'OPRB', category: 'police', description: 'Odisha Police SI recruitment.' },
  { id: 'up-police-constable', title: 'UP Police Constable', board: 'UPPRPB', category: 'police', description: 'Uttar Pradesh Police Constable recruitment.' },
  { id: 'up-police-si', title: 'UP Police Sub Inspector', board: 'UPPRPB', category: 'police', description: 'Uttar Pradesh Police Sub Inspector.' },
  { id: 'bihar-police-constable', title: 'Bihar Police Constable', board: 'CSBC Bihar', category: 'police', description: 'Central Selection Board of Constable Bihar.' },
  { id: 'bihar-daroga-si', title: 'Bihar Police Daroga (BPSSC)', board: 'BPSSC Bihar', category: 'police', description: 'Bihar Police Subordinate Services Commission SI.' },
  { id: 'maharashtra-police-bharti', title: 'Maharashtra Police Bharti', board: 'Maharashtra Police Recruitment Board', category: 'police', description: 'Maharashtra Police Constable Bharti.' },
  { id: 'telangana-ts-police-constable', title: 'TS Police Constable', board: 'TSLPRB', category: 'police', description: 'Telangana State Level Police Recruitment Board Constable.' },
  { id: 'ap-police-constable', title: 'AP Police Constable', board: 'SLPRB Andhra Pradesh', category: 'police', description: 'Andhra Pradesh State Level Police Recruitment Board.' },
  { id: 'delhi-police-constable', title: 'Delhi Police Constable', board: 'SSC / Delhi Police', category: 'police', description: 'Delhi Police Executive Constable examination.' },

  // State PSC & Others
  { id: 'bpsc-civil-services', title: 'BPSC Combined Competitive Exam', board: 'Bihar Public Service Commission', category: 'state-psc', description: 'BPSC Civil Services Prelims and Mains.' },
  { id: 'uppsc-pcs', title: 'UPPSC Combined State Upper Subordinate', board: 'Uttar Pradesh PSC', category: 'state-psc', description: 'UPPSC PCS examination.' },
  { id: 'mppsc-state-service', title: 'MPPSC State Service Exam', board: 'Madhya Pradesh PSC', category: 'state-psc', description: 'Madhya Pradesh State Service Examination.' },
  { id: 'ras-rpsc', title: 'RPSC RAS / RTS', board: 'Rajasthan Public Service Commission', category: 'state-psc', description: 'Rajasthan Administrative Service.' },
  { id: 'wbcs-wbpsc', title: 'WBCS Executive', board: 'West Bengal PSC', category: 'state-psc', description: 'West Bengal Civil Service Executive.' },

  // Utility & National Identity Portals
  { id: 'pan-card', title: 'PAN Card Photo & Sign', board: 'Income Tax Department (NSDL / UTIITSL)', category: 'identity', description: 'NSDL & UTIITSL PAN Card 213x213 px photo and 400x200 px signature.' },
  { id: 'nielit-ccc', title: 'NIELIT CCC / O Level', board: 'National Institute of Electronics & Information Technology', category: 'certification', description: 'NIELIT CCC exam photo, signature and left thumb impression.' },
  { id: 'gate-exam', title: 'GATE Examination', board: 'IIT / IISc', category: 'entrance', description: 'Graduate Aptitude Test in Engineering.' },
  { id: 'cat-exam', title: 'IIM CAT Examination', board: 'Indian Institutes of Management', category: 'entrance', description: 'Common Admission Test for MBA.' },
  { id: 'ctet-exam', title: 'CBSE CTET Exam', board: 'Central Board of Secondary Education', category: 'teaching', description: 'Central Teacher Eligibility Test.' }
];
