import { useState, useRef } from 'react';
import { UploadCloud, Loader2, Check, AlertCircle } from 'lucide-react'; // <--- Removed FileText
import api from '../../api/axios'; 
import { isAxiosError } from 'axios'; 

interface ExtractedData {
  vendor: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ExpenseScannerProps {
  onClose: () => void;
  onScanComplete?: () => void;
}

const ExpenseScanner = ({ onClose, onScanComplete }: ExpenseScannerProps) => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'complete' | 'error'>('idle');
  const [data, setData] = useState<ExtractedData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanState('scanning');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('receipt_image', file);
    formData.append('employee_id', '1'); 

    try {
      const response = await api.post('/payroll/claims/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      
      setData({
        vendor: result.vendor || result.extracted_data?.vendor || 'Unknown Merchant',
        date: result.date_incurred || result.extracted_data?.date || '',
        amount: result.amount || result.extracted_data?.amount || 0,
        category: result.category || result.extracted_data?.category || 'General',
        description: result.description || result.extracted_data?.summary || ''
      });

      setScanState('complete');
      
      if (onScanComplete) {
        onScanComplete();
      }

    } catch (err) {
      console.error("Scan failed", err);
      setScanState('error');
      
      let msg = "Failed to analyze receipt. Please try again.";
      if (isAxiosError(err) && err.response?.data?.error) {
          msg = err.response.data.error;
      }
      setErrorMessage(msg);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">Upload Receipt</h3>
          <p className="text-slate-500 text-sm">AI will extract merchant, date, and tax info.</p>
        </div>

        <div className="p-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*,application/pdf"
          />

          {scanState === 'idle' && (
            <div 
               onClick={triggerFileInput}
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
              </div>
              <h4 className="font-bold text-slate-800">Analyzing Receipt...</h4>
              <p className="text-sm text-slate-500 mt-1">Sending to Gemini AI for extraction</p>
            </div>
          )}

          {scanState === 'error' && (
            <div className="text-center py-6">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={24} />
               </div>
               <h4 className="font-bold text-slate-800">Scan Failed</h4>
               <p className="text-sm text-slate-500 mt-1 px-4">{errorMessage}</p>
               <button 
                 onClick={() => setScanState('idle')}
                 className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
               >
                 Try Again
               </button>
            </div>
          )}

          {scanState === 'complete' && data && (
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

               {/* Extracted Data Form */}
               <div className="space-y-3">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Merchant</label>
                     <input 
                        type="text" 
                        defaultValue={data.vendor} 
                        className="w-full text-sm font-semibold text-slate-900 border-b border-slate-200 py-1 focus:outline-none focus:border-emerald-500 bg-transparent" 
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <input 
                           type="text" 
                           defaultValue={data.date} 
                           className="w-full text-sm font-semibold text-slate-900 border-b border-slate-200 py-1 bg-transparent" 
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                        <input 
                           type="text" 
                           defaultValue={data.amount} 
                           className="w-full text-sm font-bold text-slate-900 border-b border-slate-200 py-1 bg-transparent" 
                        />
                     </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                     <textarea 
                        defaultValue={data.description} 
                        rows={2}
                        className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-2 mt-1 bg-transparent focus:outline-none focus:border-emerald-500" 
                     />
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
             {scanState === 'complete' ? 'Close' : 'Cancel'}
           </button>
           {scanState === 'complete' && (
             <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-900/20">
               Confirm & Done
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseScanner;