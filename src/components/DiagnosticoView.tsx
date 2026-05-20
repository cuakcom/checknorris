import { useState, useRef, useEffect } from 'react';
import { DiagnosticResult, LogEntry } from '../types';
import { generateDiagnosticResult, getSimulatedLogSteps } from '../utils';
import LiveLogTerminal from './LiveLogTerminal';
import { 
  Globe, 
  Settings, 
  Server, 
  Lock, 
  Shuffle, 
  Cpu, 
  FileText, 
  Activity, 
  ShieldAlert, 
  History, 
  Flame,
  Search
} from 'lucide-react';

interface DiagnosticoViewProps {
  onAddHistory: (domain: string, view: 'diagnostico' | 'dns' | 'correo' | 'seo', score?: number) => void;
  onOpenHistory: () => void;
}

export default function DiagnosticoView({ onAddHistory, onOpenHistory }: DiagnosticoViewProps) {
  // Input domain state
  const [domainInput, setDomainInput] = useState('cuak.com');
  // Checkbox configuration
  const [modules, setModules] = useState({
    dns: true,
    ssl: true,
    redirects: true,
    ports: false,
    whois: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosticResult | null>(null);
  const [activeLogs, setActiveLogs] = useState<LogEntry[]>([]);

  // Automatically execute a default load of "cuak.com" so the screen is already beautifully filled!
  useEffect(() => {
    executeAnalysis(true);
  }, []);

  const executeAnalysis = async (isInitial = false) => {
    if (isLoading) return;
    
    const targetDomain = domainInput.trim() || 'cuak.com';
    setIsLoading(true);
    setActiveLogs([]);
    
    // Create procedurally generated steps based on current configuration
    const steps = getSimulatedLogSteps(targetDomain, 'diagnostico');
    
    // We will stream log steps with custom incremental logic
    let tempLogs: LogEntry[] = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      // Skip if module is disabled
      if (step.message.toLowerCase().includes('dns') && !modules.dns) continue;
      if (step.message.toLowerCase().includes('ssl') && !modules.ssl) continue;
      if (step.message.toLowerCase().includes('redirec') && !modules.redirects) continue;
      if (step.message.toLowerCase().includes('puerto') && !modules.ports) continue;
      if (step.message.toLowerCase().includes('whois') && !modules.whois) continue;
      
      if (!isInitial) {
        // Only delay if it is user-initiated to provide an awesome interactive look!
        await new Promise((resolve) => setTimeout(resolve, step.delay));
      }
      
      const newLog: LogEntry = {
        id: `${Date.now()}-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        type: step.type as any,
        message: step.message,
      };
      
      tempLogs = [...tempLogs, newLog];
      setActiveLogs(tempLogs);
    }
    
    // Complete calculation
    const finalData = generateDiagnosticResult(targetDomain);
    setAnalysisResult(finalData);
    setIsLoading(false);
    
    if (!isInitial) {
      onAddHistory(targetDomain, 'diagnostico', finalData.seoScore);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header action area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-indigo-400" />
            Web Diagnostics
          </h1>
          <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
            Analiza el rendimiento, seguridad y configuración de tu dominio en tiempo real con la suite de escaneo Check Norris.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenHistory}
            className="bg-brand-surface-highest/80 hover:bg-brand-surface-highest text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-brand-outline-variant/30 hover:border-brand-outline-variant transition-colors text-xs font-mono select-none shadow-md"
          >
            <History className="w-4 h-4 text-brand-primary" />
            <span>HISTORIAL</span>
          </button>
        </div>
      </div>

      {/* Main Control Bento Panel */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border-brand-primary/10 glow-primary relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#4edea3]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
          {/* Domain Input Field */}
          <div className="xl:col-span-5">
            <label className="block font-mono text-xs uppercase tracking-widest text-brand-secondary mb-2.5 font-bold">
              INTRODUCIR DOMINIO / HOST
            </label>
            <div className="relative group">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && executeAnalysis()}
                className="w-full bg-brand-surface-lowest border border-brand-outline-variant/60 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-4.5 px-5 pl-12 text-lg text-white font-bold tracking-wide placeholder:text-slate-600 outline-none transition-all"
                placeholder="ejemplo.com"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-primary group-hover:text-slate-400 transition-colors" />
            </div>
          </div>

          {/* Action Analizar Button */}
          <div className="xl:col-span-3">
            <button
              onClick={() => executeAnalysis()}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-red-600 to-rose-800 hover:from-red-500 hover:to-rose-700 active:scale-95 text-white font-bold text-base py-4.5 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl shadow-red-950/40 select-none group border border-red-500/20 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none`}
            >
              <Flame className={`w-5 h-5 ${isLoading ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
              <span className="tracking-widest font-sans font-bold">
                {isLoading ? 'ANALIZANDO...' : 'ANALIZAR'}
              </span>
            </button>
          </div>

          {/* Indicators status */}
          <div className="xl:col-span-4 flex items-center gap-3 bg-brand-surface-low/60 rounded-xl p-3 border border-brand-outline-variant/20 h-[56px] self-end xl:mb-[1px]">
            <span className={`w-2.5 h-2.5 rounded-full block animate-pulse ${isLoading ? 'bg-amber-400' : 'bg-brand-secondary shadow-[0_0_8px_#4edea3]'}`} />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase text-[#8d90a0]">SISTEMA DE ANÁLISIS</span>
              <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                {isLoading ? 'EJECUTANDO CRAWLER...' : 'SISTEMA LISTO'}
              </span>
            </div>
          </div>
        </div>

        {/* Modules Config Grid (Toggles checkboxes matching Screenshot 1) */}
        <div className="mt-6 pt-5 border-t border-brand-outline-variant/20">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5 select-none">
            <Settings className="w-4.5 h-4.5 text-brand-primary animate-spin" style={{ animationDuration: '8s' }} />
            MÓDULOS ACTIVOS DE COMPROBACIÓN
          </h4>
          
          <div className="flex flex-wrap gap-3.5 text-xs text-slate-200">
            {/* DNS Check */}
            <label className="flex items-center gap-2 bg-brand-surface-low/50 border border-brand-outline-variant/30 hover:border-brand-primary/40 p-2.5 rounded-xl cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={modules.dns}
                onChange={() => setModules({ ...modules, dns: !modules.dns })}
                className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-brand-primary focus:ring-brand-primary/30 h-4 w-4"
              />
              <Server className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono">DNS Checks</span>
            </label>

            {/* SSL Check */}
            <label className="flex items-center gap-2 bg-brand-surface-low/50 border border-brand-outline-variant/30 hover:border-brand-primary/40 p-2.5 rounded-xl cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={modules.ssl}
                onChange={() => setModules({ ...modules, ssl: !modules.ssl })}
                className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-brand-secondary focus:ring-brand-secondary/30 h-4 w-4"
              />
              <Lock className="w-3.5 h-3.5 text-brand-secondary" />
              <span className="font-mono">SSL / TLS Certificate</span>
            </label>

            {/* Redirects Check */}
            <label className="flex items-center gap-2 bg-brand-surface-low/50 border border-brand-outline-variant/30 hover:border-brand-primary/40 p-2.5 rounded-xl cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={modules.redirects}
                onChange={() => setModules({ ...modules, redirects: !modules.redirects })}
                className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-amber-400 focus:ring-amber-400/30 h-4 w-4"
              />
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">Canonical Redirects</span>
            </label>

            {/* Ports Scan Check */}
            <label className="flex items-center gap-2 bg-brand-surface-low/50 border border-brand-outline-variant/30 hover:border-brand-primary/40 p-2.5 rounded-xl cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={modules.ports}
                onChange={() => setModules({ ...modules, ports: !modules.ports })}
                className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-rose-400 focus:ring-rose-400/30 h-4 w-4"
              />
              <Cpu className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono">Port Scanner (80/443/*)</span>
            </label>

            {/* WHOIS Check */}
            <label className="flex items-center gap-2 bg-brand-surface-low/50 border border-brand-outline-variant/30 hover:border-brand-primary/40 p-2.5 rounded-xl cursor-pointer select-none transition-all">
              <input
                type="checkbox"
                checked={modules.whois}
                onChange={() => setModules({ ...modules, whois: !modules.whois })}
                className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-sky-400 focus:ring-sky-400/30 h-4 w-4"
              />
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono">WHOIS & Registrar</span>
            </label>
          </div>
        </div>
      </div>

      {/* Result Metrics Grid and Logs Split Page */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Diagnostic Metrics Bento Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Response Time Card */}
              <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-primary/30 transition-all shadow-md group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 scroll-smooth group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#8d90a0]/80 uppercase block">Response Latency</span>
                  <span className="font-sans text-2xl font-bold text-white tracking-tight">
                    {analysisResult.responseTime} ms
                  </span>
                </div>
              </div>

              {/* SSL Status Card */}
              <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-primary/30 transition-all shadow-md group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                  analysisResult.sslValid ? 'bg-emerald-500/10 text-brand-secondary' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#8d90a0]/80 uppercase block">SSL/TLS Security</span>
                  <span className={`font-sans text-2xl font-bold tracking-tight ${
                    analysisResult.sslValid ? 'text-brand-secondary' : 'text-rose-400'
                  }`}>
                    {analysisResult.sslValid ? 'VÁLIDO' : 'EXPIRADO'}
                  </span>
                </div>
              </div>

              {/* SEO Score Score */}
              <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-primary/30 transition-all shadow-md group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#8d90a0]/80 uppercase block">SEO Health Index</span>
                  <span className="font-sans text-2xl font-bold text-white tracking-tight">
                    {analysisResult.seoScore} / 100
                  </span>
                </div>
              </div>

              {/* Server Host IP Card */}
              <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5 rounded-2xl flex items-center gap-4 hover:border-brand-primary/30 transition-all shadow-md group">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-300 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-[#8d90a0]/80 uppercase block">Target IPv4 Host</span>
                  <span className="font-mono text-base font-bold text-sky-300 tracking-tight block truncate pr-1">
                    {analysisResult.ipAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* WHOIS Detail Container Card */}
            <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5.5 rounded-2xl space-y-4 shadow-md">
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                Información del Registro (WHOIS)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-brand-surface-lowest/40 p-2.5 rounded-lg border border-brand-outline-variant/10">
                  <span className="text-[#8d90a0] block text-[10px] mb-0.5">REGISTRADOR</span>
                  <span className="text-slate-200 font-bold break-all">{analysisResult.whois.registrar}</span>
                </div>
                <div className="bg-brand-surface-lowest/40 p-2.5 rounded-lg border border-brand-outline-variant/10">
                  <span className="text-[#8d90a0] block text-[10px] mb-0.5">FECHA CREACIÓN</span>
                  <span className="text-slate-200">{analysisResult.whois.created}</span>
                </div>
                <div className="bg-brand-surface-lowest/40 p-2.5 rounded-lg border border-brand-outline-variant/10 col-span-2 md:col-span-1">
                  <span className="text-[#8d90a0] block text-[10px] mb-0.5">FECHA EXPIRACIÓN</span>
                  <span className="text-amber-400 font-bold">{analysisResult.whois.expires}</span>
                </div>
              </div>
            </div>

            {/* Open Ports List Card */}
            <div className="bg-brand-surface-low/60 border border-brand-outline-variant/15 p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400">
                  Servicios de Red & Puertos Abiertos
                </h4>
                <p className="text-[11px] text-slate-500 font-sans">
                  Puertos estándar de Internet expuestos sobre la IP analizada.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-end">
                {analysisResult.openPorts.map((port) => (
                  <span
                    key={port}
                    className="px-2.5 py-1 rounded bg-[#4edea3]/10 text-brand-secondary border border-[#4edea3]/25 font-mono text-[11px] font-bold"
                  >
                    PORT {port}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right LiveLog terminal Column */}
          <div className="lg:col-span-5">
            <LiveLogTerminal logs={activeLogs} title={`Live Log: ${analysisResult.domain}`} />
          </div>
        </div>
      )}

      {/* Decorative Brand Promo banner at bottom matching screens */}
      <div className="glass-panel rounded-2xl overflow-hidden relative group border border-brand-outline-variant/20 shadow-lg">
        {/* Abstract high density data rack visualization (free high-quality URL image matching screenshots) */}
        <img 
          alt="Technical Network Room"
          referrerPolicy="no-referrer"
          className="w-full h-44 object-cover opacity-25 group-hover:opacity-35 transition-all duration-700 select-none scale-100 group-hover:scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR2sNtqpxobXDibOXsJqcnLi-TzzlyFSROgW7Z4C4S377xNDBl6wBZBVv6cdrFULp8_37ahN64i6V2Jr9Wp23WGR8RL-mGQCEHVnJwZaItr5atV27azglwuU0GltUmn4YMwH5R9fP-f49Ws9DBqxihndnKqdlSqgoozjq36NRxJi8j7QYHMn6XJS6V9PBE9HzpAHUGSdvQkmytA-6n2tuEbi9gfl_gC1qouQCGDSEAM1EuhqvmzHfYFkBYr3xohhHYiIf9KBGV5pk"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest via-brand-surface-lowest/70 to-transparent flex items-end p-6">
          <div className="flex justify-between items-end w-full">
            <div>
              <span className="font-mono text-[10px] text-brand-primary uppercase tracking-[0.25em] mb-1 block font-bold">
                Check Norris Engine v1.1
              </span>
              <h2 className="font-sans font-bold text-xl text-white tracking-tight">
                Análisis Preciso sin Limitaciones de Tráfico
              </h2>
            </div>
            
            <div className="flex gap-1">
              <span className="w-1 h-6 bg-[#b4c5ff] rounded-full animate-pulse" />
              <span className="w-1 h-10 bg-[#4edea3] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span className="w-1 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
