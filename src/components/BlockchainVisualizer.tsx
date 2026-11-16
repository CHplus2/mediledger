import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Building2,
  Database,
  ChevronDown,
} from 'lucide-react';
import { HospitalNode, BlockchainBlock, AccessActionType } from '../types/mediledger';
import networkHubImg from '../assets/images/mediledger_network_hub_1794481247421.jpg';

interface BlockchainVisualizerProps {
  hospitals: HospitalNode[];
  blocks: BlockchainBlock[];
  onTriggerBlockSimulation: () => void;
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

export const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({
  hospitals,
  blocks,
  onTriggerBlockSimulation,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(blocks[0] || null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'explorer' | 'nodes'>('architecture');
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const filteredBlocks = filterAction === 'ALL'
    ? blocks
    : blocks.filter((b) => b.action === filterAction);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 550);
    setTimeout(() => setSimStep(3), 1100);
    setTimeout(() => {
      setSimStep(4);
      onTriggerBlockSimulation();
      setTimeout(() => {
        setIsSimulating(false);
        setSimStep(0);
      }, 900);
    }, 1650);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Console Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-950 tracking-tight">
            Network & Ledger Architecture
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Dual-layer clinical consensus: Layer 2 handles high-speed encrypted patient records while Layer 1 secures access rules and integrity hashes.
          </p>
        </div>

        <button
          type="button"
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-60 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Syncing Hospital Nodes...' : 'Simulate Cross-Hospital Sync'}</span>
        </button>
      </div>

      {/* Segmented Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium max-w-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'architecture' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          System Architecture
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('explorer')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'explorer' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Block Explorer ({blocks.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 py-2 px-3 rounded-md transition-all text-center whitespace-nowrap ${
            activeTab === 'nodes' ? 'bg-white text-slate-950 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hospital Nodes ({hospitals.length})
        </button>
      </div>

      {/* TAB 1: SYSTEM ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">

          {/* Live Simulation Status Banner */}
          {isSimulating && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-teal-700 border-t-transparent animate-spin shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-teal-950">Cross-Hospital State Synchronization</div>
                  <div className="text-teal-800 mt-0.5">
                    {simStep === 1 && 'Step 1 of 4: Sarawak General Hospital queries patient MyKad cryptographic hash.'}
                    {simStep === 2 && 'Step 2 of 4: Layer 2 Rollup aggregates encrypted clinical records from HKL and Borneo Medical Centre.'}
                    {simStep === 3 && 'Step 3 of 4: Zero-knowledge consent proof verified against Layer 1 smart contract.'}
                    {simStep === 4 && 'Step 4 of 4: Access block committed to the immutable national audit ledger.'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-teal-800 font-medium shrink-0">
                Latency: 1.2s
              </span>
            </div>
          )}

          {/* Symmetrical 3-Column Architecture Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

            {/* Tier 1: Clinical Edge */}
            <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-teal-700">
                  01. Clinical Edge
                </span>
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div className="pt-4 pb-4 lg:min-h-[5.75rem]">
                <h2 className="text-base font-bold text-slate-900">Hospital Edge Nodes</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Connected public and private hospitals across Sarawak, Sabah, and Kuala Lumpur.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                <div className="py-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">MyKad Chip Integration</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Emergency staff tap the patient MyKad on standard smart-card readers to verify identity and request record decryption.
                  </p>
                </div>
                <div className="pt-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">Eliminates Data Silos</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Patient allergies, surgeries, and imaging follow the citizen nationwide rather than staying locked inside one vendor HIS.
                  </p>
                </div>
              </div>
            </article>

            {/* Tier 2: Layer 2 Rollup */}
            <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-teal-700">
                  02. Layer 2 Rollup
                </span>
                <Cpu className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div className="pt-4 pb-4 lg:min-h-[5.75rem]">
                <h2 className="text-base font-bold text-slate-900">Encrypted Off-Chain Storage</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  High-throughput FHIR and DICOM storage designed for urgent emergency room speed.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                <div className="py-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">Sub-Second Trauma Retrieval</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Because Layer 1 chains are too slow for medical files, Layer 2 serves encrypted records and scans in under 1.5 seconds.
                  </p>
                </div>
                <div className="pt-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">Protected Health Privacy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personal medical details stay encrypted off-chain and are never exposed in plaintext on public blockchain explorers.
                  </p>
                </div>
              </div>
            </article>

            {/* Tier 3: Layer 1 Settlement */}
            <article className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-teal-700">
                  03. Layer 1 Settlement
                </span>
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div className="pt-4 pb-4 lg:min-h-[5.75rem]">
                <h2 className="text-base font-bold text-slate-900">Consortium Trust Anchor</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Immutable smart-contract layer governing access control and cryptographic proofs.
                </p>
              </div>

              <div className="divide-y divide-slate-100 border-t border-slate-100">
                <div className="py-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">Tamper-Proof Hash Roots</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Layer 1 anchors Merkle hashes of every Layer 2 record. Any unauthorized alteration breaks verification immediately.
                  </p>
                </div>
                <div className="pt-3.5 space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900">Permanent Audit Trail</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enforces citizen consent policies and records every emergency break-glass access event across all hospitals.
                  </p>
                </div>
              </div>
            </article>

          </div>

          {/* Network Diagram Banner */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative shadow-xs">
            <img
              src={networkHubImg}
              alt="MediLedger cross-hospital data network diagram"
              referrerPolicy="no-referrer"
              className="w-full h-56 md:h-64 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs font-semibold text-teal-300">
                National Interoperability Topology
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Unified Cross-Hospital Consensus Ring
              </h3>
              <p className="text-xs text-slate-200 max-w-2xl mt-1 leading-relaxed">
                Public and private hospitals exchange encrypted clinical payloads over Layer 2 channels while verifying cryptographic integrity and patient consent on Layer 1.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: BLOCK EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <label htmlFor="filter-action" className="text-xs font-medium text-slate-600">
                  Filter Event:
                </label>
                <div className="relative">
                  <select
                    id="filter-action"
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 text-xs font-medium text-slate-900 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
                  >
                    <option value="ALL">All Events</option>
                    <option value="EMERGENCY_MYKAD_OVERRIDE">Emergency MyKad Access</option>
                    <option value="DUPLICATE_TEST_PREVENTED">Duplicate Scan Prevented</option>
                    <option value="NEW_CLINICAL_NOTE_MINTED">Clinical Record Added</option>
                    <option value="ROUTINE_OUTPATIENT_CONSULT">Outpatient Consultation</option>
                    <option value="PRESCRIPTION_ADDED">Prescription Issued</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                </div>
              </div>

              <span className="text-xs text-slate-500 tabular-nums">
                {filteredBlocks.length} blocks displayed · Click any row to inspect proof
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3 whitespace-nowrap">Block</th>
                    <th className="px-6 py-3 whitespace-nowrap">Time (UTC)</th>
                    <th className="px-6 py-3 whitespace-nowrap">Event</th>
                    <th className="px-6 py-3">Hospital Node</th>
                    <th className="px-6 py-3">Clinician</th>
                    <th className="px-6 py-3 whitespace-nowrap">Block Hash</th>
                    <th className="px-6 py-3 text-right whitespace-nowrap">L1 Anchor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBlocks.map((b) => (
                    <tr
                      key={b.blockNumber}
                      onClick={() => setSelectedBlock(b)}
                      className={`cursor-pointer transition-colors ${
                        selectedBlock?.blockNumber === b.blockNumber
                          ? 'bg-teal-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-3.5 font-mono font-semibold text-teal-800 tabular-nums whitespace-nowrap">
                        #{b.blockNumber}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {b.timestamp.slice(11, 19)}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                        {ACTION_LABELS[b.action] || b.action}
                      </td>
                      <td className="px-6 py-3.5 text-slate-700 truncate max-w-[200px]">
                        {b.hospitalName}
                      </td>
                      <td className="px-6 py-3.5 text-slate-700 whitespace-nowrap">
                        {b.actorName}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                        {b.blockHash.slice(0, 12)}...
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-teal-700 tabular-nums whitespace-nowrap">
                        {b.l1AnchorTx.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Block Inspector */}
          {selectedBlock && (
            <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-700" />
                  <span>Block #{selectedBlock.blockNumber} Cryptographic Proof</span>
                </h2>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  Gas Used: {selectedBlock.gasUsed.toLocaleString()} units
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Block Hash (SHA-256)</span>
                  <span className="font-mono text-slate-800 break-all">{selectedBlock.blockHash}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Merkle Root</span>
                  <span className="font-mono text-slate-800 break-all">{selectedBlock.merkleRoot}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Parent Hash</span>
                  <span className="font-mono text-slate-600 break-all">{selectedBlock.previousHash}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Patient Pseudonym Hash</span>
                  <span className="font-mono text-slate-600 break-all">{selectedBlock.patientHash}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">Audit Summary</span>
                <p className="leading-relaxed">{selectedBlock.details}</p>
              </div>
            </section>
          )}

        </div>
      )}

      {/* TAB 3: HOSPITAL VALIDATOR NODES */}
      {activeTab === 'nodes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hospitals.map((h) => (
            <article
              key={h.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{h.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {h.state} · {h.tier}
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 shrink-0">
                  Online
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Peer ID</span>
                  <span className="font-mono text-slate-800 truncate block mt-0.5">{h.nodeIpfsPeerId}</span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Latency</span>
                  <span className="font-mono font-semibold text-teal-800 tabular-nums block mt-0.5">{h.latencyMs} ms</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-slate-500 block">Synced Records</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums block mt-0.5">
                    {h.verifiedRecordsCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
