import { useState, useEffect } from 'react';
import { DiagnosticResult, LogEntry } from '../types';
import { generateDiagnosticResult, getSimulatedLogSteps } from '../utils';
import LiveLogTerminal from './LiveLogTerminal';
import { 
  SearchCode, 
  Rocket, 
  Sparkles, 
  Link, 
  Clock, 
  Settings, 
  ChevronDown, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Globe
} from 'lucide-react';

interface SEOViewProps {
  onAddHistory: (domain: string, view: 'diagnostico' | 'dns' | 'correo' | 'seo', score?: number) => void;
}

export default function SEOView({ onAddHistory }: SEOViewProps) {
  const [domainSearch, setDomainSearch] = useState('cuak.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Spanish capital SEO Checklist Toggles state
  const [config, setConfig] = useState({
    tiempoCarga: true,
    metaTags: true,
    captura: true,
    spider: false,
    ranking: true,
    estado: true,
    redir: true
  });

  useEffect(() => {
    runSEOAnalysis(true);
  }, []);

  const runSEOAnalysis = async (isInitial = false) => {
    if (isLoading) return;

    const target = domainSearch.trim() || 'cuak.com';
    setIsLoading(true);
    setLogs([]);

    const steps = getSimulatedLogSteps(target, 'seo');
    let tempLogs: LogEntry[] = [];

    // Adjust logs based on checklist toggles
    if (config.metaTags) {
      steps.splice(4, 0, { type: 'SEO', message: `Verificando metadatos canónicos de OpenGraph (og:title, og:description)...`, delay: 300 });
      steps.splice(5, 0, { type: 'SUCCESS', message: `Comprobación OpenGraph: Correcto.`, delay: 200 });
    }
    if (config.ranking) {
      steps.splice(6, 0, { type: 'SEO', message: `Buscando histórico de ranking SERP de palabras clave para el dominio...`, delay: 400 });
    }

    for (let i = 0; i < steps.length; i++) {
      if (!isInitial) {
        await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
      }

      const entry: LogEntry = {
        id: `seo-log-${i}`,
        timestamp: new Date().toLocaleTimeString(),
        type: steps[i].type as any,
        message: steps[i].message
      };

      tempLogs = [...tempLogs, entry];
      setLogs(tempLogs);
    }

    const data = generateDiagnosticResult(target);
    setResult(data);
    setIsLoading(false);

    if (!isInitial) {
      onAddHistory(target, 'seo', data.seoScore);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3 animate-fade-in">
          <SearchCode className="w-8 h-8 text-rose-400" />
          Auditoría SEO
        </h1>
        <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
          Analiza el rendimiento general, la consistencia de metadatos tags y la indexabilidad de cualquier dominio web.
        </p>
      </div>

      {/* Main controller with switches */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative flex-1 w-full group">
            <input
              type="text"
              value={domainSearch}
              onChange={(e) => setDomainSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSEOAnalysis()}
              className="w-full bg-brand-surface-lowest border border-brand-outline-variant/60 focus:border-brand-primary/80 focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-4 pl-12 pr-4 text-base text-white font-bold tracking-wide placeholder:text-slate-600 outline-none transition-all"
              placeholder="cuak.com"
            />
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
          </div>

          <button
            onClick={() => runSEOAnalysis()}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-700 hover:scale-[1.03] active:scale-95 transition-all text-white font-sans font-bold text-sm tracking-widest uppercase rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-red-950/20 shrink-0"
          >
            <Rocket className="w-5 h-5" />
            <span>ANALIZAR</span>
          </button>
        </div>

        {/* Spain capital checklist toggles (matching Screenshot 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 pt-4 border-t border-brand-outline-variant/20 select-none leading-none">
          {/* Item 1: TIEMPO CARGA */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-brand-primary text-xs font-mono font-bold">12ms</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.tiempoCarga}
                  onChange={() => setConfig({ ...config, tiempoCarga: !config.tiempoCarga })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">TIEMPO CARGA</span>
          </div>

          {/* Item 2: META TAGS */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-brand-secondary text-xs font-mono font-bold">TAG</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.metaTags}
                  onChange={() => setConfig({ ...config, metaTags: !config.metaTags })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-secondary" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">META TAGS</span>
          </div>

          {/* Item 3: CAPTURA */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-rose-400 text-xs font-mono font-bold">JPG</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.captura}
                  onChange={() => setConfig({ ...config, captura: !config.captura })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">CAPTURA</span>
          </div>

          {/* Item 4: SPIDER */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-sky-400 text-xs font-mono font-bold">API</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.spider}
                  onChange={() => setConfig({ ...config, spider: !config.spider })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-400" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">SPIDER</span>
          </div>

          {/* Item 5: RANKING */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-[#434655]/20 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[#4edea3] text-xs font-mono font-bold">SEO</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.ranking}
                  onChange={() => setConfig({ ...config, ranking: !config.ranking })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-secondary" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">RANKING</span>
          </div>

          {/* Item 6: ESTADO */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-teal-300 text-xs font-mono font-bold">OK</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.estado}
                  onChange={() => setConfig({ ...config, estado: !config.estado })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-400" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">ESTADO</span>
          </div>

          {/* Item 7: REDIR */}
          <div className="flex flex-col justify-between gap-3 p-3 rounded-xl bg-brand-surface-low/50 border border-brand-outline-variant/10 hover:bg-brand-surface-high/40 transition-all col-span-2 xl:col-span-1">
            <div className="flex justify-between items-center">
              <span className="text-amber-300 text-xs font-mono font-bold">301</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.redir}
                  onChange={() => setConfig({ ...config, redir: !config.redir })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-brand-surface-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400" />
              </label>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#8d90a0]">REDIR</span>
          </div>
        </div>
      </div>

      {/* Results details split layout (Bento Grid matching Screenshot 6) */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Summary Details Card */}
          <div className="md:col-span-8 glass-panel rounded-2xl overflow-hidden shadow-lg border-l-4 border-brand-primary flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5 select-none">
                <h3 className="font-sans font-bold text-lg text-white">
                  Resumen de {result.domain}
                </h3>
                <span className="px-3 py-1 bg-[#4edea3]/10 text-brand-secondary border border-brand-secondary/25 rounded-full text-xs font-mono font-bold tracking-wider">
                  SALUDABLE
                </span>
              </div>

              {/* Grid block metric blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 font-sans">
                <div className="p-4 bg-brand-surface-high/50 rounded-xl border border-brand-outline-variant/15">
                  <p className="text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">tiempo de respuesta</p>
                  <p className="text-2xl font-bold text-brand-secondary">{result.responseTime}ms</p>
                </div>
                
                <div className="p-4 bg-brand-surface-high/50 rounded-xl border border-brand-outline-variant/15">
                  <p className="text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">SEO SCORE</p>
                  <p className="text-2xl font-bold text-brand-primary">{result.seoScore}/100</p>
                </div>

                <div className="p-4 bg-brand-surface-high/50 rounded-xl border border-brand-outline-variant/15">
                  <p className="text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">SSL STATUS</p>
                  <p className="text-2xl font-bold text-white uppercase">{result.sslValid ? 'Válido' : 'No Encontrado'}</p>
                </div>
              </div>
            </div>

            {/* Sub-footer card summary info list */}
            <div className="bg-brand-surface-high/30 p-5 border-t border-brand-outline-variant/20 flex items-center gap-2.5 text-slate-400 select-none">
              <Sparkles className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
              <p className="text-xs font-mono">
                Último análisis hace unos segundos. El spider detectó <span className="font-bold underline text-white">{Math.floor(result.responseTime / 2.3)}</span> enlaces internos.
              </p>
            </div>
          </div>

          {/* SVG Progress chart indicator circular visual card */}
          <div className="md:col-span-4 glass-panel rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-brand-surface-low to-brand-surface-lowest shadow-lg select-none">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  className="text-brand-surface-highest" 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="42" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                />
                {/* SVG animates cleanly directly inside SVG tags */}
                <circle 
                  className="text-brand-secondary stroke-linecap-round" 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="42" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * result.seoScore) / 100} 
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-sans font-bold text-white tracking-tighter">
                  {result.seoScore}%
                </span>
              </div>
            </div>
            
            <h4 className="font-sans font-bold text-base text-white mb-1">Indexación</h4>
            <p className="text-xs text-[#c3c6d7] max-w-[200px] leading-relaxed">
              Tu dominio está correctamente indexado y es legible para motores de búsqueda.
            </p>
          </div>

          {/* Low Log splits */}
          <div className="md:col-span-12">
            <LiveLogTerminal logs={logs} title="Registro de Eventos Crawl" />
          </div>
        </div>
      )}

      {/* Static graphics panels (Featured Analysis at screen bottom) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel 1 */}
        <div className="relative rounded-2xl overflow-hidden h-52 group shadow-md border border-brand-outline-variant/10">
          <img 
            alt="Dashboard chart visual context"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-all duration-700 select-none transform scale-100 group-hover:scale-[1.03]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6a0MwFYc167ZEw8jv5OaLXaHAZOesqKrF1Koltditv5EEZFjl-dml6-FQzwcQGbrJVF66Inkg1Yh3DWhOc8sYJehUxb9l0aTKAUImZkp8ThRKW40v44ocdEr0JAlmRc98NILl_bFtQDBuMDzMDctxrzNqN5dK-mQRBBnfqXzB7drjpTqj8KMmYO3XrPOVx6-3fLP4iqhI3JTEYwXFkRWh5eCVhyWvxNwW6WbIlwrCcYdiE21aHjafovTaQ4FcWx5s-qKYRR3cPZk"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest/90 via-[#0b1326]/40 to-transparent flex items-end p-5">
            <div>
              <h4 className="font-sans font-bold text-lg text-white mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Análisis Predictivo
              </h4>
              <p className="text-xs text-[#c3c6d7] max-w-sm leading-relaxed">
                Visualiza estimaciones de tráfico orgánico futuro basadas en fluctuaciones del ranking y SERP.
              </p>
            </div>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="relative rounded-2xl overflow-hidden h-52 group shadow-md border border-brand-outline-variant/10">
          <img 
            alt="Cloud network visual context"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-all duration-700 select-none transform scale-100 group-hover:scale-[1.03]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBksSJrmFchLfaaK01gBLkPe3FDLybEy-E1uXwTo_MkuMMNgbNQpdiP_SkXaHeUJVtDk8TtzAXnpqmJWJ-7255Ktu7MQp0h7KlpoSUVqtbsaUbY6M_34gwvRnd-RiDULnQxNHIuMhheaz7vBidrUEkm5TRZilhntQJuM4cPsx8C4HZISkO4ubduAW_lR6Y78_fGVObWzR-z4066CwkhNxGYLzaolp55NPq6qU5EjkMG1xiC-PmaorlC9lophMLZ-vGK1Xus7fN5XQg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface-lowest/90 via-[#0b1326]/40 to-transparent flex items-end p-5">
            <div>
              <h4 className="font-sans font-bold text-lg text-white mb-1 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Rastreadores Globales
              </h4>
              <p className="text-xs text-[#c3c6d7] max-w-sm leading-relaxed">
                Nuestros spiders ejecutan auditorías y peticiones en paralelo desde 12 nodos internacionales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
