import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Loader2, Users } from 'lucide-react';

interface DepartmentData {
  department: string; // Matches backend .values('department')
  count: number;      // Matches backend .annotate(count=...)
}

interface DisplayDepartment {
  name: string;
  count: number;
  percentage: number;
  colorClass: string;
}

const COLORS = [
  'bg-indigo-500', 
  'bg-emerald-500', 
  'bg-amber-500', 
  'bg-blue-500', 
  'bg-rose-500', 
  'bg-purple-500',
  'bg-cyan-500'
];

const DepartmentStats = () => {
  const [departments, setDepartments] = useState<DisplayDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/employees/department-stats/');
        const rawData: DepartmentData[] = response.data;

        // 1. Calculate Total Employees to determine percentages
        const totalEmployees = rawData.reduce((sum, item) => sum + item.count, 0);

        // 2. Transform Data for UI
        const processed = rawData.map((item, index) => ({
          name: item.department || 'Unassigned', // Handle empty department
          count: item.count,
          percentage: totalEmployees > 0 ? Math.round((item.count / totalEmployees) * 100) : 0,
          // Cycle through colors so we never run out
          colorClass: COLORS[index % COLORS.length]
        }));

        setDepartments(processed);
      } catch (err) {
        console.error("Failed to load department stats", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6 h-full min-h-[320px]">
      
      {/* Header */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Employee Distribution</h3>
        <p className="text-slate-500 text-sm">By Department</p>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading...
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
            <p>Failed to load data.</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
            <Users size={32} className="mb-2 opacity-20" />
            <p>No employees found.</p>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {departments.map((dept) => (
              <div key={dept.name}>
                
                {/* Label Row */}
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700 truncate max-w-[150px]" title={dept.name}>
                    {dept.name}
                  </span>
                  <span className="text-slate-500">{dept.count} Members</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${dept.colorClass} transition-all duration-1000 ease-out`} 
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          View All Departments
        </button>
      </div>
    </div>
  );
};

export default DepartmentStats;