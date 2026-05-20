import { DiagnosticViewType } from '../types';
import { Bolt, Mail, Network, Search, Globe, ChevronRight } from 'lucide-react';

interface TopAppBarProps {
  currentView: DiagnosticViewType;
  onViewChange: (view: DiagnosticViewType) => void;
}

export default function TopAppBar({ currentView, onViewChange }: TopAppBarProps) {
  // Navigation tabs in header (matching screenshots)
  const navTabs: { id: DiagnosticViewType; label: string; icon: any; colorClass: string }[] = [
    { id: 'diagnostico', label: 'Diagnóstico', icon: Bolt, colorClass: 'bg-indigo-600/30 text-indigo-300' },
    { id: 'correo', label: 'Correo', icon: Mail, colorClass: 'bg-emerald-600/30 text-emerald-300' },
    { id: 'ping', label: 'Puertos & Ping', icon: Network, colorClass: 'bg-purple-600/30 text-purple-300' },
    { id: 'dns', label: 'DNS Checks', icon: Globe, colorClass: 'bg-blue-600/30 text-blue-300' },
    { id: 'seo', label: 'SEO Audit', icon: Search, colorClass: 'bg-rose-600/30 text-rose-300' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-brand-surface-low border-b border-brand-outline-variant shadow-lg">
      <div className="flex justify-between items-center w-full px-6 max-w-[1440px] mx-auto h-full">
        {/* LOGO & TITLE */}
        <div 
          onClick={() => onViewChange('diagnostico')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          {/* Chuck Norris logo element with a martial arts wheel style inside a Bolt */}
          <div className="bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 p-1.5 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/15">
            <Bolt className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-white flex items-center gap-1.5">
              Check Norris
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-surface-highest text-brand-secondary font-bold tracking-widest leading-none">
                Suite
              </span>
            </span>
          </div>
        </div>

        {/* TOP INTEGRATED HEADER NAVIGATION TAB BAR */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          {navTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = currentView === tab.id || 
                             (tab.id === 'ping' && (currentView === 'ping' || currentView === 'nslookup'));
            
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`group relative rounded-full px-3 lg:px-4 py-1.5 font-mono text-xs transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-brand-secondary/15 text-brand-secondary border-brand-secondary/40 shadow-[0_0_15px_rgba(78,222,163,0.25)] font-bold'
                    : 'text-brand-on-surface-variant hover:text-white hover:bg-brand-surface-high/60 border-transparent'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-brand-secondary' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span>{tab.label}</span>
                
                {/* Visual underline glow on active */}
                {isActive && (
                  <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] bg-brand-secondary rounded-full shadow-[0_0_4px_#4edea3]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT METADATA BUTTON & VERSION */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-surface-highest/60 rounded-full border border-brand-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary animate-ping" />
            <span className="text-[11px] font-mono font-bold text-brand-secondary uppercase tracking-wider">
              v1.1
            </span>
          </div>
          
          <button 
            type="button" 
            onClick={() => onViewChange('diagnostico')}
            className="p-2 text-brand-outline hover:text-white transition-colors bg-brand-surface-high/40 rounded-full border border-brand-outline-variant/20 hover:border-brand-outline-variant hover:bg-brand-surface-high/80"
            title="Tus Datos"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-primary/20 to-brand-secondary/20 border border-indigo-200/20 flex items-center justify-center">
              <span className="text-[10px] font-mono leading-none font-bold text-brand-primary text-center">
                CN
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
