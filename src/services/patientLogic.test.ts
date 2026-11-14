import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAndParseMyKad,
  detectDuplicateProcedures,
  mintLedgerBlock,
  generateCryptoHash,
  getMarketHISMetrics,
} from './patientLogic';
import { DiagnosticTest } from '../types/mediledger';

test('MyKad validation correctly parses Sarawak citizen IC', () => {
  const result = validateAndParseMyKad('940512-13-5521');
  assert.equal(result.isValid, true);
  assert.equal(result.stateOfBirth, 'Sarawak');
  assert.equal(result.gender, 'Male');
  assert.equal(result.birthDate, '1994-05-12');
  assert.equal(result.age, 32);
});

test('MyKad validation correctly parses Sabah citizen female IC', () => {
  const result = validateAndParseMyKad('010824124982');
  assert.equal(result.isValid, true);
  assert.equal(result.stateOfBirth, 'Sabah');
  assert.equal(result.gender, 'Female');
  assert.equal(result.birthDate, '2001-08-24');
  assert.equal(result.formatted, '010824-12-4982');
});

test('MyKad validation rejects invalid strings', () => {
  const shortResult = validateAndParseMyKad('12345');
  assert.equal(shortResult.isValid, false);

  const invalidMonth = validateAndParseMyKad('901432135521');
  assert.equal(invalidMonth.isValid, false);
});

test('detectDuplicateProcedures flags redundant CT scan within 72h window', () => {
  const sampleHistory: DiagnosticTest[] = [
    {
      id: 'test_ct_01',
      testName: 'Contrast Abdominal CT Scan',
      category: 'CT Scan',
      performedDate: '2026-11-10T14:00:00',
      hospitalId: 'borneo_mc',
      hospitalName: 'Borneo Medical Centre (Kuching)',
      radiologistOrLab: 'Dr. Evelyn Chai',
      summary: 'Mild mucosal thickening at cecum. No acute appendicitis.',
      costMYR: 1250,
      radiationDoseMsv: 7.8,
      redundancyWindowHours: 72,
      verifiedTxHash: '0xabc123',
    },
  ];

  // Doctor tries to order an abdominal CT 40 hours later on 2026-11-12T06:00:00
  const result = detectDuplicateProcedures(
    'Abdominal CT Scan with Contrast',
    sampleHistory,
    '2026-11-12T06:00:00'
  );

  assert.equal(result.isDuplicate, true);
  assert.equal(result.costSavedMYR, 1250);
  assert.equal(result.radiationSavedMsv, 7.8);
  assert.match(result.reason, /Borneo Medical Centre/);
});

test('detectDuplicateProcedures allows test if outside redundancy window', () => {
  const sampleHistory: DiagnosticTest[] = [
    {
      id: 'test_ct_old',
      testName: 'Chest X-Ray PA View',
      category: 'X-Ray',
      performedDate: '2026-09-01T10:00:00',
      hospitalId: 'sgh_kuching',
      hospitalName: 'Sarawak General Hospital',
      radiologistOrLab: 'Dr. Wong',
      summary: 'Clear lung fields.',
      costMYR: 120,
      radiationDoseMsv: 0.1,
      redundancyWindowHours: 48,
      verifiedTxHash: '0xdef456',
    },
  ];

  const result = detectDuplicateProcedures(
    'Chest X-Ray',
    sampleHistory,
    '2026-11-12T06:00:00'
  );

  assert.equal(result.isDuplicate, false);
  assert.equal(result.costSavedMYR, 0);
});

test('mintLedgerBlock produces valid cryptographically chained block', () => {
  const prevHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const block = mintLedgerBlock({
    blockNumber: 1042,
    action: 'EMERGENCY_MYKAD_OVERRIDE',
    actorName: 'Dr. Azman Hashim',
    actorRole: 'Doctor',
    hospitalId: 'sgh_kuching',
    hospitalName: 'Sarawak General Hospital',
    patientMykad: '940512-13-5521',
    previousHash: prevHash,
    details: 'Break-glass emergency medical history decryption for trauma triage.',
    timestamp: '2026-11-12T03:00:00.000Z',
  });

  assert.equal(block.blockNumber, 1042);
  assert.equal(block.previousHash, prevHash);
  assert.ok(block.blockHash.startsWith('0x'));
  assert.ok(block.merkleRoot.startsWith('0x'));
  assert.equal(block.patientMykadMasked, '940512-****');
  assert.ok(block.gasUsed > 21000);
});

test('getMarketHISMetrics returns exact slides figures', () => {
  const metrics = getMarketHISMetrics();
  assert.match(metrics.tamUSD, /1.47 Billion/);
  assert.match(metrics.samUSD, /568 Million/);
  assert.match(metrics.somUSD, /58.6 Million/);
});
