import React from 'react';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Building2,
  Cpu,
  QrCode,
  Activity,
  Lock,
  Layers,
} from 'lucide-react';

interface ExhibitionPosterProps {
  onBack: () => void;
}

export const ExhibitionPoster: React.FC<ExhibitionPosterProps> = ({ onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-200/80 py-6 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      {/* Screen-only Poster Toolbar */}
      <div className="max-w-[1160px] mx-auto mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-teal-700" />
          <span>Back to MediLedger App</span>
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Borneo Blockchain Conference · A1 Exhibition Showcase Poster
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* A1 Portrait FYP Poster Sheet */}
      <article
        id="fyp-booth-poster"
        className="max-w-[1160px] mx-auto bg-white border border-slate-300 shadow-xl overflow-hidden print:shadow-none print:border-0 print:max-w-none print:w-full"
      >
        {/* 1. Poster Masthead Header */}
        <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white px-8 py-7 border-b-4 border-teal-500">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-widest text-teal-300 mb-3">
            <span>Borneo Blockchain Conference · Exhibition Showcase</span>
            <span>Cross-Hospital Healthcare Interoperability</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </span>
                <h1 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-white">
                  MediLedger: National Emergency Health Record Network
                </h1>
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed pl-[52px]">
                Eliminating hospital data silos with instant MyKad emergency access, encrypted Layer 2 FHIR storage, and Layer 1 cryptographic integrity.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Domain:</span>{' '}
              <strong className="text-white font-semibold">Emergency Medicine & Public HIS</strong>
            </div>
            <div>
              <span className="text-slate-400">Architecture:</span>{' '}
              <strong className="text-white font-semibold">Dual-Layer Ledger (L1 Trust + L2 Speed)</strong>
            </div>
            <div>
              <span className="text-slate-400">Standards:</span>{' '}
              <strong className="text-white font-semibold">MyKad Chip Auth · HL7 FHIR · PDPA 2010</strong>
            </div>
          </div>
        </header>

        {/* 2. Three-Column Academic / Exhibition Poster Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-6 md:p-7 bg-slate-50">
          
          {/* COLUMN 1: Problem, Solution, Target Users */}
          <div className="lg:col-span-4 space-y-5 flex flex-col">
            
            {/* 01. Problem Statement */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">01</span>
                  <span>Problem Statement</span>
                </h2>
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              </div>

              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">Fragmented Hospital Silos:</strong> Emergency doctors lack cross-hospital patient history when unconscious trauma patients arrive.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">Unknown Critical History:</strong> Life-threatening drug allergies, active medications, and past surgeries remain unknown at triage.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">High-Risk Decisions:</strong> Clinicians make urgent interventions with incomplete patient context.
                  </span>
                </li>
              </ul>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-red-50/60 border border-red-100 rounded-lg p-2.5 text-center">
                  <span className="text-base font-extrabold font-mono text-red-700 block">10–15%</span>
                  <span className="text-[11px] text-slate-700 leading-tight block mt-0.5">Global misdiagnosis rate</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">Duplicate</span>
                  <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">CT scans & lab tests common</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">Billions</span>
                  <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">Lost worldwide yearly</span>
                </div>
              </div>
            </section>

            {/* 02. Proposed Solution */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">02</span>
                  <span>Proposed Solution</span>
                </h2>
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                <img
                  src="/src/assets/images/mykad_smart_reader_1794481246873.jpg"
                  alt="MyKad smart-card reader authenticating emergency hospital access"
                  referrerPolicy="no-referrer"
                  className="w-full h-32 object-cover opacity-90"
                />
                <div className="px-3 py-2 bg-slate-900 text-white text-[11px] font-medium flex items-center justify-between gap-2">
                  <span className="whitespace-nowrap">MyKad Emergency Chip Auth</span>
                  <span className="font-mono text-teal-300 whitespace-nowrap">&lt; 1.5s Retrieval</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">One Lifelong Record:</strong> Shared national patient record platform following each citizen across all facilities.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">Secure Hospital API:</strong> Registered public and private hospitals connect without replacing existing HIS software.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900">Full Audit Accountability:</strong> Blockchain enforces consent rules and indelibly logs every emergency access event.
                  </span>
                </li>
              </ul>
            </section>

            {/* 03. Target Market & Users */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">03</span>
                  <span>Target Stakeholders</span>
                </h2>
                <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">Target Facilities</span>
                  <span className="font-semibold text-slate-900 text-right">Government & Specialist Hospitals</span>
                </div>
                <div className="py-2 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">Primary Buyers</span>
                  <span className="font-semibold text-slate-900 text-right">Ministry of Health & State Agencies</span>
                </div>
                <div className="pt-2 flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">End Users</span>
                  <span className="font-semibold text-slate-900 text-right">Doctors, Nurses & Hospital Admins</span>
                </div>
              </div>
            </section>

          </div>

          {/* COLUMN 2: Dual-Layer Architecture Diagram & Prototype Showcase */}
          <div className="lg:col-span-4 space-y-5 flex flex-col">
            
            {/* 04. Dual-Layer Blockchain Architecture */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">04</span>
                  <span>Dual-Layer System Architecture</span>
                </h2>
                <Layers className="w-4 h-4 text-teal-700 shrink-0" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Layer 1 blockchains are too slow for large clinical payloads and cannot expose personal data in plaintext. MediLedger separates <strong className="text-slate-900">off-chain encrypted storage (Layer 2)</strong> from <strong className="text-slate-900">on-chain cryptographic proof (Layer 1)</strong>.
              </p>

              {/* Clean Schematic Architecture Stack */}
              <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4">
                
                {/* Layer 0: Hospital Edge */}
                <div className="bg-white border border-slate-300 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">
                    <span className="whitespace-nowrap">Hospital Edge Nodes</span>
                    <span className="whitespace-nowrap">Secure REST API</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Sarawak General · HKL · Borneo MC · QEH KK · Miri
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Doctor taps patient MyKad chip to verify identity and trigger emergency record retrieval.
                  </div>
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-teal-800 py-0.5 whitespace-nowrap">
                  <span>↓ Encrypted Query</span>
                  <span className="text-slate-300">|</span>
                  <span>Verified Payload ↑</span>
                </div>

                {/* Layer 2 */}
                <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-teal-800 mb-1">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Cpu className="w-3.5 h-3.5 shrink-0" />
                      Layer 2 · Off-Chain
                    </span>
                    <span className="font-mono whitespace-nowrap">FHIR + IPFS</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Encrypted Clinical Payloads &amp; Imaging
                  </div>
                  <div className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                    Stores encrypted allergies, prescriptions, and CT/MRI summaries for sub-1.5s ER retrieval without bloating L1.
                  </div>
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-600 py-0.5 whitespace-nowrap">
                  <span>↓ Anchors Merkle Root</span>
                  <span className="text-slate-300">|</span>
                  <span>Checks Consent ↑</span>
                </div>

                {/* Layer 1 */}
                <div className="bg-slate-900 text-white rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-teal-300 mb-1">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      Layer 1 · Consortium Root
                    </span>
                    <span className="font-mono whitespace-nowrap">Immutable</span>
                  </div>
                  <div className="text-xs font-semibold text-white">
                    Integrity Hashes, Access Rules &amp; Audit Trail
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Hospitals verify record authenticity via L1 hash comparison; any tampering breaks verification immediately.
                  </div>
                </div>

              </div>
            </section>

            {/* 05. Platform Modules */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">05</span>
                  <span>Interactive Demo Modules</span>
                </h2>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 space-y-1">
                  <div className="font-semibold text-slate-900">A. Emergency Clinical Workstation</div>
                  <p className="text-slate-600 leading-relaxed">
                    Displays triage vitals, fatal Penicillin anaphylaxis warnings, surgical implants, and intercepts duplicate CT orders (saving <strong className="text-teal-800">RM 1,250</strong> &amp; <strong className="text-teal-800">7.8 mSv</strong> radiation).
                  </p>
                </div>
                <div className="py-2.5 space-y-1">
                  <div className="font-semibold text-slate-900">B. Citizen Health Passport</div>
                  <p className="text-slate-600 leading-relaxed">
                    Digital Health Card with MyKad biometric QR, emergency break-glass consent toggle, cross-hospital access audit table, and HL7 FHIR JSON export.
                  </p>
                </div>
                <div className="pt-2.5 space-y-1">
                  <div className="font-semibold text-slate-900">C. Network &amp; Ledger Console</div>
                  <p className="text-slate-600 leading-relaxed">
                    Real-time cross-hospital synchronization simulator, hospital node latency monitor, and SHA-256 block proof inspector.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* COLUMN 3: Market Opportunity, Benefits, Rollout Roadmap */}
          <div className="lg:col-span-4 space-y-5 flex flex-col">
            
            {/* 06. Market Opportunity (TAM / SAM / SOM) */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-teal-700">06</span>
                  <span>Malaysia HIS Market</span>
                </h2>
                <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">USD</span>
              </div>

              <div className="space-y-3">
                {/* TAM */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-slate-900">TAM · Malaysia HIS Market</span>
                    <span className="font-mono font-bold text-slate-950">USD 1.47B</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full w-full" />
                  </div>
                </div>

                {/* SAM */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-slate-900">SAM · Govt Hospitals Segment</span>
                    <span className="font-mono font-bold text-teal-800">USD 568M</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-700 rounded-full w-[39%]" />
                  </div>
                </div>

                {/* SOM */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-slate-900">SOM · 10% in 5 Years</span>
                    <span className="font-mono font-bold text-teal-700">USD 58.6M</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full w-[14%]" />
                  </div>
                </div>
              </div>
            </section>

            {/* 07. Key Benefits */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">07</span>
                  <span>Strategic Impact</span>
                </h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">No More Hospital Data Silos</div>
                  <p className="text-slate-600 mt-0.5">Unified continuity between East &amp; Peninsular Malaysia facilities.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">Tamper-Proof &amp; Traceable</div>
                  <p className="text-slate-600 mt-0.5">Cryptographic Merkle proofs prevent silent alteration and log every query.</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">Faster Diagnosis &amp; Lower Duplicate Costs</div>
                  <p className="text-slate-600 mt-0.5">Immediate allergy visibility and automated prevention of redundant imaging.</p>
                </div>
              </div>
            </section>

            {/* 08. Deployment Roadmap */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700">08</span>
                  <span>Deployment Roadmap</span>
                </h2>
              </div>

              <ol className="space-y-2.5 text-xs">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    P1
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Engage Ministry of Health</div>
                    <div className="text-slate-600">Align PDPA 2010 consent governance, MyKad integration &amp; HL7 FHIR schemas.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-teal-700 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    P2
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Pilot with Selected Hospitals</div>
                    <div className="text-slate-600">Run emergency department trials linking Kuching, Miri, Kota Kinabalu &amp; KL nodes.</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    P3
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Partner for Nationwide Rollout</div>
                    <div className="text-slate-600">Scale across Malaysia’s public hospital network and private specialist centres.</div>
                  </div>
                </li>
              </ol>
            </section>

            {/* Interactive Booth Callout */}
            <section className="bg-slate-900 text-white rounded-xl p-4 flex items-center gap-4 mt-auto">
              <div className="p-2 bg-white rounded-lg shrink-0">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
                  Live Prototype Available
                </div>
                <div className="font-bold text-white text-sm">
                  Try the MediLedger Demo at Booth
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Test MyKad emergency triage unlock, duplicate CT prevention &amp; L1/L2 verification.
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* 3. Poster Footer Strip */}
        <footer className="bg-slate-950 text-slate-400 px-8 py-3.5 text-[11px] flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
          <span className="text-slate-200 font-medium">
            MediLedger · National Cross-Hospital Emergency EHR Platform
          </span>
          <span>
            Borneo Blockchain Conference Exhibitor Material · Layer 1 Consortium Root + Layer 2 Encrypted FHIR
          </span>
        </footer>
      </article>
    </div>
  );
};
