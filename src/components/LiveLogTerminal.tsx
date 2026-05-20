import { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Download, Terminal } from 'lucide-react';

interface LiveLogTerminalProps {
  logs: LogEntry[];
  title?: string;
}

export default function LiveLogTerminal({ logs, title = 'Live Terminal Log' }: LiveLogTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when a new entry is logged
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Export current log array as a string download
  const downloadLogs = () => {
    try {
      const logText = logs
        .map((log) => `[${log.timestamp}] [${log.type}] ${log.message}`)
        .join('\n');
      
      const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `check-norris-log-${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading log file', err);
    }
  };

  const getLogColorClass = (type: LogEntry['type']) => {
    switch (type) {
      case 'SUCCESS':
        return 'text-[#4edea3]'; // brand-secondary green
      case 'NET':
        return 'text-[#b4c5ff]'; // primary blue-purple
      case 'SEC':
        return 'text-amber-300'; // security yellow/gold
      case 'SEO':
        return 'text-indigo-300'; // purple
      case 'WRN':
        return 'text-orange-400 font-bold'; // warning
      case 'ERR':
        return 'text-rose-400 font-bold'; // error red
      case 'INF':
      default:
        return 'text-slate-300'; // normal info
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-black/40 border border-brand-outline-variant/30 flex-1 min-h-[300px]">
      {/* Top terminal tab bar */}
      <div className="p-4 border-b border-brand-outline-variant/20 flex items-center justify-between bg-brand-surface-low/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#8d90a0]" />
          <h3 className="font-mono text-[12px] uppercase tracking-wider text-[#dae2fd]/80 font-bold">
            {title}
          </h3>
          <span className="h-2 w-2 rounded-full bg-brand-secondary animate-pulse ml-2" />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Download logs trigger */}
          <button
            onClick={downloadLogs}
            disabled={logs.length === 0}
            className="p-1 px-2 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-1 text-[11px] font-mono border border-transparent hover:border-brand-outline-variant/30 disabled:opacity-30 disabled:pointer-events-none"
            title="Download Logs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT</span>
          </button>

          {/* Linux window control lights */}
          <div className="flex gap-1.5 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 block" />
          </div>
        </div>
      </div>

      {/* Terminal logs viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 p-5 font-mono text-[13px] overflow-y-auto space-y-2.5 bg-brand-surface-lowest/70 custom-scrollbar h-64 select-text"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic text-center pt-8 hover:text-slate-400 transition-colors">
            # Consola inactiva. Introduce un dominio y presiona ANALIZAR para iniciar un diagnóstico...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 items-start hover:bg-white/[0.02] py-0.5 px-1 rounded transition-colors group">
              {/* UTC timestamp */}
              <span className="text-slate-600 select-none shrink-0 group-hover:text-slate-400">
                [{log.timestamp}]
              </span>
              
              {/* Colored status type tag */}
              <span className={`font-bold shrink-0 text-[11px] px-1.5 py-0.5 rounded leading-none w-14 text-center select-none ${
                log.type === 'SUCCESS' ? 'bg-brand-secondary/15' : 'bg-slate-800/50'
              } ${getLogColorClass(log.type)}`}>
                {log.type === 'SUCCESS' ? 'OK' : log.type}
              </span>
              
              {/* Message */}
              <span className="text-slate-200 tracking-wide font-normal leading-relaxed break-all">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
