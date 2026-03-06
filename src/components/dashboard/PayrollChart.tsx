import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

// Define the data shape
interface ChartData {
  name: string;      
  gross: number;
  deductions: number;
}

const PayrollChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Observer to watch for dark mode class changes on the HTML element
  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark(); // Initial check

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/payroll/chart-data/');
        setData(response.data);
      } catch (err) {
        console.error("Failed to load chart data", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm h-full min-h-[400px] flex flex-col transition-colors duration-200">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200">Payroll Overview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">Gross Pay vs Deductions (Last 6 Months)</p>
        </div>
        
        {!isLoading && !error && data.length > 0 && (
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-900 dark:bg-slate-200 transition-colors duration-200"></span>
                <span className="text-xs text-slate-600 dark:text-slate-300 transition-colors duration-200">Gross Pay</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-600 dark:text-slate-300 transition-colors duration-200">Deductions</span>
             </div>
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="flex-1 w-full min-h-[300px]">
        {isLoading ? (
           <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
              <Loader2 className="animate-spin" /> Loading data...
           </div>
        ) : error ? (
           <div className="h-full flex items-center justify-center text-red-400 text-sm">
              Failed to load chart data.
           </div>
        ) : data.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <TrendingUp size={48} className="mb-2 opacity-20" />
              <p className="text-sm">No payroll history found.</p>
           </div>
        ) : (
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data} barSize={32}>
               <CartesianGrid 
                 strokeDasharray="3 3" 
                 vertical={false} 
                 stroke={isDark ? '#334155' : '#f1f5f9'} // Adapts grid lines
               />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} // Adapts text
                 dy={10} 
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12}} 
                 tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
               />
               <Tooltip 
                 cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}} // Adapts hover background
                 contentStyle={{
                   borderRadius: '8px', 
                   border: 'none', 
                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                   backgroundColor: isDark ? '#0f172a' : '#ffffff', // Adapts tooltip box
                   color: isDark ? '#f8fafc' : '#0f172a'
                 }}
                 formatter={(value: number | string | undefined) => [
                    `KES ${Number(value || 0).toLocaleString()}`, 
                    ''
                 ]}
               />
               <Bar 
                 name="Gross Pay" 
                 dataKey="gross" 
                 fill={isDark ? '#e2e8f0' : '#0f172a'} // White in dark mode, Black in light
                 radius={[4, 4, 0, 0]} 
               />
               <Bar 
                 name="Deductions" 
                 dataKey="deductions" 
                 fill="#10b981" // Emerald stays the same
                 radius={[4, 4, 0, 0]} 
               />
             </BarChart>
           </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PayrollChart;