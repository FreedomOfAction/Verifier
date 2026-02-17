import React from 'react';
import { BrokerAuditResult, AuditParameter } from '../types';
import { 
  CheckCircle, AlertTriangle, ExternalLink, 
  Globe, Sparkles, Link2, Check, FileText, AlertCircle,
  Search, Newspaper, MousePointer2
} from 'lucide-react';

interface ResultsTableProps {
  results: BrokerAuditResult[];
  selectedParams: AuditParameter[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, selectedParams }) => {
  if (results.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-[50] bg-gray-50/95 backdrop-blur-md p-5 text-left border-b border-gray-200 w-[240px] shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#747775]">Broker Identity</span>
              </th>
              {selectedParams.map(param => (
                <th key={param.id} scope="col" className="p-5 text-left border-b border-gray-200 w-[240px] bg-gray-50/40">
                  <div className="text-[9px] font-black uppercase tracking-wider text-blue-500 mb-0.5 opacity-70 truncate">{param.category}</div>
                  <div className="text-xs font-black text-gray-900 truncate">{param.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((result, idx) => (
              <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                {/* Identity Column */}
                <td className="sticky left-0 z-[40] bg-white group-hover:bg-[#fcfdfe] p-5 align-top border-r border-gray-100 shadow-[2px_0_8px_rgba(0,0,0,0.01)] transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                        result.status === 'completed' ? 'bg-emerald-500' : 
                        result.status === 'processing' ? 'bg-blue-500 animate-pulse' : 
                        result.status === 'error' ? 'bg-rose-500' : 'bg-gray-200'
                      }`}></div>
                      <div className="min-w-0">
                        <div className="font-black text-sm text-gray-900 truncate leading-tight">{result.brokerName}</div>
                        <div className="text-[9px] font-bold text-gray-500 uppercase mt-0.5">{result.region || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {/* URL compact */}
                      <div className="flex items-center justify-between text-[10px] bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <span className="truncate text-blue-600 font-bold flex-1">{result.url.replace('https://', '')}</span>
                        <a href={result.url} target="_blank" rel="noreferrer" className="ml-1 text-gray-400 hover:text-blue-600"><ExternalLink size={12} /></a>
                      </div>

                      {result.sources && result.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {result.sources.map((s, i) => (
                            <a key={i} href={s.uri} target="_blank" rel="noreferrer" title={s.title} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100/50">
                              <Link2 size={12} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {result.status === 'error' && (
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase flex items-center gap-2">
                        <AlertCircle size={12} /> {result.error}
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Parameter Columns */}
                {selectedParams.map(param => {
                  const comp = result.comparisons[param.id];
                  if (!comp) return (
                    <td key={param.id} className="p-5 align-top">
                      <div className="space-y-2 opacity-30">
                         <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                         <div className="h-10 w-full bg-gray-50 rounded-xl animate-pulse" />
                      </div>
                    </td>
                  );
                  
                  return (
                    <td key={param.id} className={`p-4 align-top transition-colors border-r border-gray-50 last:border-r-0 ${comp.isMatch ? 'bg-emerald-50/5' : 'bg-rose-50/5'}`}>
                      <div className="space-y-3">
                        {/* Site Claim */}
                        <div className="px-1">
                          <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1">
                            <FileText size={10} /> Claimed
                          </div>
                          <div className="text-[11px] font-bold text-gray-700 truncate" title={comp.siteValue}>
                            {comp.siteValue || '-'}
                          </div>
                        </div>

                        {/* Truth Box (Compact) */}
                        <div className={`p-2.5 rounded-xl border transition-all ${
                          comp.isMatch ? 'bg-white border-emerald-100 shadow-sm' : 'bg-white border-rose-100 shadow-sm'
                        }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1 text-[8px] font-black text-blue-500 uppercase">
                              <Search size={9} /> Truth
                            </div>
                            {comp.isMatch ? (
                              <Check className="text-emerald-500" size={10} strokeWidth={4} />
                            ) : (
                              <AlertTriangle className="text-rose-500" size={10} strokeWidth={4} />
                            )}
                          </div>
                          <div className={`text-[11px] font-black leading-tight ${comp.isMatch ? 'text-gray-900' : 'text-rose-900'}`}>
                            {comp.officialValue || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
