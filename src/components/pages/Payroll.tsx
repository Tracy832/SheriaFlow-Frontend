import { useState } from 'react';
import Header from '../layout/Header';
import ExpenseScanner from '../dashboard/ExpenseScanner'; 
import SpikeModal from '../dashboard/SpikeModal'; 
import { 
  Download, Play, FileText, CheckCircle2, 
  Clock, AlertCircle, Search, Filter, Sparkles, Upload, AlertTriangle 
} from 'lucide-react';

// 1. Interface Definition
interface PayrollRecord {
  id: string;
  employee: string;
  role: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing';
  date: string;
  spikeDetected?: boolean; 
  spikeReason?: string;
}

// 2. Helper Function
const formatCurrency = (amount: number) => {
  return "KES " + amount.toLocaleString();
};

// 3. Mock Data
const payrollData: PayrollRecord[] = [
  { 
    id: 'PAY-001', 
    employee: 'John Kamau', 
    role: 'Senior Developer', 
    department: 'Engineering', 
    basicSalary: 120000, 
    allowances: 45000, 
    deductions: 25000, 
    netPay: 140000, 
    status: 'Paid', 
    date: 'Jan 28, 2026',
    spikeDetected: true,
    spikeReason: 'Net pay is 30% higher than 6-month average (Bonus detected)'
  },
  { id: 'PAY-002', employee: 'Sarah Wanjiku', role: 'Legal Counsel', department: 'Legal', basicSalary: 90000, allowances: 5000, deductions: 18000, netPay: 77000, status: 'Paid', date: 'Jan 28, 2026' },
  { id: 'PAY-003', employee: 'Michael Omondi', role: 'HR Manager', department: 'HR', basicSalary: 80000, allowances: 2000, deductions: 15000, netPay: 67000, status: 'Processing', date: 'Jan 28, 2026' },
  { id: 'PAY-004', employee: 'Brian Koech', role: 'Sales Rep', department: 'Sales', basicSalary: 45000, allowances: 15000, deductions: 8000, netPay: 52000, status: 'Pending', date: 'Jan 28, 2026' },
];

const Payroll = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedSpike, setSelectedSpike] = useState<PayrollRecord | null>(null);

  const handleApproveSpike = () => {
    // Logic to update backend would go here
    setSelectedSpike(null);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Modals */}
      {showScanner && <ExpenseScanner onClose={() => setShowScanner(false)} />}
      
      {selectedSpike && (
        <SpikeModal 
           record={selectedSpike} 
           onClose={() => setSelectedSpike(null)} 
           onApprove={handleApproveSpike}
        />
      )}

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Header 
          title="Payroll" 
          subtitle="Manage salaries, run payrolls, and view payslips"
          user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
        />
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowScanner(true)}
             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
           >
             <Upload size={18} />
             Scan Receipt
           </button>

           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             <Download size={18} />
             Export Reports
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-lg shadow-emerald-900/20">
             <Play size={18} fill="currentColor" />
             Run Payroll
           </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Total Net Pay</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">KES 354,000</h3>
               <p className="text-xs text-slate-500 mt-1">For Jan 2026</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
               <FileText size={24} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Pending Approval</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">2 Employees</h3>
               <p className="text-xs text-amber-600 mt-1">Action Required</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
               <AlertCircle size={24} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-sm font-medium text-slate-500">Processed</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-1">3 Employees</h3>
               <p className="text-xs text-emerald-600 mt-1">Disbursed Successfully</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
               <CheckCircle2 size={24} />
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs & Filters */}
        <div className="border-b border-slate-100">
           <div className="flex items-center justify-between px-5 pt-4">
              <div className="flex gap-6">
                 <button 
                   onClick={() => setActiveTab('current')}
                   className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'current' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                 >
                   Current Run (Jan 2026)
                 </button>
                 <button 
                   onClick={() => setActiveTab('history')}
                   className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                 >
                   History
                 </button>
              </div>
              <div className="flex gap-3 mb-3">
                 <div className="relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-48" />
                 </div>
                 <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-900 font-semibold border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5">Employee</th>
                <th className="p-5">Basic Salary</th>
                <th className="p-5 text-emerald-600">Allowances</th>
                <th className="p-5 text-red-600">Deductions</th>
                <th className="p-5 font-bold text-slate-800">Net Pay</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollData.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  <td className="p-5">
                    <div>
                      <p className="font-semibold text-slate-900">{record.employee}</p>
                      <p className="text-xs text-slate-500">{record.role} • {record.department}</p>
                    </div>
                  </td>

                  <td className="p-5 font-medium">{formatCurrency(record.basicSalary)}</td>
                  <td className="p-5 text-emerald-600 bg-emerald-50/30">{formatCurrency(record.allowances)}</td>
                  <td className="p-5 text-red-600 bg-red-50/30">{formatCurrency(record.deductions)}</td>
                  
                  <td className="p-5">
                     <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                            {formatCurrency(record.netPay)}
                        </span>
                        
                        {/* Spike Visual Trigger */}
                        {record.spikeDetected && (
                            <button 
                               onClick={() => setSelectedSpike(record)}
                               className="group/spike relative p-1 hover:bg-amber-50 rounded-full transition-colors"
                            >
                               <AlertTriangle size={18} className="text-amber-500 animate-pulse cursor-pointer" />
                               {/* Hover Tooltip */}
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/spike:opacity-100 transition-opacity pointer-events-none">
                                  <div className="flex items-center gap-1">
                                    <Sparkles size={10} /> Click to analyze
                                  </div>
                               </div>
                            </button>
                        )}
                     </div>
                  </td>

                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      record.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : record.status === 'Processing' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {record.status === 'Processing' && <Clock size={12} className="animate-pulse" />}
                      {record.status === 'Paid' && <CheckCircle2 size={12} />}
                      {record.status}
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;