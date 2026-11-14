import React, { useState } from 'react';
import { X, FilePlus2, ChevronDown } from 'lucide-react';
import { PatientRecord, Allergy, CurrentMedication, ClinicalEncounter } from '../types/mediledger';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  currentHospitalName: string;
  currentDoctorName: string;
  onSaveRecord: (
    type: 'note' | 'allergy' | 'medication',
    payload: Partial<Allergy> | Partial<CurrentMedication> | Partial<ClinicalEncounter>
  ) => void;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentHospitalName,
  currentDoctorName,
  onSaveRecord,
}) => {
  const [recordType, setRecordType] = useState<'note' | 'allergy' | 'medication'>('note');

  const [diagnosis, setDiagnosis] = useState('');
  const [department, setDepartment] = useState('Emergency Department (Trauma Bay)');
  const [notes, setNotes] = useState('');

  const [allergen, setAllergen] = useState('');
  const [reaction, setReaction] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'warning' | 'info'>('critical');

  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (recordType === 'note') {
      onSaveRecord('note', {
        diagnosis: diagnosis || 'Clinical Observation & Triage Note',
        department,
        clinicalNotes: notes || 'Patient evaluated and vitals stabilized.',
      });
    } else if (recordType === 'allergy') {
      onSaveRecord('allergy', {
        substance: allergen,
        reaction,
        severity,
      });
    } else if (recordType === 'medication') {
      onSaveRecord('medication', {
        drugName,
        dosage,
        frequency,
        status: 'active',
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-record-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
              <FilePlus2 className="w-4 h-4" />
            </div>
            <div>
              <h2 id="add-record-modal-title" className="text-sm font-bold text-slate-950">
                Add Clinical Record
              </h2>
              <p className="text-xs text-slate-500">
                {patient.fullName} · <span className="font-mono">{patient.mykad}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
            aria-label="Close add record modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          <div>
            <span className="text-xs font-semibold text-slate-800 block mb-2">Record Category</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRecordType('note')}
                className={`py-1.5 rounded-md transition-all ${
                  recordType === 'note' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clinical Note
              </button>
              <button
                type="button"
                onClick={() => setRecordType('allergy')}
                className={`py-1.5 rounded-md transition-all ${
                  recordType === 'allergy' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Drug Allergy
              </button>
              <button
                type="button"
                onClick={() => setRecordType('medication')}
                className={`py-1.5 rounded-md transition-all ${
                  recordType === 'medication' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prescription
              </button>
            </div>
          </div>

          {recordType === 'note' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="diagnosis-input" className="text-xs font-medium text-slate-700 block mb-1">Diagnosis / Assessment</label>
                <input
                  id="diagnosis-input"
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Mild Concussion & Forehead Laceration"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label htmlFor="department-input" className="text-xs font-medium text-slate-700 block mb-1">Department / Ward</label>
                <input
                  id="department-input"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label htmlFor="notes-input" className="text-xs font-medium text-slate-700 block mb-1">Clinical Progress Notes</label>
                <textarea
                  id="notes-input"
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter objective clinical findings, vitals, and plan of care..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>
            </div>
          )}

          {recordType === 'allergy' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="allergen-input" className="text-xs font-medium text-slate-700 block mb-1">Allergen / Drug Class</label>
                <input
                  id="allergen-input"
                  type="text"
                  required
                  value={allergen}
                  onChange={(e) => setAllergen(e.target.value)}
                  placeholder="e.g. Ciprofloxacin, Cephalosporins"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label htmlFor="reaction-input" className="text-xs font-medium text-slate-700 block mb-1">Reported Reaction</label>
                <input
                  id="reaction-input"
                  type="text"
                  required
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  placeholder="e.g. Generalized urticaria, facial angioedema"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div>
                <label htmlFor="severity-select" className="text-xs font-medium text-slate-700 block mb-1">Severity Level</label>
                <div className="relative">
                  <select
                    id="severity-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as 'critical' | 'warning' | 'info')}
                    className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
                  >
                    <option value="critical">Critical (Anaphylaxis / Life-threatening)</option>
                    <option value="warning">Moderate (Severe rash / Bronchospasm)</option>
                    <option value="info">Mild (Gastrointestinal intolerance)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}

          {recordType === 'medication' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="drug-input" className="text-xs font-medium text-slate-700 block mb-1">Medication Name</label>
                <input
                  id="drug-input"
                  type="text"
                  required
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="e.g. Paracetamol, Omeprazole"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="dosage-input" className="text-xs font-medium text-slate-700 block mb-1">Dosage</label>
                  <input
                    id="dosage-input"
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500 mg"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div>
                  <label htmlFor="frequency-input" className="text-xs font-medium text-slate-700 block mb-1">Frequency</label>
                  <input
                    id="frequency-input"
                    type="text"
                    required
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. TDS (3x daily)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Signing Metadata */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Signing Clinician:</span>
              <span className="font-medium text-slate-900">{currentDoctorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Originating Facility:</span>
              <span className="font-medium text-teal-800">{currentHospitalName}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              Save & Sign Record
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
