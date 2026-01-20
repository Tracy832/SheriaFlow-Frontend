import { useState } from 'react';
import { UploadCloud, Loader2, Check, FileText } from 'lucide-react';

const ExpenseScanner = ({ onClose }: { onClose: () => void }) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete'>('idle');

  const handleFileUpload = () => {
    // 1. Start Scanning Animation
    setScanState('scanning');
    
    // 2. Mock API Latency
    setTimeout(() => {
      setScanState('complete');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">Upload Receipt</h3>
          <p className="text-slate-500 text-sm">AI will extract merchant, date, and tax info.</p>
        </div>

        <div className="p-6">
          {scanState === 'idle' && (
            <div 
               onClick={handleFileUpload}
               className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                 <UploadCloud size={24} className="text-slate-400 group-hover:text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">Click to upload receipt</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF (Max 5MB)</p>
            </div>
          )}

          {scanState === 'scanning' && (
            <div className="text-center py-8">
              <div className="relative w-16 h-16 mx-auto mb-4">
                 <Loader2 size={64} className="text-slate-200 animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={24} className="text-emerald-600 animate-pulse" />
                 </div>
              </div>
              <h4 className="font-bold text-slate-800">Analyzing Receipt...</h4>
              <p className="text-sm text-slate-500 mt-1">Extracting KRA PIN and Total Amount</p>
            </div>
          )}

          {scanState === 'complete' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                     <Check size={16} />
                  </div>
                  <div>
                     <p className="text-xs text-emerald-700 font-bold uppercase">Scan Complete</p>
                     <p className="text-sm text-emerald-900">Data extracted successfully</p>
                  </div>
               </div>

               {/* Mock Extracted Data Form */}
               <div className="space-y-3">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Merchant</label>
                     <input type="text" defaultValue="JAVA HOUSE - WESTLANDS" className="w-full text-sm font-semibold text-slate-900 border-b border-slate-200 py-1 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <input type="text" defaultValue="20 Jan 2026" className="w-full text-sm font-semibold text-slate-900 border-b border-slate-200 py-1" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                        <input type="text" defaultValue="KES 1,450.00" className="w-full text-sm font-bold text-slate-900 border-b border-slate-200 py-1" />
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">Cancel</button>
           {scanState === 'complete' && (
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Approve & Save</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseScanner;