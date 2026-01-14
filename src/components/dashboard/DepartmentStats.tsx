// src/components/dashboard/DepartmentStats.tsx

interface Department {
  name: string;
  count: number;
  percentage: number; // For the progress bar width
  colorClass: string; // Tailwind color for the bar
}

const departments: Department[] = [
  { name: 'Engineering', count: 45, percentage: 45, colorClass: 'bg-indigo-500' },
  { name: 'Sales & Marketing', count: 32, percentage: 32, colorClass: 'bg-emerald-500' },
  { name: 'Human Resources', count: 12, percentage: 12, colorClass: 'bg-amber-500' },
  { name: 'Legal', count: 8, percentage: 8, colorClass: 'bg-slate-500' },
  { name: 'Finance', count: 30, percentage: 30, colorClass: 'bg-blue-500' },
];

const DepartmentStats = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 h-full">
      
      {/* Header */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Employee Distribution</h3>
        <p className="text-slate-500 text-sm">By Department</p>
      </div>

      {/* List with Progress Bars */}
      <div className="space-y-5">
        {departments.map((dept) => (
          <div key={dept.name}>
            
            {/* Label Row */}
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">{dept.name}</span>
              <span className="text-slate-500">{dept.count} Members</span>
            </div>
            
            {/* Progress Bar Background */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              {/* The Colored Bar (Dynamic Width) */}
              <div 
                className={`h-2.5 rounded-full ${dept.colorClass}`} 
                style={{ width: `${dept.percentage}%` }}
              ></div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Footer / Call to Action */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          View All Departments
        </button>
      </div>
    </div>
  );
};

export default DepartmentStats;