import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export interface SpikeRecord {
  id: string;
  employee: string;
  netPay: number;
  basicSalary: number;
  allowances: number;
  spikeReason?: string;
}

interface SpikeModalProps {
  record: SpikeRecord;
  onClose: () => void;
  onApprove: () => void;
}

const SpikeModal = ({ record, onClose, onApprove }: SpikeModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header - Warning Style */}
        <div className="bg-amber-50 p-6 border-b border-amber-100 flex gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full h-fit">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">Salary Spike Detected</h3>
            <p className="text-amber-700 text-sm mt-1">
              This payment is significantly higher than the employee's average.
            </p>
          </div>
          <button onClick={onClose} className="text-amber-400 hover:text-amber-700 ml-auto h-fit">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-500">Employee</span>
                 <span className="font-bold text-slate-900">{record.employee}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-500">Net Pay</span>
                 <span className="font-bold text-emerald-600 text-lg">KES {record.netPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-500">Usual Range</span>
                 <span className="text-sm text-slate-600">~ KES {(record.netPay * 0.85).toLocaleString()}</span>
              </div>
           </div>

           <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">AI Analysis:</p>
              <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-3 rounded-lg text-blue-800">
                 {record.spikeReason || "An unusual increase in allowances (Bonus/Overtime) was detected. Please verify before approving."}
              </p>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Investigate Later
          </button>
          <button 
            onClick={onApprove}
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle size={18} />
            Approve Payment
          </button>
        </div>

      </div>
    </div>
  );
};

export default SpikeModal;