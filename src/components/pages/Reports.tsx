import { useState, useEffect, useMemo } from 'react';
import Header from '../layout/Header';
import api from '../../api/axios';
import { 
  FileText, Download, Search, 
  Calendar, Loader2, FileSpreadsheet,
  ChevronDown, Building2, Wallet, Mail, CheckCircle
} from 'lucide-react';

// --- Types ---
interface PayrollRun {
  id: number;
  month: number;
  year: number;
  status: string;
  created_at: string;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    kra_pin?: string;
}

interface ReportDoc {
  id: string;
  runId: number;
  title: string;
  type: 'Tax' | 'Bank' | 'Compliance';
  date: string;
  rawDate: Date;
  year: number;
  url: string;
  filename: string;
}

interface ChartDataPoint {
  name: string;
  gross: number;
  deductions: number;
}

interface StatutorySummary {
    total_paye: number;
    total_nssf_employee: number;
    total_nssf_employer: number;
    total_shif: number;
    total_housing_employee: number;
    total_housing_employer: number;
    total_nita: number;
}

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isStatutoryLoading, setIsStatutoryLoading] = useState(false);
  
  // Data State
  const [allDocuments, setAllDocuments] = useState<ReportDoc[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [statutoryStats, setStatutoryStats] = useState<StatutorySummary | null>(null);
  const [currentRunId, setCurrentRunId] = useState<number | null>(null);
  
  // P9 Generator State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tax' | 'Bank'>('All');
  
  // Default to current month/year for Statutory view
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // --- 1. Fetch Historical Data & Employees ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Payroll Runs (Archive)
        const runsRes = await api.get('/payroll/runs/');
        const runs: PayrollRun[] = runsRes.data;

        const generatedDocs: ReportDoc[] = runs.flatMap((run) => {
            const dateObj = new Date(run.year, run.month - 1);
            const dateStr = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            return [
                {
                    id: `p10-${run.id}`,
                    runId: run.id,
                    title: `KRA P10 Returns (${dateStr})`,
                    type: 'Tax',
                    date: dateStr,
                    rawDate: dateObj,
                    year: run.year,
                    url: `/payroll/download-p10/${run.id}/`,
                    filename: `KRA_P10_Return_${run.month}_${run.year}.xlsx`
                },
                {
                    id: `bank-${run.id}`,
                    runId: run.id,
                    title: `Bank Transfer File (${dateStr})`,
                    type: 'Bank',
                    date: dateStr,
                    rawDate: dateObj,
                    year: run.year,
                    url: `/payroll/download-bank/${run.id}/`,
                    filename: `Bank_Transfer_${run.month}_${run.year}.xlsx`
                }
            ];
        });
        
        generatedDocs.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        setAllDocuments(generatedDocs);

        // B. Chart Data
        const chartRes = await api.get('/payroll/chart-data/');
        setChartData(chartRes.data);

        // C. Employees (For P9)
        const empRes = await api.get('/employees/');
        setEmployees(empRes.data);

      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. Fetch Statutory Summary (When Month/Year Changes) ---
  useEffect(() => {
    const fetchStatutory = async () => {
        setIsStatutoryLoading(true);
        setStatutoryStats(null);
        setCurrentRunId(null);
        
        try {
            const response = await api.get(`/payroll/reports/deductions-summary/?month=${selectedMonth}&year=${selectedYear}`);
            setStatutoryStats(response.data.data);
            
            // Find Run ID for this specific month to enable downloads
            const runsRes = await api.get('/payroll/runs/');
            const matchingRun = runsRes.data.find((r: PayrollRun) => r.month === selectedMonth && r.year === selectedYear);
            if (matchingRun) {
                setCurrentRunId(matchingRun.id);
            }

        } catch (error) {
            console.log("No statutory data for selected period", error);
        } finally {
            setIsStatutoryLoading(false);
        }
    };

    fetchStatutory();
  }, [selectedMonth, selectedYear]);

  // --- 3. Filtering Logic (Archive) ---
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      if (doc.year !== selectedYear) return false;
      if (activeCategory !== 'All' && doc.type !== (activeCategory === 'Bank' ? 'Bank' : 'Tax')) return false;
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allDocuments, selectedYear, activeCategory, searchQuery]);

  // --- 4. Chart Logic ---
  const maxChartValue = Math.max(...chartData.map(d => d.gross), 100000); 

  // --- 5. Actions Handlers ---
  const handleGenericDownload = async (doc: ReportDoc) => {
    triggerDownload(doc.url, doc.filename);
  };

  const handleStatutoryDownload = (type: 'nssf' | 'shif' | 'housing') => {
      if (!currentRunId) {
          alert("No payroll run found for this period. Please generate payroll first.");
          return;
      }
      const url = `/payroll/reports/download-statutory/?run_id=${currentRunId}&type=${type}`;
      const filename = `${type.toUpperCase()}_Return_${selectedMonth}_${selectedYear}.${type === 'housing' ? 'csv' : 'xlsx'}`;
      triggerDownload(url, filename);
  };

  const handleEmailP9 = async () => {
    if (!selectedEmployee) return alert("Please select an employee first.");
    setSendingEmail(true);
    try {
        await api.post('/payroll/reports/email-p9/', {
            employee_id: selectedEmployee,
            year: selectedYear
        });
        alert("Success! P9 Form has been emailed to the employee.");
    } catch (err) {
        console.error(err);
        alert("Failed to email P9 Form. Please ensure the employee has a valid email address.");
    } finally {
        setSendingEmail(false);
    }
  };

  const triggerDownload = async (url: string, filename: string) => {
    try {
        const response = await api.get(url, { responseType: 'blob' });
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Download failed", error);
        alert("Failed to download file. Ensure you are logged in.");
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500" onClick={() => setShowYearDropdown(false)}>
      
      <Header 
        title="Reports & Compliance" 
        subtitle="Statutory returns, tax cards, and financial audit trails"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* --- FILTER BAR --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-30">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          
          {/* Month Picker */}
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer hover:border-emerald-300 transition-colors"
          >
            {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>

          {/* Year Picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Calendar size={16} /> {selectedYear} <ChevronDown size={14} />
            </button>
            {showYearDropdown && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1">
                {[2024, 2025, 2026].map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-emerald-700 ${selectedYear === year ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-slate-600'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 transition-all" 
          />
        </div>
      </div>

      {/* --- SECTION 1: STATUTORY SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {isStatutoryLoading ? (
             <div className="col-span-4 p-12 text-center bg-white border border-dashed border-slate-200 rounded-xl">
                 <Loader2 className="animate-spin inline text-emerald-500 mr-2 h-6 w-6"/> 
                 <span className="text-slate-500">Loading statutory data...</span>
             </div>
          ) : !statutoryStats ? (
             <div className="col-span-4 bg-amber-50 p-8 rounded-xl border border-amber-100 text-center">
                <p className="text-amber-800 font-medium mb-1">No data available for this period</p>
                <p className="text-amber-600/80 text-sm">
                    No payroll run found for <strong>{new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</strong>. 
                    Generate payroll to see statutory obligations.
                </p>
             </div>
          ) : (
            <>
                {/* Cards Container */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg"><Building2 size={20} className="text-slate-600"/></div>
                        <span className="text-slate-500 font-medium text-sm">PAYE (KRA)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">KES {statutoryStats.total_paye?.toLocaleString()}</p>
                    <div className="mt-2 flex items-center text-xs text-slate-400 gap-1">
                        <CheckCircle size={12} className="text-emerald-500"/> Due 9th next month
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg"><Building2 size={20} className="text-amber-600"/></div>
                        <span className="text-slate-500 font-medium text-sm">Housing Levy (1.5%)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        KES {(statutoryStats.total_housing_employee + statutoryStats.total_housing_employer)?.toLocaleString()}
                    </p>
                    <div className="mt-2 text-xs text-amber-600 flex justify-between font-medium bg-amber-50 px-2 py-1 rounded">
                        <span>Emp: {statutoryStats.total_housing_employee?.toLocaleString()}</span>
                        <span>Co: {statutoryStats.total_housing_employer?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg"><Wallet size={20} className="text-blue-600"/></div>
                        <span className="text-slate-500 font-medium text-sm">NSSF (Tier I & II)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        KES {(statutoryStats.total_nssf_employee + statutoryStats.total_nssf_employer)?.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 px-2 py-1 rounded inline-block">Matched 100% by Employer</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg"><Building2 size={20} className="text-purple-600"/></div>
                        <span className="text-slate-500 font-medium text-sm">SHIF (SHA)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">KES {statutoryStats.total_shif?.toLocaleString()}</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium bg-purple-50 px-2 py-1 rounded inline-block">2.75% of Gross Pay</p>
                </div>
            </>
          )}
      </div>

      {/* --- SECTION 2: COMPANY ACTIONS (Downloads & P9) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* A. Statutory Downloads */}
          <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm ${!statutoryStats ? 'opacity-50 pointer-events-none' : ''}`}>
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-md"><Download size={16}/></div>
                Monthly Returns
             </h3>
             <div className="space-y-3">
                <button onClick={() => handleStatutoryDownload('nssf')} className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet size={18} className="text-blue-600"/>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">NSSF Return (Excel)</span>
                    </div>
                    <Download size={14} className="text-slate-400 group-hover:text-blue-600"/>
                </button>

                <button onClick={() => handleStatutoryDownload('housing')} className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-amber-300 hover:bg-amber-50/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet size={18} className="text-amber-600"/>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-amber-700">Housing Levy (CSV)</span>
                    </div>
                    <Download size={14} className="text-slate-400 group-hover:text-amber-600"/>
                </button>

                <button onClick={() => handleStatutoryDownload('shif')} className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
                    <div className="flex items-center gap-3">
                        <FileSpreadsheet size={18} className="text-purple-600"/>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700">SHIF / SHA (Excel)</span>
                    </div>
                    <Download size={14} className="text-slate-400 group-hover:text-purple-600"/>
                </button>
             </div>
          </div>

          {/* B. Employee P9 Generator */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
             <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md"><Mail size={16}/></div>
                Email Tax Cards (P9)
             </h3>
             <p className="text-xs text-slate-500 mb-6">Select an employee to generate and email their P9 form for the year <strong>{selectedYear}</strong>.</p>
             
             <div className="mt-auto space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Select Employee</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                        >
                            <option value="">-- Choose Employee --</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none"/>
                    </div>
                </div>
                
                <button 
                    onClick={handleEmailP9}
                    disabled={!selectedEmployee || sendingEmail}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all font-medium shadow-sm hover:shadow-indigo-500/20"
                >
                    {sendingEmail ? (
                        <>
                            <Loader2 size={18} className="animate-spin"/> Sending Email...
                        </>
                    ) : (
                        <>
                            <Mail size={16} /> Send P9 Form
                        </>
                    )}
                </button>
             </div>
          </div>
      </div>


      {/* --- SECTION 3: CHARTS & ARCHIVE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
        
        {/* Dynamic Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Payroll Cost Trends</h3>
            <p className="text-sm text-slate-500 mb-6">Annual disbursement analysis</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 gap-4 min-h-[250px] relative">
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
             </div>

             {chartData.length === 0 ? (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm">No chart data available.</div>
             ) : (
                chartData.map((data, index) => {
                   const heightPercent = (data.gross / maxChartValue) * 100;
                   return (
                     <div key={index} className="w-full flex flex-col justify-end items-center h-full group relative z-10">
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                            KES {data.gross.toLocaleString()}
                        </div>
                        <div className="w-full max-w-[50px] bg-emerald-500 rounded-t-lg transition-all duration-500 ease-out hover:bg-emerald-600 relative" style={{ height: `${heightPercent}%` }}></div>
                        <div className="mt-3 text-xs font-medium text-slate-500">{data.name}</div>
                     </div>
                   );
                })
             )}
          </div>
        </div>

        {/* Historical Documents List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Document Archive</h3>
            <div className="flex gap-2">
                {(['All', 'Tax', 'Bank'] as const).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-[10px] px-2 py-1 rounded-md transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{cat}</button>
                ))}
            </div>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex-1">
            {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-emerald-500"/></div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-10">
                   <p className="text-slate-400 text-sm">No historical documents found.</p>
                </div>
            ) : (
                filteredDocuments.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer" onClick={() => handleGenericDownload(doc)}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${doc.type === 'Tax' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {doc.type === 'Tax' ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 text-xs">{doc.title}</h4>
                            <p className="text-[10px] text-slate-500">{doc.date}</p>
                        </div>
                    </div>
                    <button 
                        className="p-1.5 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm"
                    >
                        <Download size={16} />
                    </button>
                </div>
                ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Reports;