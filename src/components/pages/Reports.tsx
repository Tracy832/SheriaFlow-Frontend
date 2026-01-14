// src/components/pages/Reports.tsx
import Header from '../layout/Header';

const Reports = () => {
  // 1. Updated Data: Added specific 'tooltip' messages for each file
  const reportsList = [
    { 
      id: 101, 
      name: 'Bank Transfer File (EFT)', 
      date: 'Jan 28, 2026', 
      size: '45 KB', 
      type: 'Excel',
      tooltip: 'Download Transfer List' 
    },
    { 
      id: 102, 
      name: 'Employee Payslips (Bulk)', 
      date: 'Jan 28, 2026', 
      size: '12.4 MB', 
      type: 'ZIP',
      tooltip: 'Download PDF Bundle' 
    },
    { 
      id: 1, 
      name: 'KRA PAYE Returns (P10)', 
      date: 'Jan 2026', 
      size: '1.2 MB', 
      type: 'PDF',
      tooltip: 'Download For iTax' 
    },
    { 
      id: 2, 
      name: 'NSSF Contributions', 
      date: 'Jan 2026', 
      size: '850 KB', 
      type: 'CSV',
      tooltip: 'Download Report' 
    },
    { 
      id: 3, 
      name: 'SHIF / NHIF Report', 
      date: 'Jan 2026', 
      size: '1.4 MB', 
      type: 'Excel',
      tooltip: 'Download Report' 
    },
    { 
      id: 4, 
      name: 'Housing Levy Summary', 
      date: 'Jan 2026', 
      size: '600 KB', 
      type: 'PDF',
      tooltip: 'Download Report' 
    },
  ];

  // 2. Chart Data
  const chartData = [
    { month: 'Aug', height: 'h-24', amount: '4.8M', color: 'bg-slate-300' },
    { month: 'Sep', height: 'h-28', amount: '4.9M', color: 'bg-slate-300' },
    { month: 'Oct', height: 'h-32', amount: '5.1M', color: 'bg-slate-300' },
    { month: 'Nov', height: 'h-20', amount: '4.5M', color: 'bg-slate-300' },
    { month: 'Dec', height: 'h-40', amount: '5.8M', color: 'bg-emerald-500' },
    { month: 'Jan', height: 'h-36', amount: '5.2M', color: 'bg-slate-800' },
  ];

  return (
    <div className="p-8">
      <Header 
        title="Reports" 
        subtitle="Wednesday, 14 January 2026"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      <div className="space-y-8">
        
        {/* SECTION 1: Period Selector */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-4">
             <h3 className="font-bold text-slate-900 text-lg">Reports & Documents</h3>
             <p className="text-slate-500 text-sm">Download payroll reports and compliance documents</p>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-3">Select Reporting Period</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><span>📅</span> Month</label>
                <select className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 bg-white">
                  <option>January</option>
                  <option>December</option>
                  <option>November</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1"><span>🗓️</span> Year</label>
                <select className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 bg-white">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-8 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Payroll Cost History</h3>
              <span className="text-sm text-slate-500">Aug 2025 - Jan 2026</span>
            </div>
            <div className="flex items-end justify-between h-64 px-4 border-b border-slate-100 pb-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded mb-1">
                    {item.amount}
                  </span>
                  <div className={`w-12 rounded-t-lg transition-all duration-300 hover:opacity-80 ${item.height} ${item.color}`}></div>
                  <span className="text-sm font-medium text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads List with Tooltips */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-1">Downloads</h3>
            <p className="text-slate-500 text-sm mb-6">Payslips, EFT files & Returns</p>
            
            <div className="space-y-4">
              {reportsList.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group relative">
                  
                  {/* The Tooltip (Hidden by default, shown on hover) */}
                  <div className="absolute -top-10 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {file.tooltip}
                    {/* Tiny arrow pointing down */}
                    <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800"></div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                      file.type === 'PDF' ? 'bg-red-100 text-red-700' : 
                      file.type === 'Excel' ? 'bg-green-100 text-green-700' :
                      file.type === 'ZIP' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {file.type}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm group-hover:text-emerald-800">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.date} • {file.size}</p>
                    </div>
                  </div>
                  
                  {/* Download Button */}
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                    ⬇
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: Report Summary Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">📂</div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Reports</p>
              <p className="text-xl font-bold text-slate-900">1,248</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">⬇️</div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Last Download</p>
              <p className="text-xl font-bold text-slate-900">Just now</p>
            </div>
          </div>

          {/* Compliance Status: Percentage */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">🛡️</div>
            <div className="w-full">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Compliance Status</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">100%</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Excellent</span>
              </div>
              {/* Mini Progress Bar */}
              <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⏳</div>
            <div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Next Deadline</p>
              <p className="text-lg font-bold text-slate-900">Feb 09, 2026</p>
              <p className="text-xs text-red-500 font-medium">PAYE Returns</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Reports;