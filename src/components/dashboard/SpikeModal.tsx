import { X, AlertTriangle, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// 1. Types
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
  // Chart Data
  const comparisonData = [
    { name: '3-Month Avg', amount: record.netPay * 0.85 }, 
    { name: 'Current Month', amount: record.netPay },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 p-6 flex justify-between items-start">
           <div className="flex gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full h-fit">
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900">Salary Spike Detected</h3>
                 <p className="text-sm text-slate-600">
                    AI flagged an anomaly for <span className="font-bold text-slate-900">{record.employee}</span>
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="p-6 space-y-6">
           {/* AI Insight Box */}
           <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                 <TrendingUp size={100} />
              </div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> AI Analysis
              </p>
              <p className="text-slate-700 font-medium leading-relaxed relative z-10">
                 "{record.spikeReason}"
              </p>
           </div>

           {/* Chart */}
           <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-bold tracking-wider">
                 <span>Net Pay Comparison</span>
                 <span>+15% Increase</span>
              </div>
              <div className="h-40 w-full bg-white border border-slate-100 rounded-lg p-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical" barSize={30}>
                       <XAxis type="number" hide />
                       <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `KES ${Number(value).toLocaleString()}`} />
                       <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                          <Cell fill="#94a3b8" /> 
                          <Cell fill="#f59e0b" /> 
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Financial Breakdown Table */}
           <div className="text-sm border-t border-slate-100 pt-4">
              <div className="flex justify-between py-2 border-b border-slate-50">
                 <span className="text-slate-500">Base Salary</span>
                 <span className="font-medium text-slate-700">KES {record.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50 bg-amber-50/50 px-2 -mx-2 rounded">
                 <span className="text-amber-700 font-medium flex items-center gap-2">
                    Allowances <HelpCircle size={12} />
                 </span>
                 <span className="font-bold text-amber-700">KES {record.allowances.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                 <span className="text-slate-500">Net Pay</span>
                 <span className="font-bold text-slate-900">KES {record.netPay.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
              Investigate Further
           </button>
           <button onClick={onApprove} className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-900/10 flex items-center gap-2 transition-all">
              <CheckCircle size={16} />
              Approve Anomaly
           </button>
        </div>

      </div>
    </div>
  );
};

export default SpikeModal;