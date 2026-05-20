import { useState, useEffect } from 'react';
import { DiagnosticResult, LogEntry } from '../types';
import { generateDiagnosticResult, getSimulatedLogSteps } from '../utils';
import LiveLogTerminal from './LiveLogTerminal';
import { 
  Mail, 
  Satellite, 
  ShieldAlert, 
  Terminal, 
  Server, 
  Search, 
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface CorreoViewProps {
  onAddHistory: (domain: string, view: 'diagnostico' | 'dns' | 'correo' | 'seo', score?: number) => void;
}

export default function CorreoView({ onAddHistory }: CorreoViewProps) {
  const [emailInput, setEmailInput] = useState('cuak.com');
  const [activeCategory, setActiveCategory] = useState<'mx' | 'smtp' | 'reputation' | 'headers'>('mx');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    runMailAnalysis(true);
  }, []);

  const runMailAnalysis = async (isInitial = false) => {
    if (isLoading) return;
    
    const target = emailInput.trim() || 'cuak.com';
    setIsLoading(true);
    setLogs([]);

    const steps = getSimulatedLogSteps(target, 'correo');
    let tempLogs: LogEntry[] = [];

    // Custom log entries based on category selected
    if (activeCategory === 'smtp') {
      steps.splice(3, 0, { type: 'INF', message: `CONNECTING TO mail.${target}:25 SMTP INBOUND PORT... [ESTABLISHED]`, delay: 400 });
      steps.splice(4, 0, { type: 'NET', message: `Sending HELO check-norris-diagnostics-gate.net... [OK, code 220]`, delay: 300 });
      steps.splice(5, 0, { type: 'SEC', message: `Checking TLS negotiation STARTTLS capabilities... Supported! Cert signed.`, delay: 500 });
    } else if (activeCategory === 'reputation') {
      steps.splice(4, 0, { type: 'WRN', message: `Scanning Spamhaus BLACKLIST catalog arrays... CLEAN`, delay: 300 });
      steps.splice(5, 0, { type: 'WRN', message: `Scanning Barracuda networks lists... CLEAN`, delay: 300 });
    } else if (activeCategory === 'headers') {
      steps.splice(2, 0, { type: 'INF', message: `Analizando cabecera MIME-Version y Content-Type...`, delay: 300 });
      steps.splice(3, 0, { type: 'INF', message: `DKIM-Signature verificada: selector=sig1-google, d=google.com`, delay: 400 });
    }

    for (let i = 0; i < steps.length; i++) {
      if (!isInitial) {
        await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
      }
      
      const newEntry: LogEntry = {
        id: `mail-log-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        type: steps[i].type as any,
        message: steps[i].message
      };
      
      tempLogs = [...tempLogs, newEntry];
      setLogs(tempLogs);
    }

    const outputResult = generateDiagnosticResult(target);
    setResult(outputResult);
    setIsLoading(false);

    if (!isInitial) {
      onAddHistory(target, 'correo', outputResult.seoScore);
    }
  };

  const categories = [
    {
      id: 'mx' as const,
      title: 'Analizar Correo',
      subtitle: 'MX · SPF · DKIM · DMARC',
      icon: Mail,
      gradient: 'from-blue-600 to-blue-800 border-blue-400/20 shadow-blue-500/10 hover:shadow-blue-500/25'
    },
    {
      id: 'smtp' as const,
      title: 'Test Relay & Entrega',
      subtitle: 'SMTP · STARTTLS · Banner',
      icon: Satellite,
      gradient: 'from-emerald-600 to-emerald-800 border-emerald-400/20 shadow-emerald-500/10 hover:shadow-emerald-500/25'
    },
    {
      id: 'reputation' as const,
      title: 'Comprobar AbuseIPDB',
      subtitle: 'Reputación de IP',
      icon: ShieldAlert,
      gradient: 'from-red-600 to-red-800 border-red-400/20 shadow-red-500/10 hover:shadow-red-500/25'
    },
    {
      id: 'headers' as const,
      title: 'Revisar Cabeceras',
      subtitle: 'EML o texto pegado',
      icon: FileText,
      gradient: 'from-purple-600 to-purple-800 border-purple-400/20 shadow-purple-500/10 hover:shadow-purple-500/25'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
          <Mail className="w-8 h-8 text-emerald-400" />
          Analizador de Correo
        </h1>
        <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
          Diagnóstico profundo de registros MX, reputación de IP, registros SPF/DKIM y seguridad SMTP integrada de Check Norris.
        </p>
      </div>

      {/* Main Control Input Box */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-[#4edea3]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col gap-5">
          <div className="space-y-1 select-none">
            <h2 className="font-mono text-xs text-brand-secondary font-bold uppercase tracking-widest">
              DIRECCIÓN DE CORREO O DOMINIO
            </h2>
          </div>

          <div className="relative group flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runMailAnalysis()}
                className="w-full bg-brand-surface-lowest border border-brand-outline-variant/60 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-4 px-5 pl-12 text-base text-white font-bold tracking-wide placeholder:text-slate-600 outline-none transition-all"
                placeholder="cuenta@dominio.com o cuak.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
            </div>
            
            <button
              onClick={() => runMailAnalysis()}
              disabled={isLoading}
              className="bg-brand-primary text-brand-on-primary px-8 rounded-xl font-sans font-bold text-sm tracking-widest uppercase hover:bg-white select-none transition-all duration-300 shadow-md transform active:scale-95 disabled:opacity-50 h-[56px] shrink-0"
            >
              {isLoading ? 'ANALIZANDO...' : 'ANALIZAR'}
            </button>
          </div>
        </div>
      </section>

      {/* Bento gradient grid buttons (Directly match layout in Screenshot 2 & 7) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                // Trigger auto scan when switching tabs to make it feel super energetic and reactive!
                setTimeout(() => runMailAnalysis(), 50);
              }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl h-60 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br border shadow-xl transition-all duration-500 select-none ${
                cat.gradient
              } ${
                isSelected 
                  ? 'ring-4 ring-brand-secondary/30 scale-[1.03] border-white/40' 
                  : 'scale-100 hover:scale-[1.02] border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-all duration-500" />
              
              {/* Highlight flare */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-brand-secondary m-3 animate-ping" />
              )}

              <IconComponent className="w-12 h-12 mb-4 text-white p-1 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300" />
              
              <h3 className="font-sans font-bold text-white text-base md:text-lg mb-1 tracking-tight">
                {cat.title}
              </h3>
              
              <p className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
                {cat.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Lower recent list and global diagnostic state splits */}
      {result && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Analysis summaries */}
          <div className="md:col-span-7 glass-panel rounded-2xl p-6 border-brand-outline-variant/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5 select-none">
                <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  Auditorías Recientes de Correo
                </h4>
                <span className="text-xs font-mono text-slate-500 hover:underline cursor-pointer">Ver todos</span>
              </div>

              {/* Log items matching layout */}
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-surface-high/50 hover:bg-brand-surface-high border border-brand-outline-variant/10 hover:border-brand-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="bg-indigo-500/10 text-brand-primary p-2 rounded-lg font-mono text-xs w-9 text-center">MX</span>
                    <div>
                      <p className="font-mono text-sm text-white font-bold">{result.domain}</p>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Diagnóstico completo de registros DNS SPF/DKIM
                      </p>
                    </div>
                  </div>
                  <span className="text-brand-secondary text-xs uppercase font-mono font-bold tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-secondary" />
                    EXITOSO
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-surface-high/50 hover:bg-brand-surface-high border border-brand-outline-variant/10 hover:border-brand-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="bg-rose-500/10 text-rose-450 p-2 rounded-lg font-mono text-xs w-9 text-center">IP</span>
                    <div>
                      <p className="font-mono text-sm text-white font-bold">test-sender.ru</p>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Presencia en listas de reputación AbuseIPDB detectada
                      </p>
                    </div>
                  </div>
                  <span className="text-rose-400 text-xs uppercase font-mono font-bold tracking-wider flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    CRÍTICO
                  </span>
                </div>
              </div>
            </div>

            {/* Extra SMTP Diagnostics summary table */}
            <div className="mt-6 pt-5 border-t border-brand-outline-variant/20 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-brand-surface-lowest/40 p-3 rounded-xl border border-brand-outline-variant/10">
                <span className="text-[#8d90a0] block text-[10px] mb-0.5">SMTP BANNER HELO</span>
                <span className="text-emerald-400 font-bold font-mono">220 smtp.check-norris.org</span>
              </div>
              <div className="bg-brand-surface-lowest/40 p-3 rounded-xl border border-brand-outline-variant/10">
                <span className="text-[#8d90a0] block text-[10px] mb-0.5">TLS HANDSHAKE ENCRYPT</span>
                <span className="text-emerald-400 font-bold">TLSv1.3 (256-bit AES)</span>
              </div>
            </div>
          </div>

          {/* Terminal log panel */}
          <div className="md:col-span-5 h-full flex flex-col min-h-[300px]">
            <LiveLogTerminal logs={logs} title={`Logs: ${activeCategory.toUpperCase()}`} />
          </div>
        </section>
      )}
    </div>
  );
}
