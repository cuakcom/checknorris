import { useState, useEffect } from 'react';
import { DiagnosticViewType, DomainHistoryItem } from './types';
import TopAppBar from './components/TopAppBar';
import Sidebar from './components/Sidebar';
import HistorialModal from './components/HistorialModal';

// Views
import DiagnosticoView from './components/DiagnosticoView';
import CorreoView from './components/CorreoView';
import DNSView from './components/DNSView';
import SEOView from './components/SEOView';
import PingView from './components/PingView';
import NSLookupView from './components/NSLookupView';

// Icons for responsive mobile bottom bar (matching Screenshot 6)
import { Globe, SearchCode, Mail, Server, Settings } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<DiagnosticViewType>('diagnostico');
  const [history, setHistory] = useState<DomainHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load audit history from LocalStorage if active
  useEffect(() => {
    try {
      const saved = localStorage.getItem('check_norris_audit_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error fetching search history from LocalStorage', err);
    }
  }, []);

  // Update audits history handler
  const addHistoryItem = (domain: string, view: 'diagnostico' | 'dns' | 'correo' | 'seo', score?: number) => {
    const newItem: DomainHistoryItem = {
      id: `history-${view}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      domain: domain.trim(),
      timestamp: new Date().toISOString(),
      score,
      viewType: view
    };

    setHistory((prev) => {
      // Avoid duplicate targets on top of the list
      const filtered = prev.filter(item => !(item.domain === domain && item.viewType === view));
      const updated = [newItem, ...filtered].slice(0, 30); // limit to 30 histories
      localStorage.setItem('check_norris_audit_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('check_norris_audit_history');
  };

  // Direct load check when selecting item in history
  const handleSelectHistoryItem = (domain: string, viewType: string) => {
    setCurrentView(viewType as DiagnosticViewType);
  };

  // Render view router based on core switcher selection
  const renderActiveView = () => {
    switch (currentView) {
      case 'correo':
        return <CorreoView onAddHistory={addHistoryItem} />;
      case 'dns':
        return (
          <DNSView 
            onAddHistory={addHistoryItem} 
            onOpenHistory={() => setIsHistoryOpen(true)}
            onSwitchView={setCurrentView}
          />
        );
      case 'seo':
        return <SEOView onAddHistory={addHistoryItem} />;
      case 'ping':
        return <PingView />;
      case 'nslookup':
        return <NSLookupView />;
      case 'diagnostico':
      default:
        return (
          <DiagnosticoView 
            onAddHistory={addHistoryItem} 
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface-lowest flex flex-col antialiased selection:bg-brand-primary selection:text-brand-on-primary">
      {/* Top Header Section */}
      <TopAppBar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Side Navigation Drawer (hidden on mobile) */}
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Content Section Container */}
        <main className="flex-1 lg:ml-64 pt-20 px-4 md:px-8 pb-24 md:pb-12 max-w-[1440px] mx-auto w-full transition-all duration-300">
          
          {/* Main Visual views wrapper */}
          <div className="py-2">
            {renderActiveView()}
          </div>

          {/* Page footer elements */}
          <footer className="mt-12 pt-6 border-t border-brand-outline-variant/20 text-center pb-6">
            <p className="text-[#8d90a0] font-mono text-xs opacity-60">
              © {new Date().getFullYear()} Check Norris Diagnostic Suite v1.1. Todos los derechos reservados.
            </p>
          </footer>
        </main>
      </div>

      {/* MOBILE RESPONSIVE BOTTOM TOOL NAV (Visible on small screens, matching Screenshot 6 & 7) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-surface-low border-t border-brand-outline-variant/30 flex items-center justify-around px-4 z-50 shadow-2xl backdrop-blur-md bg-opacity-95">
        <button
          onClick={() => setCurrentView('diagnostico')}
          className={`flex flex-col items-center gap-1 transition-all group ${
            currentView === 'diagnostico' ? 'text-brand-secondary scale-105' : 'text-[#8d90a0] hover:text-[#dae2fd]'
          }`}
        >
          <Globe className="w-5 h-5" />
          <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider">Web</span>
        </button>

        <button
          onClick={() => setCurrentView('seo')}
          className={`flex flex-col items-center gap-1 transition-all group ${
            currentView === 'seo' ? 'text-brand-secondary scale-105' : 'text-[#8d90a0] hover:text-[#dae2fd]'
          }`}
        >
          <SearchCode className="w-5 h-5" />
          <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider">SEO</span>
        </button>

        <button
          onClick={() => setCurrentView('correo')}
          className={`flex flex-col items-center gap-1 transition-all group ${
            currentView === 'correo' ? 'text-emerald-400 scale-105' : 'text-[#8d90a0] hover:text-[#dae2fd]'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider">Correo</span>
        </button>

        <button
          onClick={() => setCurrentView('dns')}
          className={`flex flex-col items-center gap-1 transition-all group ${
            currentView === 'dns' ? 'text-blue-400 scale-105' : 'text-[#8d90a0] hover:text-[#dae2fd]'
          }`}
        >
          <Server className="w-5 h-5" />
          <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider">DNS</span>
        </button>

        <button
          onClick={() => setIsHistoryOpen(true)}
          className="flex flex-col items-center gap-1 text-[#8d90a0] hover:text-white transition-all group"
        >
          <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-wider">Historial</span>
        </button>
      </nav>

      {/* History Manager Overlay Modal Drawer */}
      <HistorialModal 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSelectHistoryItem}
        onClear={clearHistory}
      />
    </div>
  );
}
