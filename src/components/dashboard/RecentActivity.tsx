import { Link } from 'react-router-dom';

const activities = [
  { id: 1, title: 'Payroll Run: December 2025', time: '2 hours ago', type: 'Payroll', status: 'Completed' },
  { id: 2, title: 'New Employee Added: Juma Mpesa', time: '5 hours ago', type: 'Employee', status: 'Success' },
  { id: 3, title: 'KRA P10 Report Generated', time: '1 day ago', type: 'Report', status: 'Pending' },
  { id: 4, title: 'NSSF Payment Processed', time: '2 days ago', type: 'Compliance', status: 'Completed' },
];

const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <Link to="/reports" className="text-sm text-emerald-600 font-medium hover:underline">View All</Link>
      </div>

      <div className="space-y-6">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            {/* Timeline Dot */}
            <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-50" />
            
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
            </div>
            
            <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;