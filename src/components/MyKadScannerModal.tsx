import React, { useState } from 'react';
import { X, Cpu, AlertTriangle, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { PatientRecord } from '../types/mediledger';
import { validateAndParseMyKad } from '../services/patientLogic';

interface MyKadScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord, isEmergency: boolean) => void;
}

export const MyKadScannerModal: React.FC<MyKadScannerModalProps> = ({
  isOpen,
  onClose,
  patients,
  onSelectPatient,
}) => {
  const [manualIc, setManualIc] = useState('');
  const [isEmergencyOverride, setIsEmergencyOverride] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<PatientRecord | null>(patients[0] || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTriggerScan = (patient: PatientRecord) => {
    setSelectedPreset(patient);
    setIsScanning(true);
    setScanStep('Reading MyKad smart chip via NFC / USB reader...');

    setTimeout(() => {
      setScanStep('Verifying clinician credentials & patient consent policy...');
    }, 450);

    setTimeout(() => {
      setScanStep('Decrypting cross-hospital health summary from Layer 2...');
    }, 900);

    setTimeout(() => {
      setScanStep('Unified cross-hospital patient record ready.');
      setTimeout(() => {
        setIsScanning(false);
        onSelectPatient(patient, isEmergencyOverride);
        onClose();
      }, 350);
    }, 1350);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsed = validateAndParseMyKad(manualIc);
    if (!parsed.isValid) {
      setValidationError(parsed.error || 'Please enter a valid 12-digit Malaysian MyKad number');
      return;
    }

    const matched = patients.find(
      (p) => p.mykad.replace(/[^0-9]/g, '') === parsed.normalized
    );

    if (matched) {
      handleTriggerScan(matched);
    } else {
      const syntheticPatient: PatientRecord = {
        mykad: parsed.formatted,
        fullName: 'Citizen (National ID Verified)',
        dob: parsed.birthDate || '1995-01-01',
        gender: parsed.gender || 'Male',
        bloodType: 'O+',
        birthplaceState: parsed.stateOfBirth || 'Sarawak',
        emergencyContact: {
          name: 'Next-of-Kin',
          relationship: 'Family',
          phone: '+60 19-000 0000',
        },
        organDonor: true,
        emergencyAccessEnabled: true,
        allergies: [],
        surgeries: [],
        medications: [],
        diagnosticHistory: [],
        encounters: [],
      };
      handleTriggerScan(syntheticPatient);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 id="scanner-modal-title" className="text-sm font-bold text-slate-950">
                  MyKad Smart Chip Scanner
                </h2>
                <p className="text-xs text-slate-500 truncate">Emergency Department & Clinical Intake Reader</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors shrink-0"
              aria-label="Close scanner modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain flex-1">

          {/* Access Mode Selector */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">Access Protocol:</span>
                <span className={`text-xs font-semibold ${isEmergencyOverride ? 'text-red-700' : 'text-teal-700'}`}>
                  {isEmergencyOverride ? 'Emergency Break-Glass Override' : 'Standard Patient Consent'}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isEmergencyOverride 
                  ? 'Permits immediate trauma decryption for unconscious patients. Logged permanently on-chain.' 
                  : 'Requires standard outpatient biometric or PIN verification.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEmergencyOverride(!isEmergencyOverride)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                isEmergencyOverride
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isEmergencyOverride ? 'Switch to Standard' : 'Enable Emergency Mode'}
            </button>
          </div>

          {/* Scanning Animation State */}
          {isScanning ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping" />
                <div className="relative w-14 h-14 rounded-full border-4 border-teal-700 border-t-transparent animate-spin flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-teal-700" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{scanStep}</p>
                <p className="text-xs text-slate-500">Synchronizing across national hospital nodes...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Quick Patient Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Registered Patient Cards</span>
                  <span className="text-slate-500">Select a card to simulate tap</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {patients.map((p) => {
                    const isSelected = selectedPreset?.mykad === p.mykad;
                    const criticalAllergy = p.allergies.find((a) => a.severity === 'critical');
                    return (
                      <button
                        key={p.mykad}
                        type="button"
                        onClick={() => handleTriggerScan(p)}
                        className={`p-3.5 rounded-xl border text-left transition-all group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-teal-50/50 border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono">{p.mykad}</span>
                            <span className="font-mono font-bold text-red-700">{p.bloodType}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                            {p.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.birthplaceState} · {2026 - parseInt(p.dob.slice(0, 4), 10)}y
                          </div>
                        </div>

                        {criticalAllergy && (
                          <div className="mt-2.5 text-[11px] font-medium text-red-700 truncate">
                            Allergy: {criticalAllergy.substance.split('(')[0]}
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-semibold">
                          <span>Tap Card</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manual MyKad IC Entry */}
              <div className="pt-4 border-t border-slate-200">
                <form onSubmit={handleManualSearch} className="space-y-2">
                  <label htmlFor="manual-ic-input" className="text-xs font-semibold text-slate-800 block">
                    Or Enter MyKad Number Manually
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      id="manual-ic-input"
                      type="text"
                      value={manualIc}
                      onChange={(e) => {
                        setManualIc(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="e.g. 940512-13-5521 or 010824-12-4982"
                      className="w-full sm:flex-1 min-w-0 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      Retrieve Record
                    </button>
                  </div>

                  {validationError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </form>
              </div>
            </>
          )}

          {/* Compliance Footnote */}
          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-4">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              Malaysian PDPA 2010 & Ministry of Health Emergency Clinical Access compliant.
            </span>
          </div>

          </div>

        </div>
      </div>
    </div>
  );
};
