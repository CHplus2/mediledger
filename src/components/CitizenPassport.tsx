import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  QrCode,
  History,
  Download,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { PatientRecord, BlockchainBlock, AccessActionType } from '../types/mediledger';

interface CitizenPassportProps {
  patient: PatientRecord;
  blocks: BlockchainBlock[];
  onToggleEmergencyAccess: () => void;
  onSwitchPatient: (p: PatientRecord) => void;
  availablePatients: PatientRecord[];
}

const ACTION_LABELS: Record<AccessActionType, string> = {
  EMERGENCY_MYKAD_OVERRIDE: 'Emergency MyKad Access',
  ROUTINE_OUTPATIENT_CONSULT: 'Outpatient Consultation',
  CROSS_HOSPITAL_REFERRAL: 'Cross-Hospital Sync',
  NEW_CLINICAL_NOTE_MINTED: 'Clinical Record Added',
  PRESCRIPTION_ADDED: 'Prescription Issued',
  DUPLICATE_TEST_PREVENTED: 'Duplicate Scan Prevented',
  PATIENT_CONSENT_UPDATE: 'Consent Policy Updated',
};

export const CitizenPassport: React.FC<CitizenPassportProps> = ({
  patient,
  blocks,
  onToggleEmergencyAccess,
  onSwitchPatient,
  availablePatients,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'audit' | 'vault'>('card');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const patientBlocks = blocks.filter(
    (b) =>
      b.patientMykadMasked.slice(0, 6) === patient.mykad.slice(0, 6) ||
      b.details.toLowerCase().includes(patient.fullName.toLowerCase())
  );

  const handleDownloadVault = () => {
    const fhirPayload = {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: new Date().toISOString(),
      patient: {
        name: patient.fullName,
        mykad: patient.mykad,
        birthDate: patient.dob,
        gender: patient.gender,
        bloodType: patient.bloodType,
      },
      allergies: patient.allergies,
      medications: patient.medications,
      surgeries: patient.surgeries,
      diagnostics: patient.diagnosticHistory,
      encounters: patient.encounters,
    };
    const blob = new Blob([JSON.stringify(fhirPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mediledger-fhir-${patient.mykad}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">
            Citizen Health Passport
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage emergency consent, inspect hospital access history, and export your portable FHIR record.
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          <label htmlFor="citizen-patient-select" className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
            Citizen Profile:
          </label>
          <div className="relative min-w-0 flex-1 sm:flex-initial">
            <select
              id="citizen-patient-select"
              value={patient.mykad}
              onChange={(e) => {
                const matched = availablePatients.find((p) => p.mykad === e.target.value);
                if (matched) onSwitchPatient(matched);
              }}
              className="w-full sm:w-auto max-w-full appearance-none bg-white border border-slate-300 text-xs font-medium text-slate-900 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer truncate"
            >
              {availablePatients.map((p) => (
                <option key={p.mykad} value={p.mykad}>
                  {p.fullName} ({p.birthplaceState})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Segmented Navigation */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] sm:text-xs font-medium w-full max-w-xl">
        <button
          type="button"
          onClick={() => setActiveTab('card')}
          className={`flex-1 min-w-fit py-2 px-2 sm:px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'card' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Digital Health Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex-1 min-w-fit py-2 px-2 sm:px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Access Audit Trail ({patientBlocks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vault')}
          className={`flex-1 min-w-fit py-2 px-2 sm:px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'vault' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Health Vault
        </button>
      </div>

      {/* Tab 1: Digital Health Card & Consent */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* National Health Card Artifact */}
          <div className="lg:col-span-7 rounded-2xl p-6 md:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-lg border border-slate-800">
            <div className="space-y-6">
              
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-medium tracking-wider text-teal-300 uppercase block">
                    Kementerian Kesihatan Malaysia
                  </span>
                  <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                    National Digital Health Card
                  </h2>
                </div>

                {/* Smart Chip */}
                <div className="w-11 h-8 rounded bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-600/80 shadow-inner flex flex-col justify-around p-1 shrink-0" aria-hidden="true">
                  <div className="h-0.5 bg-amber-800/50 rounded" />
                  <div className="h-0.5 bg-amber-800/50 rounded" />
                  <div className="h-0.5 bg-amber-800/50 rounded" />
                </div>
              </div>

              {/* Middle: Identity + QR */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Citizen Name</span>
                    <span className="text-lg font-bold text-white">{patient.fullName}</span>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">MyKad Number</span>
                      <span className="font-mono text-sm font-semibold text-teal-300 tabular-nums">{patient.mykad}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Blood Type</span>
                      <span className="font-mono text-sm font-bold text-red-300">{patient.bloodType}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300">
                    State: <strong className="text-white font-medium">{patient.birthplaceState}</strong> · Organ Donor:{' '}
                    <strong className="text-white font-medium">{patient.organDonor ? 'Pledged Yes' : 'No'}</strong>
                  </div>
                </div>

                {/* QR Block */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shrink-0 self-start sm:self-end">
                  <QrCode className="w-20 h-20 text-slate-900" />
                  <span className="text-[11px] text-slate-600 font-medium mt-1">Biometric QR</span>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Consent root verified on national health ledger</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">MyDigital ID Linked</span>
              </div>

            </div>
          </div>

          {/* Emergency Consent Policy Card */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-700" />
                <span>Emergency Break-Glass Policy</span>
              </h3>
              <span className={`text-xs font-semibold ${
                patient.emergencyAccessEnabled ? 'text-teal-700' : 'text-red-700'
              }`}>
                {patient.emergencyAccessEnabled ? 'Enabled' : 'Revoked'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When enabled, certified emergency department doctors can scan your MyKad chip to decrypt critical allergies, medications, and surgical implants if you arrive unconscious. Every access is permanently recorded in your audit trail.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onToggleEmergencyAccess}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg border transition-colors ${
                  patient.emergencyAccessEnabled
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-teal-700 text-white border-teal-700 hover:bg-teal-800'
                }`}
              >
                {patient.emergencyAccessEnabled ? 'Revoke Emergency Access' : 'Enable Emergency Access'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Access Audit Trail (Uniform Structured Table) */}
      {activeTab === 'audit' && (
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-teal-700" />
                <span>Immutable Access Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every hospital or clinician who views or updates your medical record generates a verifiable on-chain audit entry.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 tabular-nums shrink-0">
              {patientBlocks.length} events logged
            </span>
          </div>

          {patientBlocks.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No access events recorded for this citizen yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">Block</th>
                    <th className="px-6 py-3 whitespace-nowrap">Timestamp (UTC)</th>
                    <th className="px-6 py-3">Event & Clinical Context</th>
                    <th className="px-6 py-3">Clinician & Facility</th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">Verification Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {patientBlocks.map((block) => (
                    <tr key={block.blockNumber} className="hover:bg-slate-50/70 transition-colors align-top">
                      <td className="px-6 py-4 font-mono font-semibold text-teal-800 tabular-nums whitespace-nowrap">
                        #{block.blockNumber}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {block.timestamp.slice(0, 16).replace('T', ' ')}
                      </td>
                      <td className="px-6 py-4 space-y-1 max-w-md">
                        <div className="font-semibold text-slate-900">
                          {ACTION_LABELS[block.action] || block.action}
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          {block.details}
                        </p>
                      </td>
                      <td className="px-6 py-4 space-y-0.5">
                        <div className="font-medium text-slate-900">{block.actorName}</div>
                        <div className="text-slate-500">{block.hospitalName}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {block.blockHash.slice(0, 10)}...{block.blockHash.slice(-4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Portable Health Vault */}
      {activeTab === 'vault' && (
        <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Portable Health Summary (HL7 FHIR Export)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download a complete, cryptographically verified copy of your cross-hospital medical history.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadVault}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export FHIR Bundle (.json)</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="mx-4 sm:mx-6 mt-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Portable FHIR Health Summary downloaded (<span className="font-mono break-all">mediledger-fhir-{patient.mykad}.json</span>).</span>
            </div>
          )}

          {/* Clean 3-Column Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200">
            <div className="p-4 sm:p-6 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Verified Allergies</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums block">
                {patient.allergies.length}
              </span>
              <span className="text-xs text-slate-500 block">Cross-hospital signed</span>
            </div>

            <div className="p-4 sm:p-6 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Active Medications</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums block">
                {patient.medications.length}
              </span>
              <span className="text-xs text-slate-500 block">Synchronized across pharmacies</span>
            </div>

            <div className="p-4 sm:p-6 space-y-1">
              <span className="text-xs font-medium text-slate-500 block">Surgeries & Diagnostics</span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums block">
                {patient.surgeries.length + patient.diagnosticHistory.length}
              </span>
              <span className="text-xs text-slate-500 block">Lifelong continuity record</span>
            </div>
          </div>

          {/* Bundle Preview Table */}
          <div className="p-4 sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Included Clinical Sections
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-xs">
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">Allergies & Contraindications</span>
                <span className="text-slate-500 tabular-nums shrink-0">{patient.allergies.length} entries</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">Surgical Procedures & Implants</span>
                <span className="text-slate-500 tabular-nums shrink-0">{patient.surgeries.length} entries</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">Pharmacotherapy & Prescriptions</span>
                <span className="text-slate-500 tabular-nums shrink-0">{patient.medications.length} entries</span>
              </div>
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900">Radiology Imaging & Laboratory Reports</span>
                <span className="text-slate-500 tabular-nums shrink-0">{patient.diagnosticHistory.length} entries</span>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
