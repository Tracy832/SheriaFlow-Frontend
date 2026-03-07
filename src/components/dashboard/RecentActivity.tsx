import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Activity } from 'lucide-react';
import api from '../../api/axios';

interface ActivityItem {
  id: string;
  title: string;
  time: string; 
  type: 'Payroll' | 'Employee' | 'Report' | 'Compliance';
  status: string;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get('/activity/');
        setActivities(response.data);
      } catch (err) {
        console.error("Failed to load activity", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm h-full min-h-[320px] flex flex-col transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <Link to="/reports" className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline transition-colors">View All</Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 gap-2">
             <Loader2 className="animate-spin" size={20} /> Loading...
          </div>
        ) : activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
             <Activity size={32} className="mb-2 opacity-20" />
             <p>No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activities.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ring-4 transition-colors ${
                    item.type === 'Payroll' ? 'bg-emerald-500 ring-emerald-50 dark:ring-emerald-500/20' : 
                    item.type === 'Employee' ? 'bg-blue-500 ring-blue-50 dark:ring-blue-500/20' : 
                    'bg-slate-500 ring-slate-50 dark:ring-slate-500/20'
                }`} />
                
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 line-clamp-1 transition-colors" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">{getTimeAgo(item.time)}</p>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                    item.type === 'Payroll' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                    item.type === 'Employee' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' :
                    'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;