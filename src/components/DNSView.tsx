import { useState, useEffect } from 'react';
import { DiagnosticResult, LogEntry } from '../types';
import { generateDiagnosticResult, getSimulatedLogSteps } from '../utils';
import LiveLogTerminal from './LiveLogTerminal';
import { 
  Globe, 
  MapPin, 
  History, 
  Search, 
  Rocket, 
  Settings, 
  Activity, 
  ArrowRight,
  Shield, 
  Terminal, 
  Layers, 
  Compass, 
  Server,
  FileText
} from 'lucide-react';

interface DNSViewProps {
  onAddHistory: (domain: string, view: 'diagnostico' | 'dns' | 'correo' | 'seo', score?: number) => void;
  onOpenHistory: () => void;
  onSwitchView: (view: 'diagnostico' | 'correo' | 'dns' | 'seo' | 'ping' | 'nslookup') => void;
}

export default function DNSView({ onAddHistory, onOpenHistory, onSwitchView }: DNSViewProps) {
  const [domainValue, setDomainValue] = useState('cuak.com');
  const [allChecked, setAllChecked] = useState(true);
  
  const [records, setRecords] = useState({
    mx: true,
    a: true,
    ns: true,
    txt: true,
    cname: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    runDNSAnalysis(true);
  }, []);

  const handleToggleAll = (val: boolean) => {
    setAllChecked(val);
    setRecords({
      mx: val,
      a: val,
      ns: val,
      txt: val,
      cname: val,
    });
  };

  const handleRecordToggle = (key: keyof typeof records) => {
    const updated = { ...records, [key]: !records[key] };
    setRecords(updated);
    
    // Check if all are active
    const allActive = Object.values(updated).every(v => v);
    setAllChecked(allActive);
  };

  const runDNSAnalysis = async (isInitial = false) => {
    if (isLoading) return;

    const target = domainValue.trim() || 'cuak.com';
    setIsLoading(true);
    setLogs([]);

    const steps = getSimulatedLogSteps(target, 'dns');
    let tempLogs: LogEntry[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      // Filter out log steps based on unchecked records
      if (step.message.includes('MX') && !records.mx) continue;
      if (step.message.includes('A record') && !records.a) continue;
      if (step.message.includes('NS') && !records.ns) continue;
      
      if (!isInitial) {
        await new Promise((resolve) => setTimeout(resolve, step.delay));
      }

      const entry: LogEntry = {
        id: `dns-log-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        type: step.type as any,
        message: step.message,
      };

      tempLogs = [...tempLogs, entry];
      setLogs(tempLogs);
    }

    const outputData = generateDiagnosticResult(target);
    setResult(outputData);
    setIsLoading(false);

    if (!isInitial) {
      onAddHistory(target, 'dns', outputData.seoScore);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-400" />
            Diagnóstico DNS
          </h1>
          <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
            Analiza registros de nombres de dominio, latencia de red de servidores primarios y propagación a nivel global.
          </p>
        </div>

        <div>
          <button
            onClick={onOpenHistory}
            className="bg-brand-surface-highest/80 hover:bg-brand-surface-highest text-white px-4 py-2 border border-brand-outline-variant/30 hover:border-brand-outline-variant rounded-xl flex items-center gap-2 transition-colors text-xs font-mono shadow-md"
          >
            <History className="w-4 h-4 text-brand-primary" />
            <span>HISTORIAL</span>
          </button>
        </div>
      </div>

      {/* Control panel matching screens */}
      <div className="glass-card rounded-2xl p-6 border border-brand-primary/10 glow-primary backdrop-blur-md">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
          {/* Domain text box */}
          <div className="xl:col-span-4 relative group">
            <input
              type="text"
              value={domainValue}
              onChange={(e) => setDomainValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runDNSAnalysis()}
              className="w-full bg-brand-surface-lowest border border-brand-outline-variant/60 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-4.5 px-5 pr-12 text-lg text-brand-primary font-bold placeholder:text-slate-600 outline-none transition-all"
              placeholder="cuak.com"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
          </div>

          {/* Trigger button */}
          <div className="xl:col-span-2">
            <button
              onClick={() => runDNSAnalysis()}
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-[#2563eb] text-neutral-900 font-sans font-bold text-base py-4.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/10 disabled:opacity-50"
            >
              <Rocket className="w-5 h-5 shrink-0" />
              <span>{isLoading ? 'ANALIZANDO' : 'ANALIZAR'}</span>
            </button>
          </div>

          {/* Checklist checkboxes grid */}
          <div className="xl:col-span-6 select-none leading-none">
            <div className="flex flex-wrap items-center gap-4 p-2 bg-brand-surface-low rounded-xl border border-brand-outline-variant/20">
              
              {/* Toggle switch all */}
              <div className="flex items-center gap-3 px-3.5 py-2 border-r border-brand-outline-variant/30 h-full">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => handleToggleAll(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-secondary h-6" />
                  <span className="ml-3 font-mono text-xs text-white uppercase font-bold tracking-wider">
                    Todos
                  </span>
                </label>
              </div>

              {/* Records boxes */}
              <div className="flex flex-wrap gap-4 px-2">
                {(['mx', 'a', 'ns', 'txt', 'cname'] as const).map((rec) => (
                  <label key={rec} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={records[rec]}
                      onChange={() => handleRecordToggle(rec)}
                      className="rounded border-brand-outline-variant/60 bg-brand-surface-lowest text-brand-secondary focus:ring-brand-secondary/35 h-5 w-5"
                    />
                    <span className="font-mono text-xs font-bold uppercase transition-colors text-slate-300 group-hover:text-brand-secondary">
                      {rec}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento subtools list matching screenshots row layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ping */}
        <div 
          onClick={() => onSwitchView('ping')}
          className="group bg-brand-surface-low hover:bg-brand-surface-high p-6 rounded-2xl border border-brand-outline-variant/20 hover:border-brand-primary/20 transition-all cursor-pointer relative overflow-hidden shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-brand-primary mb-4 transform group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-white mb-1.5">Ping</h3>
          <p className="text-xs text-[#c3c6d7] mb-4.5 font-sans leading-relaxed">
            Mide la latencia media y pérdida de paquetes de red sobre la IP del servidor en tiempo real.
          </p>
          <button className="text-brand-primary font-mono text-xs font-bold uppercase flex items-center gap-1.5 group-hover:shadow-indigo-500/5 transition-all">
            <span>LANZAR TEST</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Traceroute */}
        <div 
          onClick={() => onSwitchView('ping')}
          className="group bg-brand-surface-low hover:bg-brand-surface-high p-6 rounded-2xl border border-brand-outline-variant/20 hover:border-brand-primary/20 transition-all cursor-pointer relative overflow-hidden shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 transform group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-white mb-1.5">Traceroute</h3>
          <p className="text-xs text-[#c3c6d7] mb-4.5 font-sans leading-relaxed">
            Visualiza los saltos de red y nodos intermedios de encaminamiento desde origen hasta tu servidor.
          </p>
          <button className="text-teal-400 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all">
            <span>ANALIZAR RUTA</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: WHOIS */}
        <div 
          onClick={() => onSwitchView('diagnostico')}
          className="group bg-brand-surface-low hover:bg-brand-surface-high p-6 rounded-2xl border border-brand-outline-variant/20 hover:border-brand-primary/20 transition-all cursor-pointer relative overflow-hidden shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 transform group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-white mb-1.5">Whois</h3>
          <p className="text-xs text-[#c3c6d7] mb-4.5 font-sans leading-relaxed">
            Extrae los detalles legales de registro, titularidad, DNS autoritativo y fechas de fin del dominio.
          </p>
          <button className="text-orange-400 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all">
            <span>CONSULTAR</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 4: Salud SSL */}
        <div 
          onClick={() => onSwitchView('diagnostico')}
          className="group bg-brand-surface-low hover:bg-brand-surface-high p-6 rounded-2xl border border-brand-outline-variant/20 hover:border-brand-primary/20 transition-all cursor-pointer relative overflow-hidden shadow-md"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 transform group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-white mb-1.5">Salud SSL</h3>
          <p className="text-xs text-[#c3c6d7] mb-4.5 font-sans leading-relaxed">
            Verifica la integridad de la cadena de confianza, algoritmos de cifrado y caducidad de certificados.
          </p>
          <button className="text-rose-400 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all">
            <span>VERIFICAR</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Map visualization split with terminal window */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map overview card */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 h-[400px] flex flex-col justify-between shadow-md">
            <div className="flex justify-between items-center select-none">
              <h3 className="font-sans font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-secondary" />
                Propagación Global de DNS
              </h3>
              <span className="text-[10px] font-mono text-[#8d90a0] uppercase tracking-wider font-bold">
                Estado: Tiempo Real
              </span>
            </div>

            {/* Glowing Map frame container */}
            <div className="flex-1 mt-4 bg-brand-surface-lowest/80 rounded-xl border border-brand-outline-variant/20 overflow-hidden relative group">
              {/* Responsive world vector map loaded directly from beautiful premium CDN source */}
              <img
                alt="Global DNS Network map background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-35 select-none transform hover:scale-[1.03] transition-transform duration-700 pointer-events-none"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMeo-06JleVMZzsXT2qYpuuBrjMKtDul8doAGRV8DBiUlYjnt2zulC0uN3PW949C_ak0a3-Ed-4ewT_8PXfKMpcx0LD7vz9sHEFDiPs0CvGHaPiRCi9Q7VbxlMdTnh2rhMLEdw1OkOzRotV3umP_eq8GBGv4R9DXDM8SvUgEzQDkIpIvaoiriM7RLPsCBFF5fzkcJniDKbnErpTcd41zCIk_AW4bnecS_zKeVAqUDOa3LfpqyGre9mbeGNr8UUsLzcEslW8QADoyo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest/90 via-transparent to-transparent pointer-events-none" />

              {/* Glowing blinking location map nodes */}
              <div className="absolute top-[35%] left-[22%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-brand-secondary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-secondary shadow-[0_0_8px_#4edea3]" />
                <span className="absolute bg-[#0b1326]/90 border border-[#b4c5ff]/20 text-[9px] font-mono px-1 py-0.5 rounded text-white ml-2 border-brand-outline-variant -top-1 opacity-80 select-none">23ms</span>
              </div>

              <div className="absolute top-[48%] left-[70%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#b4c5ff] opacity-75 animate-ping animate-pulse" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary shadow-[0_0_8px_#b4c5ff]" />
                <span className="absolute bg-[#0b1326]/90 border border-[#b4c5ff]/20 text-[9px] font-mono px-1 py-0.5 rounded text-white ml-2 border-brand-outline-variant -top-1 opacity-80 select-none">42ms</span>
              </div>

              <div className="absolute top-[70%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-3 w-3 rounded-full bg-[#ffb3ad] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffb3ad] shadow-[0_0_8px_#ffb3ad]" />
                <span className="absolute bg-[#0b1326]/90 border border-[#b4c5ff]/20 text-[9px] font-mono px-1 py-0.5 rounded text-white ml-2 border-brand-outline-variant -top-1 opacity-80 select-none">12ms</span>
              </div>
            </div>
          </div>

          {/* Scrolling Terminal emulator list */}
          <div className="lg:col-span-1">
            <LiveLogTerminal logs={logs} title="Live Log Terminal" />
          </div>
        </div>
      )}
    </div>
  );
}
