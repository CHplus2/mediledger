import React from 'react';
import { Activity, CreditCard } from 'lucide-react';

interface NavbarProps {
  activeTab: 'doctor' | 'citizen' | 'network';
  setActiveTab: (tab: 'doctor' | 'citizen' | 'network') => void;
  onOpenScanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('doctor')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md py-1"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            MediLedger
          </span>
        </button>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium h-full" aria-label="Primary navigation">
          <button
            type="button"
            onClick={() => setActiveTab('doctor')}
            className={`h-full flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'doctor'
                ? 'border-teal-700 text-slate-950 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Clinical Workstation
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            className={`h-full flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'citizen'
                ? 'border-teal-700 text-slate-950 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Citizen Health Portal
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('network')}
            className={`h-full flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'network'
                ? 'border-teal-700 text-slate-950 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-950'
            }`}
          >
            Network & Ledger
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Scan MyKad</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Strip */}
      <nav className="md:hidden flex items-center justify-around px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-medium" aria-label="Mobile navigation">
        <button
          type="button"
          onClick={() => setActiveTab('doctor')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap ${
            activeTab === 'doctor' ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200' : 'text-slate-600'
          }`}
        >
          Clinical EHR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('citizen')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap ${
            activeTab === 'citizen' ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200' : 'text-slate-600'
          }`}
        >
          Citizen Portal
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('network')}
          className={`py-1 px-2.5 rounded-md whitespace-nowrap ${
            activeTab === 'network' ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200' : 'text-slate-600'
          }`}
        >
          Network & Ledger
        </button>
      </nav>
    </header>
  );
};
