import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jul', gross: 400000, deductions: 240000 },
  { name: 'Aug', gross: 450000, deductions: 260000 },
  { name: 'Sep', gross: 430000, deductions: 230000 },
  { name: 'Oct', gross: 480000, deductions: 280000 },
  { name: 'Nov', gross: 500000, deductions: 290000 },
  { name: 'Dec', gross: 550000, deductions: 300000 },
];

const PayrollChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Payroll Overview</h3>
          <p className="text-sm text-slate-500">Gross Pay vs Deductions (Last 6 Months)</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-3 h-3 rounded-full bg-slate-900"></span><span className="text-xs text-slate-600 mr-3">Gross Pay</span>
           <span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-xs text-slate-600">Deductions</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
            <Bar dataKey="gross" fill="#0f172a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="deductions" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PayrollChart;