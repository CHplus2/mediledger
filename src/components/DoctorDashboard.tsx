import React, { useState } from 'react';
import {
  AlertTriangle,
  HeartPulse,
  Pill,
  Scissors,
  FileSearch,
  FilePlus,
  Calendar,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';
import { PatientRecord } from '../types/mediledger';

interface DoctorDashboardProps {
  patient: PatientRecord;
  currentHospitalName: string;
  currentDoctorName: string;
  onOpenAddRecord: () => void;
  onTriggerDuplicateCheck: (testName: string) => void;
  onSwitchPatient: (p: PatientRecord) => void;
  availablePatients: PatientRecord[];
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patient,
  currentHospitalName,
  currentDoctorName,
  onOpenAddRecord,
  onTriggerDuplicateCheck,
  onSwitchPatient,
  availablePatients,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'allergies' | 'surgeries' | 'medications' | 'diagnostics' | 'encounters'>('all');
  const [orderInput, setOrderInput] = useState('Abdominal & Pelvic CT Scan with IV Contrast');

  const criticalAllergies = patient.allergies.filter((a) => a.severity === 'critical');
  const birthYear = parseInt(patient.dob.slice(0, 4), 10);
  const calculatedAge = 2026 - (isNaN(birthYear) ? 1995 : birthYear);

  return (
    <div className="space-y-6 pb-12">

      {/* Facility & Intake Context Strip */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-slate-900">{currentHospitalName}</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span>Emergency & Trauma Bay 2</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Attending: <strong className="font-medium text-slate-800">{currentDoctorName}</strong></span>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <label htmlFor="patient-switcher" className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Active Patient:
          </label>
          <div className="relative">
            <select
              id="patient-switcher"
              value={patient.mykad}
              onChange={(e) => {
                const matched = availablePatients.find((p) => p.mykad === e.target.value);
                if (matched) onSwitchPatient(matched);
              }}
              className="appearance-none bg-white border border-slate-300 text-xs font-medium text-slate-900 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
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

      {/* Patient Clinical Banner */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Patient Demographics */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
                {patient.fullName}
              </h1>
              <span className="text-sm font-mono font-medium text-teal-800">
                MyKad {patient.mykad}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  Blood Type <strong className="font-semibold text-red-700 font-mono">{patient.bloodType}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  DOB <strong className="font-medium text-slate-800 tabular-nums">{patient.dob}</strong> ({calculatedAge}y, {patient.gender})
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  State: <strong className="font-medium text-slate-800">{patient.birthplaceState}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  Organ Donor: <strong className="font-medium text-slate-800">{patient.organDonor ? 'Yes' : 'No'}</strong>
                </span>
              </div>
              <div>
                Next of Kin: <strong className="font-medium text-slate-800">{patient.emergencyContact.name}</strong> ({patient.emergencyContact.phone})
              </div>
            </div>
          </div>

          {/* Triage Vitals Strip */}
          <div className="grid grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-lg bg-slate-50/70 shrink-0 w-full lg:w-auto">
            <div className="px-4 py-2.5 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">HR</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                114 <span className="text-[11px] font-normal text-slate-500">bpm</span>
              </span>
            </div>
            <div className="px-4 py-2.5 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">BP</span>
              <span className="text-base font-bold font-mono text-slate-900 tabular-nums">96/62</span>
            </div>
            <div className="px-4 py-2.5 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">SpO2</span>
              <span className="text-base font-bold font-mono text-teal-700 tabular-nums">94%</span>
            </div>
            <div className="px-4 py-2.5 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">GCS</span>
              <span className="text-base font-bold font-mono text-amber-700 tabular-nums">9/15</span>
            </div>
          </div>
        </div>

        {/* High-Alert Contraindication Strip */}
        {criticalAllergies.length > 0 && (
          <div className="bg-red-50/45 border-t border-red-100 px-6 py-3.5 space-y-2">
            {criticalAllergies.map((alg) => (
              <div key={alg.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-xs leading-relaxed">
                    <span className="font-semibold text-red-700 mr-2">Critical Allergy:</span>
                    <span className="font-semibold text-slate-900">{alg.substance}</span>
                    <span className="text-slate-400 mx-1.5" aria-hidden="true">·</span>
                    <span className="text-slate-700">{alg.reaction}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 pl-6 sm:pl-0">
                  {alg.hospitalName} · <span className="tabular-nums">{alg.recordedDate}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Diagnostic Order Entry & Redundancy Check */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>Diagnostic Procedure Order</span>
          </h2>
          <p className="text-xs text-slate-500">
            Automatically checks recent cross-hospital imaging to prevent duplicate tests and radiation exposure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <select
              aria-label="Select diagnostic procedure to order"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 rounded-lg pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
            >
              <option value="Abdominal & Pelvic CT Scan with IV Contrast">
                Abdominal & Pelvic CT Scan with IV Contrast
              </option>
              <option value="Cervical Spine MRI Non-Contrast">
                Cervical Spine MRI Non-Contrast
              </option>
              <option value="Chest X-Ray PA View">
                Routine Chest X-Ray PA View
              </option>
              <option value="Complete Metabolic Panel & Liver Function Test">
                Complete Metabolic Panel & Liver Function Test
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => onTriggerDuplicateCheck(orderInput)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-xs"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Check & Order Procedure</span>
          </button>
        </div>
      </section>

      {/* Filter Bar & Add Clinical Record Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg overflow-x-auto text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'all' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Records
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('allergies')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'allergies' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Allergies ({patient.allergies.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('surgeries')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'surgeries' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surgeries ({patient.surgeries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('medications')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'medications' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Medications ({patient.medications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('diagnostics')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'diagnostics' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Imaging & Labs ({patient.diagnosticHistory.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('encounters')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeSection === 'encounters' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Encounters ({patient.encounters.length})
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenAddRecord}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap self-end sm:self-auto"
        >
          <FilePlus className="w-3.5 h-3.5 text-teal-700" />
          <span>Add Clinical Record</span>
        </button>
      </div>

      {/* Unified Clinical Records Grid (Single-Elevation Panels with Hairline Dividers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Left Column: Allergies & Surgical History */}
        {(activeSection === 'all' || activeSection === 'allergies' || activeSection === 'surgeries') && (
          <div className="space-y-6">

            {/* Allergies Panel */}
            {(activeSection === 'all' || activeSection === 'allergies') && (
              <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-red-600" />
                    <span>Allergies & Contraindications</span>
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">{patient.allergies.length} recorded</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patient.allergies.map((alg) => (
                    <div key={alg.id} className="p-5 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-900">{alg.substance}</span>
                        <span className={`text-xs font-semibold shrink-0 ${
                          alg.severity === 'critical' ? 'text-red-700' : 'text-amber-700'
                        }`}>
                          {alg.severity === 'critical' ? 'Critical' : 'Moderate'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{alg.reaction}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                        <span>{alg.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{alg.recordedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{alg.verifiedTxHash.slice(0, 12)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Surgical History Panel */}
            {(activeSection === 'all' || activeSection === 'surgeries') && (
              <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-slate-700" />
                    <span>Surgical History & Implants</span>
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">{patient.surgeries.length} procedures</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patient.surgeries.map((surg) => (
                    <div key={surg.id} className="p-5 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-900">{surg.procedureName}</span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">{surg.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Site: {surg.bodySite} · Surgeon: {surg.surgeon}
                      </p>
                      {surg.implantNotes && (
                        <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200/80 rounded-md px-3 py-2 mt-1">
                          <span className="font-medium text-slate-900">Implant note:</span> {surg.implantNotes}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                        <span>{surg.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{surg.verifiedTxHash.slice(0, 12)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* Right Column: Medications, Diagnostics & Encounters */}
        {(activeSection === 'all' || activeSection === 'medications' || activeSection === 'diagnostics' || activeSection === 'encounters') && (
          <div className="space-y-6">

            {/* Medications Panel */}
            {(activeSection === 'all' || activeSection === 'medications') && (
              <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-700" />
                    <span>Active Medications</span>
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">{patient.medications.length} active</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patient.medications.map((med) => (
                    <div key={med.id} className="p-5 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {med.drugName} <span className="font-mono font-medium text-teal-800 ml-1">{med.dosage}</span>
                        </span>
                        <span className="text-xs font-semibold text-teal-700 capitalize shrink-0">
                          {med.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{med.frequency}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                        <span>{med.prescribingHospital}</span>
                        <span aria-hidden="true">·</span>
                        <span>{med.prescribedBy}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">Started {med.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Diagnostic Imaging & Pathology Panel */}
            {(activeSection === 'all' || activeSection === 'diagnostics') && (
              <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-teal-700" />
                    <span>Diagnostic Imaging & Pathology</span>
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">{patient.diagnosticHistory.length} reports</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patient.diagnosticHistory.map((test) => (
                    <div key={test.id} className="p-5 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-900">{test.testName}</span>
                        <span className="text-xs font-medium text-slate-500 shrink-0">{test.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{test.summary}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                        <span>{test.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{test.radiologistOrLab}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{test.performedDate.slice(0, 16).replace('T', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">RM {test.costMYR}{test.radiationDoseMsv ? ` (${test.radiationDoseMsv} mSv)` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Clinical Encounters Panel */}
            {(activeSection === 'all' || activeSection === 'encounters') && (
              <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <span>Clinical Encounters</span>
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">{patient.encounters.length} visits</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {patient.encounters.map((enc) => (
                    <div key={enc.id} className="p-5 space-y-1.5">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-900">{enc.diagnosis}</span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">{enc.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{enc.clinicalNotes}</p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                        <span>{enc.hospitalName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{enc.department}</span>
                        <span aria-hidden="true">·</span>
                        <span>{enc.attendingDoctor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
