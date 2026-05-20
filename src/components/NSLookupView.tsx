import { useState } from 'react';
import { Database, Search, ShieldCheck, Mail, Globe, Cpu, Layers } from 'lucide-react';
import { generateDiagnosticResult } from '../utils';

export default function NSLookupView() {
  const [domain, setDomain] = useState('cuak.com');
  const [recordType, setRecordType] = useState<'A' | 'AAAA' | 'MX' | 'NS' | 'TXT' | 'CNAME'>('A');
  const [loading, setLoading] = useState(false);
  const [resultsList, setResultsList] = useState<{ value: string; priority?: string; description: string }[]>([]);

  const handleLookup = async () => {
    if (loading) return;
    setLoading(true);
    setResultsList([]);
    
    await new Promise((resolve) => setTimeout(resolve, 600));

    const data = generateDiagnosticResult(domain);
    const resolved: typeof resultsList = [];

    switch (recordType) {
      case 'A':
        data.dnsRecords.A.forEach(ip => {
          resolved.push({
            value: ip,
            description: 'Dirección IPv4 canónica que vincula el host con el servidor web.'
          });
        });
        break;
      case 'AAAA':
        data.dnsRecords.AAAA.forEach(ip => {
          resolved.push({
            value: ip,
            description: 'Dirección IPv6 moderna de enrutamiento de red de nueva generación.'
          });
        });
        break;
      case 'MX':
        data.dnsRecords.MX.forEach(mx => {
          const parts = mx.split(' ');
          resolved.push({
            value: parts[1] || mx,
            priority: parts[0] || '10',
            description: 'Servidor de intercambio de correo autorizado para recibir transferencias SMTP.'
          });
        });
        break;
      case 'NS':
        data.dnsRecords.NS.forEach(ns => {
          resolved.push({
            value: ns,
            description: 'Servidor de nombres autoritativo delegado por el TLD para administrar este dominio.'
          });
        });
        break;
      case 'TXT':
        data.dnsRecords.TXT.forEach(txt => {
          resolved.push({
            value: txt,
            description: txt.startsWith('v=spf1') 
              ? 'Firma SPF de validación del remitente de correo para mitigar suplantación de identidad.' 
              : 'Verificación externa de propiedad de host y firma administrativa del sitio.'
          });
        });
        break;
      case 'CNAME':
        data.dnsRecords.CNAME.forEach(cname => {
          resolved.push({
            value: cname,
            description: 'Nombre de dominio de alias canónico que se mapea a otro nombre de host primario.'
          });
        });
        break;
    }

    setResultsList(resolved);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title block */}
      <div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-sky-400" />
          Name Server Lookup (NSLookup)
        </h1>
        <p className="text-[#c3c6d7] text-sm md:text-base mt-2 max-w-2xl font-sans">
          Obtén registros de asignación directa sobre zonas DNS y configuraciones de enrutamiento con resolución instantánea.
        </p>
      </div>

      {/* Control row block */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Domain name input */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-brand-surface-lowest border border-brand-outline-variant/65 rounded-xl py-3.5 px-4 pl-10 text-white font-mono text-sm placeholder:text-slate-600 outline-none focus:border-sky-500 transition-all font-bold"
              placeholder="cuak.com"
            />
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          </div>

          {/* Record type selection */}
          <div className="md:col-span-4">
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as any)}
              className="w-full bg-brand-surface-lowest border border-brand-outline-variant/65 rounded-xl py-3.5 px-4 text-white font-mono text-sm outline-none focus:border-sky-500 transition-colors cursor-pointer"
            >
              <option value="A">IPv4 Host Record [A]</option>
              <option value="AAAA">IPv6 Host Record [AAAA]</option>
              <option value="MX">Mail Exchange Record [MX]</option>
              <option value="NS">Name Server Record [NS]</option>
              <option value="TXT">Text Record Verification [TXT]</option>
              <option value="CNAME">Canonical Alias Record [CNAME]</option>
            </select>
          </div>

          {/* Trigger lookup click */}
          <div className="md:col-span-3">
            <button
              onClick={handleLookup}
              disabled={loading}
              className="w-full py-4.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-sans font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg transition-all focus:ring-4 focus:ring-sky-500/20 cursor-pointer select-none border border-sky-500/10 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'BUSCANDO...' : 'CONSULTAR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results details table visual representation */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl min-h-[250px] flex flex-col justify-between">
        <div>
          <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-5 select-none flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            Registros de zona ({recordType}) resueltos
          </h3>

          {resultsList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 italic font-sans text-sm">
              No hay registros que mostrar. Especifica un dominio y pulsa CONSULTAR para extraer los registros.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-outline-variant/20 text-[#8d90a0]/80 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">VALOR DE ZONA</th>
                    {recordType === 'MX' && <th className="py-2.5 px-3 w-28">PRIORIDAD</th>}
                    <th className="py-2.5 px-3">EXPLICACIÓN DEL REGISTRO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-outline-variant/10 text-slate-250 font-mono">
                  {resultsList.map((item, index) => (
                    <tr key={index} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-3 text-brand-primary font-bold text-sm break-all font-mono">
                        {item.value}
                      </td>
                      {recordType === 'MX' && (
                        <td className="py-3.5 px-3 font-bold text-amber-400">
                          {item.priority}
                        </td>
                      )}
                      <td className="py-3.5 px-3 text-slate-400 text-xs font-sans min-w-[200px]">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Informative block */}
        <div className="mt-6 pt-4 border-t border-brand-outline-variant/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono select-none gap-2">
          <span>Check Norris DNS Resolver Direct Lookup API version 1.1</span>
          <span className="text-brand-secondary font-bold">● RESOLUCIÓN DIRECTA ACTIVA</span>
        </div>
      </div>
    </div>
  );
}
