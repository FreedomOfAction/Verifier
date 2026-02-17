import React, { useState, useRef, useMemo, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsTable } from './components/ResultsTable';
import { AVAILABLE_PARAMETERS, DEMO_URLS, BINARY_OPTIONS_PRESET_IDS, CRYPTO_BROKERS_PRESET_IDS, APP_MANIFEST_DESCRIPTION } from './constants';
import { AuditParameter, BrokerAuditResult, ComparisonData } from './types';
import { runAuditScript } from './services/verifier';
import { 
  Download, Trash2, ShieldCheck, 
  Database, Square, Sparkles, 
  Zap, Coins, Layout, Loader2, AlertCircle,
  Activity, BarChart3, Fingerprint, RefreshCw,
  CheckCircle2, Terminal, Archive, FileText, Info
} from 'lucide-react';
import Papa from 'papaparse';

const App: React.FC = () => {
  const [results, setResults] = useState<BrokerAuditResult[]>(() => {
    const saved = localStorage.getItem('automated_audit_results');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedParams, setSelectedParams] = useState<string[]>(BINARY_OPTIONS_PRESET_IDS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const stopRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('automated_audit_results', JSON.stringify(results));
  }, [results]);

  const auditStats = useMemo(() => {
    if (results.length === 0) return { accuracy: 0, total: 0, completed: 0, discrepancies: 0 };
    let totalComparisons = 0;
    let totalMatches = 0;
    let discrepancies = 0;
    
    results.forEach(r => {
      Object.values(r.comparisons).forEach((c: ComparisonData) => {
        totalComparisons++;
        if (c.isMatch) totalMatches++;
        else discrepancies++;
      });
    });
    
    return {
      accuracy: totalComparisons > 0 ? Math.round((totalMatches / totalComparisons) * 100) : 0,
      total: results.length,
      completed: results.filter(r => r.status === 'completed').length,
      discrepancies
    };
  }, [results]);

  const handleUrlsLoaded = (newUrls: string[]) => {
    const newItems: BrokerAuditResult[] = newUrls.map(url => ({
      url,
      brokerName: 'Ready',
      region: '-',
      comparisons: {},
      status: 'pending'
    }));
    setResults(newItems);
    setProgress(0);
  };

  const startAudit = async () => {
    stopRef.current = false;
    setIsProcessing(true);
    setProgress(0);
    
    let currentResults = [...results];
    const totalToAudit = currentResults.filter(r => r.status !== 'completed').length;
    let completedInSession = 0;
    
    const paramsToAudit = AVAILABLE_PARAMETERS.filter(p => selectedParams.includes(p.id));
    
    for (let i = 0; i < currentResults.length; i++) {
      if (stopRef.current) break;
      if (currentResults[i].status === 'completed') continue;

      setCurrentTask(`Scripting: ${currentResults[i].url.split('//')[1]?.split('/')[0]}`);

      currentResults = [...currentResults];
      currentResults[i] = { ...currentResults[i], status: 'processing' };
      setResults(currentResults);

      try {
        const result = await runAuditScript(currentResults[i].url, paramsToAudit);
        if (stopRef.current) break;
        
        currentResults = [...currentResults];
        currentResults[i] = { ...result, status: 'completed' };
        setResults(currentResults);
        
        completedInSession++;
        setProgress(Math.round((completedInSession / totalToAudit) * 100));
      } catch (err) {
        if (stopRef.current) break;
        currentResults[i] = { ...currentResults[i], status: 'error', error: "Script failed." };
        setResults([...currentResults]);
      }
    }
    
    setIsProcessing(false);
    setCurrentTask('');
    setProgress(100);
  };

  const exportProjectManifest = () => {
    const activeParams = AVAILABLE_PARAMETERS.filter(p => selectedParams.includes(p.id));
    
    const md = `
# Project Manifest: ${APP_MANIFEST_DESCRIPTION.role}

## 1. App Description & Mission
**Role:** ${APP_MANIFEST_DESCRIPTION.role}
**Mission:** ${APP_MANIFEST_DESCRIPTION.mission}

### Core Capabilities:
${APP_MANIFEST_DESCRIPTION.capabilities.map(c => `- ${c}`).join('\n')}

### Logic Framework:
${APP_MANIFEST_DESCRIPTION.logic_framework}

---

## 2. Audit Logic (Active Parameters)
The agent is currently configured to verify the following **${activeParams.length} metrics**:
${activeParams.map(p => `- **${p.label}** (${p.id}): ${p.description}`).join('\n')}

---

## 3. Backlog (Current Queue)
Total Targets: ${results.length}
${results.map((r, i) => `${i + 1}. ${r.url} [Status: ${r.status.toUpperCase()}]`).join('\n')}

---

## 4. Work Summary (Work)
**Verification Rate:** ${auditStats.accuracy}%
**Processed:** ${auditStats.completed} / ${auditStats.total}
**Discrepancies Found:** ${auditStats.discrepancies}

*Generated on: ${new Date().toLocaleString()}*
    `;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project_manifest_${new Date().getTime()}.md`;
    link.click();
  };

  const exportFullReport = () => {
    const payload = {
      system: {
        app: "VerifierScript Autonomous Auditor",
        version: "1.2.0",
        exportTimestamp: new Date().toISOString(),
        manifest: APP_MANIFEST_DESCRIPTION
      },
      logic: {
        activeParameters: AVAILABLE_PARAMETERS.filter(p => selectedParams.includes(p.id)),
        configurationPreset: selectedParams.length === BINARY_OPTIONS_PRESET_IDS.length ? 'Standard' : 'Custom/Extended'
      },
      stats: auditStats,
      work: results
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `master_audit_ledger_${new Date().getTime()}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-[#1a1c1e] font-sans selection:bg-blue-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[100] h-16 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-gray-900">VerifierScript</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#747775] mt-1">Local Audit Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {results.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={exportProjectManifest}
                  className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-[10px] font-black shadow-sm hover:bg-blue-100 transition-all flex items-center gap-2 uppercase tracking-widest"
                >
                  <FileText size={12} />
                  Download Manifest
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              <section className="bg-white rounded-[32px] p-6 border border-gray-200 shadow-sm overflow-hidden relative">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#444746] mb-5 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 01. Source File
                </h2>
                <FileUpload onUrlsLoaded={handleUrlsLoaded} />
                <button 
                  onClick={() => handleUrlsLoaded(DEMO_URLS)}
                  className="w-full mt-4 py-2.5 text-xs font-black text-[#0b57d0] hover:bg-blue-50 rounded-2xl transition-all"
                >
                  Quick Demo Data
                </button>
              </section>

              <section className="bg-white rounded-[32px] p-6 border border-gray-200 shadow-sm">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#444746] mb-5 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 02. Parameters
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedParams(BINARY_OPTIONS_PRESET_IDS)} className="flex-1 py-2 bg-gray-50 rounded-xl text-[10px] font-black border border-gray-100 transition-colors text-center">Standard</button>
                    <button onClick={() => setSelectedParams(CRYPTO_BROKERS_PRESET_IDS)} className="flex-1 py-2 bg-gray-50 rounded-xl text-[10px] font-black border border-gray-100 transition-colors text-center">Extended</button>
                  </div>
                  <div className="max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                    {AVAILABLE_PARAMETERS.map(p => (
                      <label key={p.id} className="flex items-center gap-3 py-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedParams.includes(p.id)}
                          onChange={() => setSelectedParams(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                          className="w-4 h-4 rounded-md border-gray-300 text-blue-600"
                        />
                        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              {results.length > 0 && (
                <div className="space-y-3">
                  <button 
                    onClick={exportFullReport}
                    className="w-full py-4 text-xs font-black text-white bg-gray-900 hover:bg-black rounded-[24px] flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Archive size={14} />
                    Export Full Ledger (.json)
                  </button>
                  <button 
                    onClick={() => { setResults([]); localStorage.removeItem('automated_audit_results'); }}
                    className="w-full py-4 text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 rounded-[24px] flex items-center justify-center gap-2 transition-all"
                  >
                    <Trash2 size={14} />
                    Purge Workspace
                  </button>
                </div>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-[28px] border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Batch Size</p>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-2xl font-black text-gray-900 leading-none">{auditStats.total}</span>
                  <p className="text-[10px] font-bold text-gray-400">URLs</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-[28px] border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Verified Rate</p>
                <div className="flex items-end justify-center gap-2">
                  <span className={`text-2xl font-black leading-none ${auditStats.accuracy > 90 ? 'text-green-600' : 'text-amber-600'}`}>{auditStats.accuracy}%</span>
                  <Activity size={16} className="text-gray-300 pb-1" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-[28px] border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Processed</p>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-2xl font-black text-blue-600 leading-none">{auditStats.completed}</span>
                  <CheckCircle2 size={16} className="text-gray-300 pb-1" />
                </div>
              </div>
              <div className="bg-white p-5 rounded-[28px] border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Discrepancies</p>
                <div className="flex items-end justify-center gap-2">
                  <span className={`text-2xl font-black leading-none ${auditStats.discrepancies > 0 ? 'text-red-600' : 'text-gray-400'}`}>{auditStats.discrepancies}</span>
                  <AlertCircle size={16} className="text-gray-300 pb-1" />
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#3b82f6_0%,transparent_50%)]" />
              </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Sparkles size={16} className="text-blue-400" />
                  </div>
                  <h2 className="text-white text-xl font-black tracking-tight">Script Control Engine</h2>
                </div>
                <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                  Initiate the local verification script to scan endpoints and cross-reference data.
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-2 relative z-10 shrink-0">
                {!isProcessing ? (
                  <button
                    onClick={startAudit}
                    disabled={results.length === 0}
                    className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-black disabled:opacity-30 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                  >
                    <Zap size={18} fill="currentColor" />
                    Run Audit Script
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                       <span className="text-2xl font-black text-white mb-1">{progress}%</span>
                       <span className="text-[8px] text-blue-400 font-bold tracking-[0.2em] uppercase">Auditing</span>
                    </div>
                    <button 
                      onClick={() => { stopRef.current = true; setIsProcessing(false); }} 
                      className="h-14 w-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-90"
                    >
                      <Square size={20} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {currentTask && (
              <div className="p-5 bg-blue-600 rounded-[24px] shadow-lg animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 mb-3">
                  <RefreshCw size={20} className="animate-spin text-white" />
                  <div className="flex-1">
                    <div className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">Local Processing Node</div>
                    <div className="text-sm font-black text-white truncate">{currentTask}</div>
                  </div>
                  <div className="text-xs font-black text-white/90">{progress}%</div>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <ResultsTable 
                results={results} 
                selectedParams={AVAILABLE_PARAMETERS.filter(p => selectedParams.includes(p.id))}
              />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
