// src/components/pages/Payroll.tsx
import Header from '../layout/Header';

// 1. Types
interface PayrollRecord {
  id: string;
  employee: string;
  role: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number; // The final amount they get
  status: 'Paid' | 'Pending' | 'Processing';
  date: string;
}

// 2. Helper to format money (e.g., 50000 -> "KES 50,000")
const formatCurrency = (amount: number) => {
  return "KES " + amount.toLocaleString();
};

// 3. Dummy Data
const payrollData: PayrollRecord[] = [
  { id: 'PAY-001', employee: 'John Kamau', role: 'Senior Developer', basicSalary: 120000, allowances: 10000, deductions: 25000, netPay: 105000, status: 'Paid', date: '28 Dec 2025' },
  { id: 'PAY-002', employee: 'Sarah Wanjiku', role: 'Legal Counsel', basicSalary: 90000, allowances: 5000, deductions: 18000, netPay: 77000, status: 'Paid', date: '28 Dec 2025' },
  { id: 'PAY-003', employee: 'Michael Omondi', role: 'HR Manager', basicSalary: 80000, allowances: 2000, deductions: 15000, netPay: 67000, status: 'Processing', date: '28 Jan 2026' },
  { id: 'PAY-004', employee: 'Brian Koech', role: 'Sales Rep', basicSalary: 45000, allowances: 15000, deductions: 8000, netPay: 52000, status: 'Pending', date: '28 Jan 2026' },
];

const Payroll = () => {
  return (
    <div className="p-8">
      <Header 
        title="Payroll" 
        subtitle="Manage salaries and transactions"
        user={{ name: "John Kamau", role: "Admin", initials: "JK" }}
      />

      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
           {/* Month Filter */}
           <select className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
             <option>January 2026</option>
             <option>December 2025</option>
           </select>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-sm border border-slate-300">
            Export Report
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>⚡</span> Run Payroll
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Basic Salary</th>
              <th className="p-4 text-emerald-600">Allowances (+)</th>
              <th className="p-4 text-red-600">Deductions (-)</th>
              <th className="p-4 font-bold text-slate-800">Net Pay</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrollData.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                
                <td className="p-4">
                  <p className="font-medium text-slate-900">{record.employee}</p>
                  <p className="text-xs text-slate-400">{record.role}</p>
                </td>

                <td className="p-4 text-slate-600">{formatCurrency(record.basicSalary)}</td>
                <td className="p-4 text-emerald-600">{formatCurrency(record.allowances)}</td>
                <td className="p-4 text-red-600">{formatCurrency(record.deductions)}</td>
                
                <td className="p-4 font-bold text-slate-900 text-base">
                  {formatCurrency(record.netPay)}
                </td>

                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    record.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                    record.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {record.status}
                  </span>
                </td>

                <td className="p-4">
                  <button className="text-slate-400 hover:text-emerald-600 font-medium text-xs border border-slate-200 px-3 py-1 rounded bg-white hover:border-emerald-300">
                    Payslip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;