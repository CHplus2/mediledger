export type AccessActionType = 
  | 'EMERGENCY_MYKAD_OVERRIDE'
  | 'ROUTINE_OUTPATIENT_CONSULT'
  | 'CROSS_HOSPITAL_REFERRAL'
  | 'NEW_CLINICAL_NOTE_MINTED'
  | 'PRESCRIPTION_ADDED'
  | 'DUPLICATE_TEST_PREVENTED'
  | 'PATIENT_CONSENT_UPDATE';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Allergy {
  id: string;
  substance: string;
  reaction: string;
  severity: AlertSeverity;
  recordedDate: string;
  hospitalId: string;
  hospitalName: string;
  verifiedTxHash: string;
}

export interface PastSurgery {
  id: string;
  procedureName: string;
  bodySite: string;
  date: string;
  hospitalId: string;
  hospitalName: string;
  surgeon: string;
  implantNotes?: string;
  verifiedTxHash: string;
}

export interface CurrentMedication {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  prescribingHospital: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  verifiedTxHash: string;
}

export interface DiagnosticTest {
  id: string;
  testName: string;
  category: 'CT Scan' | 'MRI' | 'X-Ray' | 'Ultrasound' | 'Laboratory' | 'ECG';
  performedDate: string; // ISO string or YYYY-MM-DD HH:mm
  hospitalId: string;
  hospitalName: string;
  radiologistOrLab: string;
  summary: string;
  costMYR: number;
  radiationDoseMsv?: number;
  imageThumbnailUrl?: string;
  redundancyWindowHours: number; // Time window where repeating is typically redundant without acute change
  verifiedTxHash: string;
}

export interface ClinicalEncounter {
  id: string;
  date: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  attendingDoctor: string;
  diagnosis: string;
  clinicalNotes: string;
  verifiedTxHash: string;
}

export interface PatientRecord {
  mykad: string; // e.g. "940512-13-5521"
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  birthplaceState: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  organDonor: boolean;
  emergencyAccessEnabled: boolean; // Patient consent toggle
  allergies: Allergy[];
  surgeries: PastSurgery[];
  medications: CurrentMedication[];
  diagnosticHistory: DiagnosticTest[];
  encounters: ClinicalEncounter[];
}

export interface HospitalNode {
  id: string;
  name: string;
  state: 'Sarawak' | 'Sabah' | 'Kuala Lumpur' | 'Selangor' | 'Penang';
  tier: 'MOH Public Tertiary' | 'MOH Public Secondary' | 'Private Specialist Centre';
  nodeIpfsPeerId: string;
  status: 'active' | 'syncing';
  latencyMs: number;
  verifiedRecordsCount: number;
}

export interface BlockchainBlock {
  blockNumber: number;
  timestamp: string;
  action: AccessActionType;
  actorName: string;
  actorRole: 'Doctor' | 'Nurse' | 'Hospital Admin' | 'Patient Citizen';
  hospitalId: string;
  hospitalName: string;
  patientMykadMasked: string; // e.g. 940512-13-****
  patientHash: string;
  merkleRoot: string;
  previousHash: string;
  blockHash: string;
  gasUsed: number;
  l1AnchorTx: string;
  details: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  priorTest?: DiagnosticTest;
  hoursElapsed?: number;
  costSavedMYR: number;
  radiationSavedMsv: number;
  reason: string;
}
