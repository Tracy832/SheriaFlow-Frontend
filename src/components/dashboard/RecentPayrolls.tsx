// src/components/dashboard/RecentPayrolls.tsx

// 1. Define the shape of a payroll record
interface PayrollRecord {
  id: string;
  employee: string;
  department: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

// 2. Dummy Data (In a real app, this comes from an API)
const recentData: PayrollRecord[] = [
  { id: 'TRX-981', employee: 'Sarah Wanjiku', department: 'Legal', date: 'Jan 05, 2026', amount: 45000, status: 'Completed' },
  { id: 'TRX-982', employee: 'David Omondi', department: 'IT', date: 'Jan 05, 2026', amount: 82000, status: 'Completed' },
  { id: 'TRX-983', employee: 'Brian K.', department: 'Sales', date: 'Jan 04, 2026', amount: 35000, status: 'Pending' },
  { id: 'TRX-984', employee: 'Lucy A.', department: 'HR', date: 'Jan 04, 2026', amount: 50000, status: 'Completed' },
];

const RecentPayrolls = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Table Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View All</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Department</th>
              <th className="p-4">Date</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{item.employee}</td>
                <td className="p-4">{item.department}</td>
                <td className="p-4">{item.date}</td>
                <td className="p-4">KES {item.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPayrolls;