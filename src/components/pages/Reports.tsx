import { useState, useEffect, useMemo } from 'react';
import Header from '../layout/Header';
import api from '../../api/axios';
import { 
  FileText, Download, Filter, Search, 
  Calendar, CheckCircle, Clock, Sparkles, Loader2, FileSpreadsheet,
  ChevronDown
} from 'lucide-react';

// --- Types ---
interface PayrollRun {
  id: number;
  month: number;
  year: number;
  status: string;
  created_at: string;
}

interface ReportDoc {
  id: string;
  runId: number;
  title: string;
  type: 'Tax' | 'Bank' | 'Compliance';
  date: string; // Display string e.g., "Jan 2026"
  rawDate: Date; // For sorting/filtering
  year: number;
  url: string;
  filename: string;
}

interface ChartDataPoint {
  name: string; // e.g., "Jan"
  gross: number;
  deductions: number;
}

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [allDocuments, setAllDocuments] = useState<ReportDoc[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState({ total: 0, compliance: 100 });

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Tax' | 'Bank'>('All');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // --- 1. Fetch Data on Load ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Payroll Runs (For Documents)
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
        
        // Sort by newest first
        generatedDocs.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
        setAllDocuments(generatedDocs);
        setStats({ total: generatedDocs.length, compliance: 100 });

        // B. Fetch Chart Data
        const chartRes = await api.get('/payroll/chart-data/');
        setChartData(chartRes.data);

      } catch (error) {
        console.error("Failed to fetch reports data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. Filtering Logic ---
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      // Filter by Year
      if (doc.year !== selectedYear) return false;

      // Filter by Category Tab
      if (activeCategory !== 'All' && doc.type !== (activeCategory === 'Bank' ? 'Bank' : 'Tax')) return false;

      // Filter by Search
      if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [allDocuments, selectedYear, activeCategory, searchQuery]);

  // --- 3. Dynamic Chart Max Calculation ---
  const maxChartValue = Math.max(...chartData.map(d => d.gross), 100000); // Default to 100k to prevent div/0

  // --- 4. Download Handler ---
  const handleDownload = async (doc: ReportDoc) => {
    try {
      setIsLoading(true);
      const response = await api.get(doc.url, { responseType: 'blob' });
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', doc.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500" onClick={() => setShowYearDropdown(false)}>
      
      <Header 
        title="Reports" 
        subtitle="Manage compliance documents and financial summaries"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* Interactive Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          
          {/* Year Filter Dropdown */}
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

          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {/* Category Tabs */}
          {(['All', 'Tax', 'Bank'] as const).map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                 activeCategory === cat 
                   ? 'bg-slate-900 text-white shadow-md' 
                   : 'text-slate-500 hover:bg-slate-100'
               }`}
             >
               {cat === 'Bank' ? 'Bank Files' : cat}
             </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..." 
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Payroll Cost Analysis</h3>
            <p className="text-sm text-slate-500 mb-6">Total disbursement trends for {selectedYear}</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 gap-4 min-h-[250px] relative">
             {/* Y-Axis Grid Lines (Visual only) */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
             </div>

             {chartData.length === 0 ? (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm">
                   No chart data available for this period.
                </div>
             ) : (
                chartData.map((data, index) => {
                   const heightPercent = (data.gross / maxChartValue) * 100;
                   return (
                     <div key={index} className="w-full flex flex-col justify-end items-center h-full group relative z-10">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                            KES {data.gross.toLocaleString()}
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-full max-w-[50px] bg-emerald-500 rounded-t-lg transition-all duration-500 ease-out hover:bg-emerald-600 relative"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        
                        {/* Label */}
                        <div className="mt-3 text-xs font-medium text-slate-500">{data.name}</div>
                     </div>
                   );
                })
             )}
          </div>
        </div>

        {/* Dynamic Documents List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-6">Available Documents</h3>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar flex-1">
            {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-emerald-500"/></div>
            ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-10">
                   <p className="text-slate-400 text-sm mb-2">No reports found.</p>
                   {searchQuery && <p className="text-xs text-red-400">Try clearing your search filters.</p>}
                </div>
            ) : (
                filteredDocuments.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                    <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${doc.type === 'Tax' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {doc.type === 'Tax' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{doc.title}</h4>
                        <p className="text-xs text-slate-500">{doc.date}</p>
                    </div>
                    </div>
                    
                    <button 
                    onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm"
                    title="Download File"
                    >
                    <Download size={18} />
                    </button>
                </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Filter size={20} /></div>
           <div>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Reports</p>
             <h4 className="text-xl font-bold text-slate-900">{stats.total}</h4>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
           <div>
             <div className="flex justify-between items-center mb-1 gap-2">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Compliance</p>
               <span className="text-xs font-bold text-emerald-600">100%</span>
             </div>
             <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full rounded-full"></div>
             </div>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
           <div>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Next Deadline</p>
             <h4 className="text-lg font-bold text-slate-900">Feb 09</h4>
             <p className="text-[10px] text-red-500 font-medium">PAYE Returns</p>
           </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl shadow-lg flex items-center justify-between text-white relative overflow-hidden cursor-pointer group hover:shadow-emerald-500/20 transition-all">
           <div className="relative z-10">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Quick Action</p>
             <h4 className="text-lg font-bold">Generate P10</h4>
           </div>
           <div className="p-2 bg-white/10 rounded-lg relative z-10 group-hover:bg-emerald-500 transition-colors">
              <Download size={20} />
           </div>
           <div className="absolute right-[-20px] bottom-[-20px] text-white/5 group-hover:text-white/10 transition-colors">
              <Sparkles size={100} />
           </div>
        </div>
      </div>

    </div>
  );
};

export default Reports;