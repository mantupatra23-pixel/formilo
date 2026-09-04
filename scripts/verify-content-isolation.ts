// scripts/verify-content-isolation.ts

import { resolveToolConfig } from '../lib/registryResolver';
import { MASTER_TOOL_REGISTRY } from '../data/masterRegistry';

interface TestCase {
  slug: string;
  expectedAuthority: string;
  expectedToolType: string;
  expectedDimensions: string;
  forbiddenStrings: string[];
}

const TEST_CASES: TestCase[] = [
  {
    slug: 'exam/ts-police-constable-tslprb-passport-size-photo-resizer',
    expectedAuthority: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    expectedToolType: 'PHOTO_RESIZER',
    expectedDimensions: '350 × 450 px',
    forbiddenStrings: ['RBI', 'Reserve Bank of India', '200 × 230', '140 × 60'],
  },
  {
    slug: 'exam/ts-police-constable-tslprb-signature-crop-compress',
    expectedAuthority: 'Telangana State Level Police Recruitment Board (TSLPRB)',
    expectedToolType: 'SIGNATURE_RESIZER',
    expectedDimensions: '280 × 120 px',
    forbiddenStrings: ['RBI', 'Reserve Bank of India', 'PHOTO RESIZER', '200 × 230'],
  },
  {
    slug: 'exam/rbi-grade-b-officer-passport-size-photo-resizer',
    expectedAuthority: 'Reserve Bank of India',
    expectedToolType: 'PHOTO_RESIZER',
    expectedDimensions: '200 × 230 px',
    forbiddenStrings: ['TSLPRB', 'Telangana Police', '350 × 450', 'Assistant'],
  },
  {
    slug: 'exam/rbi-grade-b-officer-signature-crop-compress',
    expectedAuthority: 'Reserve Bank of India',
    expectedToolType: 'SIGNATURE_RESIZER',
    expectedDimensions: '140 × 60 px',
    forbiddenStrings: ['TSLPRB', 'Telangana Police', 'PHOTO RESIZER', '200 × 230'],
  },
];

console.log('====================================================');
console.log('FORMILO AUTOMATED CONTENT ISOLATION QA TEST RUNNER');
console.log('====================================================\n');

let failed = false;

// 1. Audit Master Registry Completeness
console.log('Checking Master Registry integrity...');
for (const [key, tool] of Object.entries(MASTER_TOOL_REGISTRY)) {
  if (!tool.id || !tool.slug || !tool.title || !tool.requirements || !tool.seo || !tool.content) {
    console.error(`[FAIL] Master registry item '${key}' is missing required fields.`);
    failed = true;
  }
}
console.log(`[PASS] Verified ${Object.keys(MASTER_TOOL_REGISTRY).length} flagship registry configurations.\n`);

// 2. Cross-Contamination Test
console.log('Checking Cross-Exam & Tool-Type Contamination...');
for (const tc of TEST_CASES) {
  const config = resolveToolConfig(tc.slug);
  const serialized = JSON.stringify(config);

  // Authority verification
  if (config.authorityName !== tc.expectedAuthority) {
    console.error(`[FAIL] ${tc.slug}: Expected authority '${tc.expectedAuthority}', got '${config.authorityName}'`);
    failed = true;
  }

  // Tool Type verification
  if (config.toolType !== tc.expectedToolType) {
    console.error(`[FAIL] ${tc.slug}: Expected toolType '${tc.expectedToolType}', got '${config.toolType}'`);
    failed = true;
  }

  // Dimension verification
  if (config.requirements.dimensions !== tc.expectedDimensions) {
    console.error(`[FAIL] ${tc.slug}: Expected dimensions '${tc.expectedDimensions}', got '${config.requirements.dimensions}'`);
    failed = true;
  }

  // Forbidden string scans
  for (const forbidden of tc.forbiddenStrings) {
    if (serialized.includes(forbidden)) {
      console.error(`[CRITICAL LEAK] ${tc.slug} contains forbidden substring '${forbidden}'!`);
      failed = true;
    }
  }

  console.log(`[PASS] ${tc.slug}`);
}

console.log('\n====================================================');
if (failed) {
  console.error('RESULT: BUILD VERIFICATION FAILED. Contamination detected.');
  process.exit(1);
} else {
  console.log('RESULT: ALL ISOLATION TESTS PASSED (0 leaks detected).');
  process.exit(0);
}
