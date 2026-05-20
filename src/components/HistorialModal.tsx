import { DomainHistoryItem } from '../types';
import { History, X, Trash2, ArrowRight } from 'lucide-react';

interface HistorialModalProps {
  history: DomainHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (domain: string, viewType: string) => void;
  onClear: () => void;
}

export default function HistorialModal({ history, isOpen, onClose, onSelect, onClear }: HistorialModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Dim Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-surface-lowest/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Panel Content */}
      <div className="relative glass-panel rounded-2xl w-full max-w-lg bg-brand-surface-low border border-brand-outline-variant shadow-2xl p-6 transition-all transform scale-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-brand-outline-variant/30">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-brand-primary" />
            <h3 className="font-sans font-bold text-lg text-white">
              Historial de Auditorías
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 px-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Triggers */}
        {history.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                onClear();
                onClose();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>BORRAR HISTORIAL</span>
            </button>
          </div>
        )}

        {/* Table content list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 max-h-[50vh] pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-sans italic text-sm">
              <History className="w-10 h-10 mx-auto text-slate-600 mb-3 stroke-[1.5]" />
              No hay búsquedas registradas todavía. 
              <p className="not-italic text-xs text-slate-600 mt-1">Introduce un dominio y pulsa Analizar.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item.domain, item.viewType);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl bg-brand-surface-high/60 border border-brand-outline-variant/20 hover:border-brand-primary/40 hover:bg-brand-surface-high transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[14px] text-white font-bold group-hover:text-brand-primary transition-colors">
                    {item.domain}
                  </span>
                  <div className="flex items-center gap-2.5 text-[11px] text-[#8d90a0]/80">
                    <span className="uppercase font-mono bg-indigo-500/10 text-brand-primary px-1.5 py-0.5 rounded leading-none text-[9px] font-bold">
                      {item.viewType}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    {item.score !== undefined && (
                      <span className="text-brand-secondary">Score: {item.score}%</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-brand-primary/60 group-hover:text-brand-primary transition-colors">
                  <span className="text-[12px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    Cargar
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Explaining local storage policy */}
        <div className="mt-4 pt-3 border-t border-brand-outline-variant/20 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            * Los registros se guardan localmente en tu navegador.
          </p>
        </div>
      </div>
    </div>
  );
}
