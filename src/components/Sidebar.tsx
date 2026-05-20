import { DiagnosticViewType } from '../types';
import { 
  Globe, 
  SearchCode, 
  Mail, 
  Server, 
  Terminal, 
  LineChart, 
  Database,
  Lock,
  Network
} from 'lucide-react';

interface SidebarProps {
  currentView: DiagnosticViewType;
  onViewChange: (view: DiagnosticViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  // Sidebar items mapped from the screenshots
  const navItems = [
    { id: 'diagnostico', label: 'Web Diagnostics', icon: Globe, badge: 'Main' },
    { id: 'seo', label: 'Auditoría SEO', icon: SearchCode, badge: null },
    { id: 'correo', label: 'Analizar Correo', icon: Mail, badge: null },
    { id: 'dns', label: 'Diagnóstico DNS', icon: Server, badge: 'Live' },
    { id: 'ping', label: 'Ping / Puertos', icon: Network, badge: null },
    { id: 'nslookup', label: 'NSLookup CLI', icon: Database, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col border-r border-brand-outline-variant bg-brand-surface-low w-64 pt-20 h-screen fixed left-0 top-0 select-none z-40">
      {/* Category header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-[#8d90a0]/60">
          Herramientas
        </h2>
        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary ring-4 ring-brand-secondary/20 block animate-pulse" />
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 space-y-1 py-2 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as DiagnosticViewType)}
              className={`w-full text-left py-2.5 px-4 rounded-xl flex items-center gap-3.5 transition-all duration-300 relative group font-sans ${
                isActive
                  ? 'text-brand-secondary font-bold bg-brand-secondary/10 border-l-4 border-brand-secondary scale-[1.02]'
                  : 'text-[#c3c6d7] hover:text-white hover:bg-white/[0.04] border-l-4 border-transparent'
              }`}
            >
              <IconComponent className={`w-[18px] h-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-brand-secondary' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              <span className="text-[14px] flex-1 truncate">{item.label}</span>
              
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive 
                    ? 'bg-brand-secondary/20 text-brand-secondary' 
                    : 'bg-brand-surface-high text-brand-outline'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Decorative Brand footer inside sidebar */}
      <div className="p-4 bg-brand-surface-lowest/40 border-t border-brand-outline-variant/30 text-center">
        <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-slate-500">
          <Lock className="w-3 h-3 text-brand-outline/60" />
          <span>Security Level:</span>
          <span className="text-[#4edea3] font-bold">MIL-SPEC</span>
        </div>
      </div>
    </aside>
  );
}
