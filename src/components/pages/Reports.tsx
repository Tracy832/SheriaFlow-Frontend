import { useState } from 'react';
import Header from '../layout/Header';
import { 
  FileSpreadsheet, FileText, Download, Filter, 
  Calendar, CheckCircle2, Clock, 
  Search, ArrowUpRight, File
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// 1. Data Types
interface ReportFile {
  id: number;
  name: string;
  category: string;
  date: string;
  size: string;
  type: 'EXCEL' | 'PDF' | 'CSV' | 'ZIP';
  status: 'Ready' | 'Archived';
}

// 2. Mock Data
const reportsList: ReportFile[] = [
  { id: 101, name: 'Bank Transfer File (EFT)', category: 'Payments', date: 'Jan 28, 2026', size: '45 KB', type: 'EXCEL', status: 'Ready' },
  { id: 102, name: 'Employee Payslips (Bulk)', category: 'Payslips', date: 'Jan 28, 2026', size: '12.4 MB', type: 'ZIP', status: 'Ready' },
  { id: 103, name: 'KRA PAYE Returns (P10)', category: 'Tax', date: 'Jan 20, 2026', size: '1.2 MB', type: 'PDF', status: 'Ready' },
  { id: 104, name: 'NSSF Contributions', category: 'Compliance', date: 'Jan 15, 2026', size: '850 KB', type: 'CSV', status: 'Ready' },
  { id: 105, name: 'SHIF / NHIF Report', category: 'Compliance', date: 'Jan 15, 2026', size: '1.4 MB', type: 'EXCEL', status: 'Archived' },
  { id: 106, name: 'Housing Levy Summary', category: 'Tax', date: 'Jan 15, 2026', size: '600 KB', type: 'PDF', status: 'Ready' },
];

const chartData = [
  { month: 'Aug', amount: 4800000 },
  { month: 'Sep', amount: 4900000 },
  { month: 'Oct', amount: 5100000 },
  { month: 'Nov', amount: 4500000 },
  { month: 'Dec', amount: 5800000 }, 
  { month: 'Jan', amount: 5200000 },
];

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'EXCEL': return <FileSpreadsheet className="text-emerald-600" size={20} />;
      case 'PDF': return <FileText className="text-red-600" size={20} />;
      case 'CSV': return <FileSpreadsheet className="text-green-600" size={20} />;
      case 'ZIP': return <File className="text-amber-600" size={20} />;
      default: return <FileText className="text-slate-600" size={20} />;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <Header 
        title="Reports" 
        subtitle="Manage compliance documents and financial summaries"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
               <Calendar size={16} className="text-slate-500" />
               <select 
                 value={selectedYear} 
                 onChange={(e) => setSelectedYear(e.target.value)}
                 className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
               >
                 <option value="2026">2026</option>
                 <option value="2025">2025</option>
               </select>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <div className="flex gap-2">
               {['All', 'Tax', 'Payslips', 'Compliance'].map((filter) => (
                 <button key={filter} className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors">
                   {filter}
                 </button>
               ))}
            </div>
         </div>
         <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h3 className="text-lg font-bold text-slate-900">Payroll Cost Analysis</h3>
                 <p className="text-sm text-slate-500 mt-1">Total disbursement trends over the last 6 months</p>
              </div>
              <button className="text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline">
                 Detailed Report <ArrowUpRight size={14} />
              </button>
           </div>
           
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#64748b', fontSize: 12}} 
                       tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                       cursor={{fill: '#f8fafc'}}
                       contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                       
                       // --- FIX IS HERE: Added 'undefined' to the type union ---
                       formatter={(value: number | string | undefined) => [`KES ${Number(value || 0).toLocaleString()}`, 'Total Cost']}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === hoveredBar ? '#10b981' : '#1e293b'} 
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Recent Files */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Documents</h3>
           <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {reportsList.map((file) => (
                 <div key={file.id} className="group p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                          file.type === 'PDF' ? 'bg-red-50 border-red-100' :
                          file.type === 'EXCEL' ? 'bg-emerald-50 border-emerald-100' :
                          file.type === 'ZIP' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
                       }`}>
                          {getFileIcon(file.type)}
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.date} • {file.size}</p>
                       </div>
                    </div>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors p-2 rounded-full hover:bg-white">
                       <Download size={18} />
                    </button>
                 </div>
              ))}
           </div>
           <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              View All Documents
           </button>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
               <Filter size={20} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Reports</p>
               <p className="text-xl font-bold text-slate-900">1,248</p>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
               <CheckCircle2 size={20} />
            </div>
            <div className="w-full">
               <div className="flex justify-between items-center mb-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Compliance</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 rounded">100%</span>
               </div>
               <div className="w-full bg-emerald-100 h-1.5 rounded-full">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
               </div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
               <Clock size={20} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Next Deadline</p>
               <p className="text-lg font-bold text-slate-900">Feb 09</p>
               <p className="text-xs text-red-500 font-medium">PAYE Returns</p>
            </div>
         </div>

         <div className="bg-linear-to-br from-slate-900 to-slate-800 p-5 rounded-xl shadow-sm flex items-center justify-between text-white relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Quick Action</p>
               <p className="font-bold text-lg">Generate P10</p>
            </div>
            <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
               <Download size={20} />
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full"></div>
         </div>
      </div>
    </div>
  );
};

export default Reports;