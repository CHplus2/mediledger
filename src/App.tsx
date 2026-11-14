import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DoctorDashboard } from './components/DoctorDashboard';
import { CitizenPassport } from './components/CitizenPassport';
import { BlockchainVisualizer } from './components/BlockchainVisualizer';
import { MyKadScannerModal } from './components/MyKadScannerModal';
import { DuplicateTestModal } from './components/DuplicateTestModal';
import { AddRecordModal } from './components/AddRecordModal';
import { ExhibitionPoster } from './components/ExhibitionPoster';
import {
  INITIAL_PATIENTS,
  CONNECTED_HOSPITALS,
  INITIAL_BLOCKS,
} from './data/mockData';
import {
  PatientRecord,
  BlockchainBlock,
  DiagnosticTest,
  Allergy,
  CurrentMedication,
  ClinicalEncounter,
  AccessActionType,
} from './types/mediledger';
import {
  detectDuplicateProcedures,
  mintLedgerBlock,
  generateCryptoHash,
} from './services/patientLogic';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [showPoster, setShowPoster] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('view') === 'poster';
    }
    return false;
  });
  const [activeTab, setActiveTab] = useState<'doctor' | 'citizen' | 'network'>('doctor');
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<PatientRecord>(INITIAL_PATIENTS[0]);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKS);
  const [hospitals] = useState(CONNECTED_HOSPITALS);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // Duplicate Check Modal state
  const [duplicateModal, setDuplicateModal] = useState<{
    isOpen: boolean;
    orderedTestName: string;
    priorTest?: DiagnosticTest;
    hoursElapsed: number;
    costSavedMYR: number;
    radiationSavedMsv: number;
  }>({
    isOpen: false,
    orderedTestName: '',
    hoursElapsed: 0,
    costSavedMYR: 0,
    radiationSavedMsv: 0,
  });

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Hospital & Doctor station context
  const currentHospital = hospitals[0]; // Sarawak General Hospital (Kuching)
  const currentDoctorName = 'Dr. Azman bin Hashim, MD';

  // Handle MyKad Scan event
  const handleSelectPatient = (patient: PatientRecord, isEmergency: boolean) => {
    setCurrentPatient(patient);
    setActiveTab('doctor');

    if (isEmergency) {
      const newBlock = mintLedgerBlock({
        blockNumber: blocks[0].blockNumber + 1,
        action: 'EMERGENCY_MYKAD_OVERRIDE',
        actorName: currentDoctorName,
        actorRole: 'Doctor',
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        patientMykad: patient.mykad,
        previousHash: blocks[0].blockHash,
        details: `Break-glass emergency authorization granted via MyKad smart chip reader at ${currentHospital.name}. Trauma resus bay.`,
      });

      setBlocks([newBlock, ...blocks]);
      showToast(`Emergency record for ${patient.fullName} loaded and logged in Block #${newBlock.blockNumber}.`);
    } else {
      showToast(`Record loaded for ${patient.fullName}.`);
    }
  };

  // Duplicate test trigger
  const handleTriggerDuplicateCheck = (orderedTestName: string) => {
    const result = detectDuplicateProcedures(
      orderedTestName,
      currentPatient.diagnosticHistory,
      '2026-11-12T03:00:00'
    );

    if (result.isDuplicate && result.priorTest) {
      setDuplicateModal({
        isOpen: true,
        orderedTestName,
        priorTest: result.priorTest,
        hoursElapsed: result.hoursElapsed || 36,
        costSavedMYR: result.costSavedMYR,
        radiationSavedMsv: result.radiationSavedMsv,
      });
    } else {
      showToast(`Order approved: No redundant scan found on MediLedger network.`, 'info');
    }
  };

  // Adopt prior test and save cost & radiation
  const handleAdoptPriorTest = (priorTest: DiagnosticTest) => {
    const newBlock = mintLedgerBlock({
      blockNumber: blocks[0].blockNumber + 1,
      action: 'DUPLICATE_TEST_PREVENTED',
      actorName: currentDoctorName,
      actorRole: 'Doctor',
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      patientMykad: currentPatient.mykad,
      previousHash: blocks[0].blockHash,
      details: `Redundant ${priorTest.category} cancelled. Re-used authenticated scan from ${priorTest.hospitalName}. RM ${duplicateModal.costSavedMYR} and ${duplicateModal.radiationSavedMsv} mSv saved.`,
    });

    setBlocks([newBlock, ...blocks]);
    setDuplicateModal({ ...duplicateModal, isOpen: false });
    showToast(`Redundant test cancelled. Saved RM ${duplicateModal.costSavedMYR}.`);
  };

  // Clinically override test
  const handleOverrideTest = (overrideReason: string) => {
    const newBlock = mintLedgerBlock({
      blockNumber: blocks[0].blockNumber + 1,
      action: 'EMERGENCY_MYKAD_OVERRIDE',
      actorName: currentDoctorName,
      actorRole: 'Doctor',
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      patientMykad: currentPatient.mykad,
      previousHash: blocks[0].blockHash,
      details: `Clinical override executed for ${duplicateModal.orderedTestName}. Reason: ${overrideReason}`,
    });

    setBlocks([newBlock, ...blocks]);
    setDuplicateModal({ ...duplicateModal, isOpen: false });
    showToast(`Order proceeded under documented clinical justification.`);
  };

  // Append new clinical record
  const handleSaveRecord = (
    type: 'note' | 'allergy' | 'medication',
    payload: Partial<Allergy> | Partial<CurrentMedication> | Partial<ClinicalEncounter>
  ) => {
    const txHash = generateCryptoHash(`RECORD_${Date.now()}`);

    const updatedPatient = { ...currentPatient };
    let actionType: AccessActionType = 'NEW_CLINICAL_NOTE_MINTED';
    let detailsStr = '';

    if (type === 'note') {
      const notePayload = payload as Partial<ClinicalEncounter>;
      const newEncounter: ClinicalEncounter = {
        id: `enc_${Date.now()}`,
        date: '2026-11-12',
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        department: notePayload.department || 'Emergency Department',
        attendingDoctor: currentDoctorName,
        diagnosis: notePayload.diagnosis || 'Clinical Assessment',
        clinicalNotes: notePayload.clinicalNotes || '',
        verifiedTxHash: txHash,
      };
      updatedPatient.encounters = [newEncounter, ...updatedPatient.encounters];
      actionType = 'NEW_CLINICAL_NOTE_MINTED';
      detailsStr = `Clinical encounter added: ${newEncounter.diagnosis} by ${currentDoctorName} (${currentHospital.name})`;
    } else if (type === 'allergy') {
      const algPayload = payload as Partial<Allergy>;
      const newAllergy: Allergy = {
        id: `alg_${Date.now()}`,
        substance: algPayload.substance || 'Unknown Allergen',
        reaction: algPayload.reaction || '',
        severity: algPayload.severity || 'critical',
        recordedDate: '2026-11-12',
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        verifiedTxHash: txHash,
      };
      updatedPatient.allergies = [newAllergy, ...updatedPatient.allergies];
      actionType = 'NEW_CLINICAL_NOTE_MINTED';
      detailsStr = `New verified drug allergy recorded: ${newAllergy.substance} (${newAllergy.severity}) by ${currentDoctorName}`;
    } else if (type === 'medication') {
      const medPayload = payload as Partial<CurrentMedication>;
      const newMed: CurrentMedication = {
        id: `med_${Date.now()}`,
        drugName: medPayload.drugName || 'Medication',
        dosage: medPayload.dosage || '',
        frequency: medPayload.frequency || 'Once Daily',
        startDate: '2026-11-12',
        prescribingHospital: currentHospital.name,
        prescribedBy: currentDoctorName,
        status: 'active',
        verifiedTxHash: txHash,
      };
      updatedPatient.medications = [newMed, ...updatedPatient.medications];
      actionType = 'PRESCRIPTION_ADDED';
      detailsStr = `New prescription issued: ${newMed.drugName} ${newMed.dosage} by ${currentDoctorName}`;
    }

    setCurrentPatient(updatedPatient);
    setPatients((prev) =>
      prev.map((p) => (p.mykad === updatedPatient.mykad ? updatedPatient : p))
    );

    const newBlock = mintLedgerBlock({
      blockNumber: blocks[0].blockNumber + 1,
      action: actionType,
      actorName: currentDoctorName,
      actorRole: 'Doctor',
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      patientMykad: currentPatient.mykad,
      previousHash: blocks[0].blockHash,
      details: detailsStr,
    });

    setBlocks([newBlock, ...blocks]);
    showToast(`Clinical record saved and signed in Block #${newBlock.blockNumber}.`);
  };

  // Toggle patient consent in citizen view
  const handleToggleEmergencyAccess = () => {
    const updatedState = !currentPatient.emergencyAccessEnabled;
    const updatedPatient = {
      ...currentPatient,
      emergencyAccessEnabled: updatedState,
    };

    setCurrentPatient(updatedPatient);
    setPatients((prev) =>
      prev.map((p) => (p.mykad === updatedPatient.mykad ? updatedPatient : p))
    );

    const newBlock = mintLedgerBlock({
      blockNumber: blocks[0].blockNumber + 1,
      action: 'PATIENT_CONSENT_UPDATE',
      actorName: currentPatient.fullName,
      actorRole: 'Patient Citizen',
      hospitalId: 'citizen_wallet',
      hospitalName: 'MyMediLedger Citizen Portal',
      patientMykad: currentPatient.mykad,
      previousHash: blocks[0].blockHash,
      details: `Citizen ${currentPatient.fullName} ${updatedState ? 'enabled' : 'revoked'} Break-Glass emergency trauma override consent.`,
    });

    setBlocks([newBlock, ...blocks]);
    showToast(`Consent policy updated and recorded in Block #${newBlock.blockNumber}.`);
  };

  // Simulation block from Visualizer
  const handleTriggerBlockSimulation = () => {
    const newBlock = mintLedgerBlock({
      blockNumber: blocks[0].blockNumber + 1,
      action: 'CROSS_HOSPITAL_REFERRAL',
      actorName: 'Consortium Validator Node',
      actorRole: 'Hospital Admin',
      hospitalId: 'sgh_kuching',
      hospitalName: 'Sarawak General Hospital',
      patientMykad: currentPatient.mykad,
      previousHash: blocks[0].blockHash,
      details: `Cross-hospital state synchronization completed between Sarawak General Hospital Layer 2 node and Hospital Kuala Lumpur. Merkle root anchored.`,
    });

    setBlocks([newBlock, ...blocks]);
    showToast(`Cross-hospital state synchronization verified in Block #${newBlock.blockNumber}.`);
  };

  if (showPoster) {
    return <ExhibitionPoster onBack={() => setShowPoster(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {activeTab === 'doctor' && (
          <DoctorDashboard
            patient={currentPatient}
            currentHospitalName={currentHospital.name}
            currentDoctorName={currentDoctorName}
            onOpenAddRecord={() => setIsAddRecordOpen(true)}
            onTriggerDuplicateCheck={handleTriggerDuplicateCheck}
            onSwitchPatient={(p) => setCurrentPatient(p)}
            availablePatients={patients}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPassport
            patient={currentPatient}
            blocks={blocks}
            onToggleEmergencyAccess={handleToggleEmergencyAccess}
            onSwitchPatient={(p) => setCurrentPatient(p)}
            availablePatients={patients}
          />
        )}

        {activeTab === 'network' && (
          <BlockchainVisualizer
            hospitals={hospitals}
            blocks={blocks}
            onTriggerBlockSimulation={handleTriggerBlockSimulation}
          />
        )}
      </main>

      {/* Modals */}
      <MyKadScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        patients={patients}
        onSelectPatient={handleSelectPatient}
      />

      {duplicateModal.isOpen && duplicateModal.priorTest && (
        <DuplicateTestModal
          isOpen={duplicateModal.isOpen}
          onClose={() => setDuplicateModal({ ...duplicateModal, isOpen: false })}
          orderedTestName={duplicateModal.orderedTestName}
          priorTest={duplicateModal.priorTest}
          hoursElapsed={duplicateModal.hoursElapsed}
          costSavedMYR={duplicateModal.costSavedMYR}
          radiationSavedMsv={duplicateModal.radiationSavedMsv}
          onAdoptPriorTest={handleAdoptPriorTest}
          onOverrideTest={handleOverrideTest}
        />
      )}

      <AddRecordModal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        patient={currentPatient}
        currentHospitalName={currentHospital.name}
        currentDoctorName={currentDoctorName}
        onSaveRecord={handleSaveRecord}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MediLedger National Health Information System
          </span>
          <div className="flex flex-wrap items-center gap-2.5 text-slate-500">
            <span>Layer 1 Integrity Root</span>
            <span aria-hidden="true">·</span>
            <span>Layer 2 Encrypted FHIR/IPFS</span>
            <span aria-hidden="true">·</span>
            <span>PDPA 2010 Compliant</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowPoster(true)}
              className="text-teal-700 hover:text-teal-800 font-medium underline underline-offset-2 cursor-pointer"
            >
              Booth Poster (FYP)
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
