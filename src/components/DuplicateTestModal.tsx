import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, FileText, X } from 'lucide-react';
import { DiagnosticTest } from '../types/mediledger';

interface DuplicateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderedTestName: string;
  priorTest: DiagnosticTest;
  hoursElapsed: number;
  costSavedMYR: number;
  radiationSavedMsv: number;
  onAdoptPriorTest: (priorTest: DiagnosticTest) => void;
  onOverrideTest: (reason: string) => void;
}

export const DuplicateTestModal: React.FC<DuplicateTestModalProps> = ({
  isOpen,
  onClose,
  orderedTestName,
  priorTest,
  hoursElapsed,
  costSavedMYR,
  radiationSavedMsv,
  onAdoptPriorTest,
  onOverrideTest,
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="bg-white border border-amber-300 rounded-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 id="duplicate-modal-title" className="text-sm font-bold text-slate-950">
                  Duplicate Diagnostic Procedure Detected
                </h2>
                <p className="text-xs text-amber-900">
                  Matching scan was completed at another connected hospital {hoursElapsed} hours ago
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors shrink-0"
              aria-label="Close duplicate warning modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1">

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 divide-x divide-slate-200 border border-slate-200 rounded-xl bg-slate-50/70">
            <div className="p-4">
              <span className="text-xs font-medium text-slate-500 block">Estimated Cost Avoided</span>
              <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums mt-0.5 block">
                RM {costSavedMYR.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Prevents redundant billing</span>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-slate-500 block">Radiation Exposure Prevented</span>
              <span className="text-xl font-bold font-mono text-teal-800 tabular-nums mt-0.5 block">
                {radiationSavedMsv} mSv
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">~{Math.round(radiationSavedMsv * 30)} chest X-ray equivalents</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Attempted New Order (Sarawak General Hospital)</span>
                <span className="font-semibold text-amber-700">Pending Review</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {orderedTestName}
              </div>
            </div>

            <div className="p-4 bg-teal-50/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-teal-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Existing Verified Scan ({hoursElapsed}h ago)</span>
                </span>
                <span className="font-mono text-slate-500 tabular-nums">{priorTest.performedDate.slice(0, 10)}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {priorTest.testName}
              </div>
              <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 pt-1">
                <span>Facility: <strong className="font-medium text-slate-800">{priorTest.hospitalName}</strong></span>
                <span>Radiologist: <strong className="font-medium text-slate-800">{priorTest.radiologistOrLab}</strong></span>
              </div>
            </div>
          </div>

          {/* Radiology Findings Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>Prior Radiology Report</span>
              </span>
              <button
                type="button"
                onClick={() => setShowFullReport(!showFullReport)}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                {showFullReport ? 'Hide Verification Proof' : 'Show Verification Proof'}
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "{priorTest.summary}"
            </p>
            {showFullReport && (
              <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-200 space-y-1">
                <div>IPFS DICOM Hash: <span className="text-slate-800">ipfs://bafybeigdyrzt5sfp7udm7...992x</span></div>
                <div>L1 Verification Tx: <span className="text-slate-800">{priorTest.verifiedTxHash}</span></div>
              </div>
            )}
          </div>

          {/* Clinical Override Form */}
          {showOverrideInput && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label htmlFor="override-reason" className="text-xs font-semibold text-slate-900 block">
                Clinical Justification for Repeating Procedure
              </label>
              <textarea
                id="override-reason"
                rows={2}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Document acute clinical deterioration or surgical requirement..."
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowOverrideInput(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!overrideReason.trim()}
                  onClick={() => onOverrideTest(overrideReason)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  Confirm Override
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          {!showOverrideInput && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowOverrideInput(true)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors text-center"
              >
                Override & Re-order Anyway
              </button>
              
              <button
                type="button"
                onClick={() => onAdoptPriorTest(priorTest)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Use Existing Scan & Cancel Duplicate (Save RM {costSavedMYR})</span>
              </button>
            </div>
          )}

          </div>

        </div>
      </div>
    </div>
  );
};
