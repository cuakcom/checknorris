import { useState } from 'react';
import { Activity, Play, Wifi, RefreshCw, Send, ShieldAlert } from 'lucide-react';

export default function PingView() {
  const [host, setHost] = useState('cuak.com');
  const [packetCount, setPacketCount] = useState(4);
  const [packetSize, setPacketSize] = useState(64);
  const [pingLines, setPingLines] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [stats, setStats] = useState<{ sent: number; received: number; lost: number; min: number; max: number; avg: number } | null>(null);

  const startPing = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setPingLines([]);
    setStats(null);

    const cleanHost = host.trim() || 'cuak.com';
    const lines: string[] = [];
    
    // Header
    const resolvedIP = cleanHost.includes('google') ? '172.217.16.206' : cleanHost.includes('github') ? '140.82.121.4' : '104.21.31.102';
    lines.push(`HACIENDO PING A ${cleanHost.toUpperCase()} [${resolvedIP}] con ${packetSize} bytes de datos:`);
    setPingLines([...lines]);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let latencies: number[] = [];
    let received = 0;

    for (let i = 1; i <= packetCount; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const isLost = Math.random() < 0.05; // 5% chance of packet loss
      if (isLost) {
        lines.push(`Paquete ${i}: Tiempo de espera agotado para esta solicitud.`);
      } else {
        const ms = Math.floor(Math.random() * 35) + 12;
        latencies.push(ms);
        received++;
        lines.push(`Respuesta desde ${resolvedIP}: bytes=${packetSize} tiempo=${ms}ms TTL=56`);
      }
      setPingLines([...lines]);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Statistics math
    const lost = packetCount - received;
    const min = latencies.length > 0 ? Math.min(...latencies) : 0;
    const max = latencies.length > 0 ? Math.max(...latencies) : 0;
    const avg = latencies.length > 0 ? Math.floor(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

    setStats({
      sent: packetCount,
      received,
      lost,
      min,
      max,
      avg
    });

    setIsExecuting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
          <Activity className="text-purple-400 w-8 h-8" />
          Ping & Latencia de Red
        </h1>
        <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
          Mide la latencia de respuesta, fluctuaciones de red (jitter) y pérdida de paquetes ICMP hacia cualquier host global.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-5 shadow-xl">
            <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider select-none">
              Configurar Paquete ICMP
            </h3>

            {/* Target Host */}
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#8d90a0] mb-2 font-bold tracking-widest">
                Host / Ip de Destino
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-brand-surface-lowest border border-brand-outline-variant/65 rounded-xl py-3 px-4 pl-10 text-white font-mono text-sm placeholder:text-slate-600 outline-none focus:border-purple-500 transition-colors"
                  placeholder="ejemplo.com"
                />
                <Wifi className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Packet size */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#8d90a0] mb-2 font-bold tracking-widest">
                  Número de Envios
                </label>
                <select
                  value={packetCount}
                  onChange={(e) => setPacketCount(Number(e.target.value))}
                  className="w-full bg-brand-surface-lowest border border-brand-outline-variant/65 rounded-xl py-3 px-3 text-white font-mono text-xs outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value={4}>4 Paquetes</option>
                  <option value={8}>8 Paquetes</option>
                  <option value={12}>12 Paquetes</option>
                </select>
              </div>

              {/* Bytes size */}
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#8d90a0] mb-2 font-bold tracking-widest">
                  Tamaño de Buffer
                </label>
                <select
                  value={packetSize}
                  onChange={(e) => setPacketSize(Number(e.target.value))}
                  className="w-full bg-brand-surface-lowest border border-brand-outline-variant/65 rounded-xl py-3 px-3 text-white font-mono text-xs outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value={32}>32 Bytes</option>
                  <option value={64}>64 Bytes (Standard)</option>
                  <option value={128}>128 Bytes</option>
                </select>
              </div>
            </div>

            {/* Launch key */}
            <button
              onClick={startPing}
              disabled={isExecuting}
              className="w-full py-4.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-sans font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/15 transition-all select-none cursor-pointer border border-purple-500/20 disabled:opacity-55"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>ENVIANDO ECO...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white shrink-0" />
                  <span>LANZAR PING</span>
                </>
              )}
            </button>
          </div>

          {/* Statistics summary card */}
          {stats && (
            <div className="glass-panel p-5 rounded-2xl border-brand-secondary/20 shadow-lg space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-brand-secondary">
                Estadísticas del Diagnóstico
              </h4>
              
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div className="bg-brand-surface-lowest/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[#8d90a0] block text-[9px] mb-0.5">MIN LATENCY</span>
                  <span className="text-white font-bold">{stats.min}ms</span>
                </div>
                <div className="bg-brand-surface-lowest/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[#8d90a0] block text-[9px] mb-0.5">MAX LATENCY</span>
                  <span className="text-white font-bold">{stats.max}ms</span>
                </div>
                <div className="bg-brand-surface-lowest/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[#8d90a0] block text-[9px] mb-0.5">AVERAGE</span>
                  <span className="text-brand-secondary font-bold">{stats.avg}ms</span>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 space-y-1.5 pt-2 border-t border-brand-outline-variant/20">
                <p>Paquetes: Enviados = {stats.sent}, Recibidos = {stats.received}, Perdidos = {stats.lost}</p>
                <p>Pérdida de paquetes estimada: <span className={stats.lost > 0 ? 'text-rose-400 font-bold' : 'text-[#4edea3] font-bold'}>
                  {Math.floor((stats.lost / stats.sent) * 100)}%
                </span></p>
              </div>
            </div>
          )}
        </div>

        {/* Live Terminal Output */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl bg-black/60 border border-brand-outline-variant/30 h-[450px] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-brand-outline-variant/20 bg-brand-surface-lowest/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                  ICMP Output Stream
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded bg-rose-500/70" />
                <span className="w-2 h-2 rounded bg-yellow-500/70" />
                <span className="w-2 h-2 rounded bg-emerald-500/70" />
              </div>
            </div>

            <div className="flex-1 p-5 font-mono text-[13px] text-zinc-300 overflow-y-auto space-y-2 custom-scrollbar h-64 select-text bg-[#030712]/90 leading-relaxed">
              {pingLines.length === 0 ? (
                <div className="text-slate-600 italic text-center pt-12">
                  # Listo para trasmitir. Presiona LANZAR PING para iniciar un buffer de paquetes...
                </div>
              ) : (
                pingLines.map((line, idx) => (
                  <div key={idx} className={`${
                    line.includes('Respuesta') ? 'text-[#4edea3]' : line.includes('espera agotado') ? 'text-rose-400' : 'text-[#b4c5ff]'
                  }`}>
                    {idx === pingLines.length - 1 && isExecuting ? (
                      <span className="flex items-center gap-2">
                        <span>{line}</span>
                        <span className="inline-block w-1.5 h-4 bg-brand-secondary animate-ping" />
                      </span>
                    ) : (
                      <p>{line}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
