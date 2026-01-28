import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

interface PayrollEntry {
  id: string;
  employee: {
    first_name: string;
    last_name: string;
    department: string;
  };
  net_pay: string | number;
  created_at: string;
  is_paid: boolean;
}

const RecentPayrolls = () => {
  const [payrolls, setPayrolls] = useState<PayrollEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await api.get('/payroll/payroll/');
        // Take only the last 5 items
        setPayrolls(response.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch recent payrolls", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-900">Recent Transactions</h3>
        <button 
          onClick={() => navigate('/payroll')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Net Pay</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrolls.length === 0 ? (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No recent transactions.</td>
                </tr>
            ) : (
                payrolls.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                        {/* FIX: Render the Name string, not the Object */}
                        {item.employee.first_name} {item.employee.last_name}
                        <div className="text-xs text-slate-400 font-normal">{item.employee.department}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                        KES {Number(item.net_pay).toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                        {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        item.is_paid 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                        {item.is_paid ? 'Paid' : 'Pending'}
                    </span>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPayrolls;