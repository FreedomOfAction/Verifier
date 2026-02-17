import React, { useCallback, useState } from 'react';
import { Upload, Loader2, CheckCircle2, FileWarning, FileText, XCircle, FilePlus, Sparkles, FileUp, Trash2, RotateCcw } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploadProps {
  onUrlsLoaded: (urls: string[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUrlsLoaded }) => {
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [urlCount, setUrlCount] = useState(0);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('parsing');
    setErrorMsg('');

    // Artificial delay to allow user to perceive the "Automated Agent" at work
    setTimeout(() => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: (results) => {
          const urls: string[] = [];
          results.data.forEach((row: any) => {
            let url = '';
            if (Array.isArray(row)) {
              url = row.find((cell: string) => typeof cell === 'string' && (cell.includes('http') || cell.includes('www'))) || '';
            } else if (typeof row === 'object' && row !== null) {
              const keys = Object.keys(row);
              const urlKey = keys.find(k => k.toLowerCase().includes('url'));
              if (urlKey) url = row[urlKey];
              else url = Object.values(row).find((v: any) => typeof v === 'string' && (v.includes('http') || v.includes('www'))) as string || '';
            }
            
            if (url && url.trim().length > 3) {
              urls.push(url.trim());
            }
          });

          if (urls.length === 0) {
            setStatus('error');
            setErrorMsg('No valid URLs detected in file.');
          } else {
            setStatus('success');
            setUrlCount(urls.length);
            onUrlsLoaded(urls);
            // Persistent success state - no auto-reset as requested
          }
        },
        error: (error) => {
          setStatus('error');
          setErrorMsg('Parsing failed. Unsupported file.');
          console.error(error);
        }
      });
    }, 1500);
  }, [onUrlsLoaded]);

  const reset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('idle');
    setFileName('');
    setUrlCount(0);
  };

  return (
    <div className="w-full">
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full min-h-[220px] border-4 rounded-[40px] transition-all duration-500 ease-in-out overflow-hidden
          ${status === 'idle' ? 'border-dashed border-gray-300 bg-gray-50/50 cursor-pointer hover:border-[#0b57d0] hover:bg-[#f0f7ff] shadow-sm hover:shadow-2xl hover:shadow-blue-200/40' : ''}
          ${status === 'parsing' ? 'border-solid border-[#0b57d0] bg-[#0b57d0] cursor-wait shadow-2xl ring-8 ring-blue-100 shadow-blue-500/20' : ''}
          ${status === 'success' ? 'border-solid border-[#1e8e3e] bg-[#1e8e3e] shadow-2xl ring-8 ring-green-100 shadow-green-500/20' : ''}
          ${status === 'error' ? 'border-solid border-[#d93025] bg-[#d93025] shake shadow-2xl ring-8 ring-red-100 shadow-red-500/20' : ''}
        `}
      >
        {/* Animated Overlays for Parsing State */}
        {status === 'parsing' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-scanning opacity-20 bg-gradient-to-b from-white via-transparent to-transparent" />
            <div className="absolute inset-0 animate-grid-flow-fast opacity-10 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:30px_30px]" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center p-10 text-center relative z-10 w-full">
          
          {/* IDLE STATE */}
          {status === 'idle' && (
            <label htmlFor="csv-upload" className="cursor-pointer w-full flex flex-col items-center">
              <div className="group animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-6 bg-white rounded-3xl shadow-lg mb-4 text-[#0b57d0] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-gray-100 mx-auto w-fit">
                  <FileUp className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black text-[#1a1c1e] tracking-tight">Import Audit List</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black text-[#747775] uppercase tracking-[0.25em]">Drop CSV or TXT here</p>
                    <p className="text-[9px] font-bold text-[#0b57d0] bg-blue-50 py-1 px-3 rounded-full self-center">Autonomous processing starts on drop</p>
                  </div>
                </div>
              </div>
              <input id="csv-upload" type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
          
          {/* PARSING STATE */}
          {status === 'parsing' && (
            <div className="flex flex-col items-center animate-in zoom-in-90 duration-300">
              <div className="relative mb-6">
                <Loader2 className="w-20 h-20 text-white animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black text-white tracking-tight drop-shadow-md">Agent Verifying File Structure</p>
                <p className="text-[11px] font-black text-white/80 uppercase tracking-widest bg-black/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 truncate max-w-[280px]">
                  {fileName}
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && (
            <div className="flex flex-col items-center animate-in zoom-in-75 duration-500 w-full">
              <div className="p-6 bg-white rounded-full shadow-2xl mb-6 text-[#1e8e3e] animate-bounce-short">
                <CheckCircle2 className="w-14 h-14" />
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-xl font-black text-white drop-shadow-md tracking-tight">Batch Integrated</p>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em] bg-white/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/30 shadow-sm">
                    {urlCount} Targets Identified
                  </p>
                  <p className="text-[10px] font-bold text-white/70 italic truncate max-w-[200px]">{fileName}</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/20 backdrop-blur-sm"
              >
                <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
                Replace Data Stream
              </button>
            </div>
          )}

          {/* ERROR STATE */}
          {status === 'error' && (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="p-6 bg-white rounded-full shadow-2xl mb-6 text-[#d93025]">
                <XCircle className="w-14 h-14" />
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-xl font-black text-white drop-shadow-md tracking-tight">System Incompatibility</p>
                <div className="bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-sm">
                   <p className="text-[11px] font-bold text-white uppercase tracking-wider">{errorMsg}</p>
                </div>
              </div>
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-white/20"
              >
                <Trash2 size={14} />
                Try New Stream
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes grid-flow-fast {
          0% { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        .animate-grid-flow-fast {
          animation: grid-flow-fast 0.6s linear infinite;
        }
        @keyframes scanning {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanning {
          animation: scanning 2s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.8s ease-out;
        }
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-3px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
      `}</style>
    </div>
  );
};
