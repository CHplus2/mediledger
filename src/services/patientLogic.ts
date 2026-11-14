import { DiagnosticTest, DuplicateCheckResult, BlockchainBlock, AccessActionType } from '../types/mediledger';

export interface MyKadParseResult {
  isValid: boolean;
  normalized: string;
  formatted: string;
  birthDate?: string;
  age?: number;
  gender?: 'Male' | 'Female';
  stateOfBirth?: string;
  error?: string;
}

const STATE_CODE_MAP: Record<string, string> = {
  '13': 'Sarawak',
  '50': 'Sarawak',
  '51': 'Sarawak',
  '52': 'Sarawak',
  '53': 'Sarawak',
  '12': 'Sabah',
  '47': 'Sabah',
  '48': 'Sabah',
  '49': 'Sabah',
  '14': 'Kuala Lumpur',
  '54': 'Kuala Lumpur',
  '55': 'Kuala Lumpur',
  '56': 'Kuala Lumpur',
  '57': 'Kuala Lumpur',
  '10': 'Selangor',
  '41': 'Selangor',
  '42': 'Selangor',
  '43': 'Selangor',
  '44': 'Selangor',
  '01': 'Johor',
  '02': 'Kedah',
  '03': 'Kelantan',
  '04': 'Melaka',
  '05': 'Negeri Sembilan',
  '06': 'Pahang',
  '07': 'Pulau Pinang',
  '08': 'Perak',
  '09': 'Perlis',
  '11': 'Terengganu',
  '15': 'Labuan',
  '16': 'Putrajaya',
};

/**
 * Validates and decodes a Malaysian MyKad National ID number
 */
export function validateAndParseMyKad(rawInput: string): MyKadParseResult {
  if (!rawInput) {
    return { isValid: false, normalized: '', formatted: '', error: 'MyKad number cannot be empty' };
  }

  const clean = rawInput.replace(/[^0-9]/g, '');

  if (clean.length !== 12) {
    return {
      isValid: false,
      normalized: clean,
      formatted: rawInput,
      error: `Invalid length (${clean.length}/12 digits required)`,
    };
  }

  const yy = clean.substring(0, 2);
  const mm = clean.substring(2, 4);
  const dd = clean.substring(4, 6);
  const pb = clean.substring(6, 8);
  const lastDigit = parseInt(clean.substring(11, 12), 10);

  const monthNum = parseInt(mm, 10);
  const dayNum = parseInt(dd, 10);

  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return {
      isValid: false,
      normalized: clean,
      formatted: `${clean.slice(0, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 12)}`,
      error: 'Invalid birth date encoded in MyKad',
    };
  }

  // Determine century: 00-26 assume 2000s, 27-99 assume 1900s
  const yearNum = parseInt(yy, 10);
  const fullYear = yearNum <= 26 ? 2000 + yearNum : 1900 + yearNum;
  const birthDateStr = `${fullYear}-${mm}-${dd}`;
  
  // Calculate approximate age (as of 2026)
  const currentYear = 2026;
  const age = Math.max(0, currentYear - fullYear);

  const gender: 'Male' | 'Female' = lastDigit % 2 === 1 ? 'Male' : 'Female';
  const stateOfBirth = STATE_CODE_MAP[pb] || 'Other State / Federal Territory';

  const formatted = `${clean.slice(0, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 12)}`;

  return {
    isValid: true,
    normalized: clean,
    formatted,
    birthDate: birthDateStr,
    age,
    gender,
    stateOfBirth,
  };
}

/**
 * Deterministic SHA-256 style hash generator for demo blockchain proofs
 */
export function generateCryptoHash(seed: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  
  // Extended deterministic hash simulating 64-char 256-bit hash
  let finalHash = '0x';
  for (let j = 0; j < 4; j++) {
    const subSeed = seed + j.toString();
    let subH = 0x811c9dc5;
    for (let k = 0; k < subSeed.length; k++) {
      subH ^= subSeed.charCodeAt(k);
      subH = Math.imul(subH, 0x01000193);
    }
    finalHash += (subH >>> 0).toString(16).padStart(8, '0');
  }
  return finalHash + hex1 + hex2;
}

/**
 * Duplicate diagnostic test detector
 * Compares an ordered test against patient's cross-hospital test history
 */
export function detectDuplicateProcedures(
  orderedTestName: string,
  history: DiagnosticTest[],
  referenceDateStr: string = '2026-11-12T03:00:00'
): DuplicateCheckResult {
  const normalizedOrder = orderedTestName.trim().toLowerCase();
  const refTime = new Date(referenceDateStr).getTime();

  for (const test of history) {
    const normalizedHistory = test.testName.trim().toLowerCase();

    // Robust medical procedure matching: exact substring or shared significant modality + anatomical keywords
    const getTokens = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
    const orderTokens = getTokens(normalizedOrder);
    const historyTokens = getTokens(normalizedHistory);

    const commonTokens = orderTokens.filter(t => historyTokens.includes(t) || historyTokens.some(h => h.startsWith(t) || t.startsWith(h)));
    
    // Check if key modalities and anatomy match (e.g., both contain "ct" and "abdom...")
    const isModalityMatch = 
      (orderTokens.includes('ct') && historyTokens.includes('ct')) ||
      (orderTokens.includes('mri') && historyTokens.includes('mri')) ||
      (orderTokens.includes('xray') && historyTokens.includes('xray')) ||
      (normalizedOrder.includes('x-ray') && normalizedHistory.includes('x-ray')) ||
      (orderTokens.includes('ultrasound') && historyTokens.includes('ultrasound'));

    const isAnatomyMatch = 
      commonTokens.some(t => ['abdom', 'abdomina', 'abdominal', 'abdomen', 'chest', 'thorax', 'brain', 'pelvis', 'spine', 'knee', 'femur'].some(a => t.startsWith(a) || a.startsWith(t)));

    const isNameMatch = 
      normalizedHistory.includes(normalizedOrder) || 
      normalizedOrder.includes(normalizedHistory) ||
      (isModalityMatch && isAnatomyMatch) ||
      commonTokens.length >= 2;

    if (isNameMatch) {
      const testTime = new Date(test.performedDate).getTime();
      const diffHours = Math.max(0, Math.round((refTime - testTime) / (1000 * 60 * 60)));

      // If within redundancy window
      if (diffHours <= test.redundancyWindowHours) {
        return {
          isDuplicate: true,
          priorTest: test,
          hoursElapsed: diffHours,
          costSavedMYR: test.costMYR,
          radiationSavedMsv: test.radiationDoseMsv || 0,
          reason: `Matching test '${test.testName}' was already performed ${diffHours}h ago at ${test.hospitalName}. Medical protocol advises reviewing existing imaging before re-exposing patient.`,
        };
      }
    }
  }

  return {
    isDuplicate: false,
    costSavedMYR: 0,
    radiationSavedMsv: 0,
    reason: 'No clinically redundant test found within the critical re-test window.',
  };
}

/**
 * Creates an immutable blockchain block record for the ledger
 */
export function mintLedgerBlock(
  params: {
    blockNumber: number;
    action: AccessActionType;
    actorName: string;
    actorRole: 'Doctor' | 'Nurse' | 'Hospital Admin' | 'Patient Citizen';
    hospitalId: string;
    hospitalName: string;
    patientMykad: string;
    previousHash: string;
    details: string;
    timestamp?: string;
  }
): BlockchainBlock {
  const timestamp = params.timestamp || new Date().toISOString();
  const patientHash = generateCryptoHash(params.patientMykad);
  const maskedMykad = params.patientMykad.length >= 8 
    ? `${params.patientMykad.slice(0, 7)}****` 
    : 'HIDDEN';

  const rawSeed = `${params.blockNumber}-${timestamp}-${params.action}-${params.actorName}-${params.hospitalId}-${patientHash}-${params.previousHash}`;
  const blockHash = generateCryptoHash(rawSeed);
  const merkleRoot = generateCryptoHash(`MERKLE_ROOT_${blockHash.slice(0, 16)}`);
  const l1AnchorTx = `0xL1_${blockHash.slice(10, 26)}`;

  return {
    blockNumber: params.blockNumber,
    timestamp,
    action: params.action,
    actorName: params.actorName,
    actorRole: params.actorRole,
    hospitalId: params.hospitalId,
    hospitalName: params.hospitalName,
    patientMykadMasked: maskedMykad,
    patientHash,
    merkleRoot,
    previousHash: params.previousHash,
    blockHash,
    gasUsed: Math.floor(21000 + (rawSeed.length * 68)),
    l1AnchorTx,
    details: params.details,
  };
}

/**
 * Returns Market Metrics for Borneo Blockchain Conference Pitch presentation
 */
export function getMarketHISMetrics() {
  return {
    tamUSD: 'USD 1.47 Billion',
    tamMYR: 'RM 6.88 Billion',
    tamDesc: 'Total Addressable Market — Southeast Asia & Malaysia Hospital Information Systems (HIS)',
    samUSD: 'USD 568 Million',
    samMYR: 'RM 2.65 Billion',
    samDesc: 'Serviceable Addressable Market — 156 Malaysian Public & Govt State Hospitals (MOH)',
    somUSD: 'USD 58.6 Million',
    somMYR: 'RM 274 Million',
    somDesc: 'Serviceable Obtainable Market — 10% penetration over 5-year phased national rollout',
    clinicalImpact: {
      misdiagnosisReductionPct: '10–15%',
      preventedDuplicateTestsAnnualMYR: 'RM 214 Million',
      emergencyHistoryRetrievalSeconds: '< 3.2 seconds via MyKad NFC/Chip',
      legacyRetrievalHours: '4–48 hours (or total record absence)',
    },
  };
}
