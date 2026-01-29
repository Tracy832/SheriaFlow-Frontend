import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Activity } from 'lucide-react';
import api from '../../api/axios';

// Define the shape of our API response
interface ActivityItem {
  id: string;
  title: string;
  time: string; // ISO Date String from backend
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

  // Helper to format "2 hours ago"
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
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-full min-h-[320px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <Link to="/reports" className="text-sm text-emerald-600 font-medium hover:underline">View All</Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400 gap-2">
             <Loader2 className="animate-spin" size={20} /> Loading...
          </div>
        ) : activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
             <Activity size={32} className="mb-2 opacity-20" />
             <p>No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activities.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ring-4 ${
                    item.type === 'Payroll' ? 'bg-emerald-500 ring-emerald-50' : 
                    item.type === 'Employee' ? 'bg-blue-500 ring-blue-50' : 
                    'bg-slate-500 ring-slate-50'
                }`} />
                
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{getTimeAgo(item.time)}</p>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                    item.type === 'Payroll' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    item.type === 'Employee' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-slate-50 text-slate-600 border-slate-200'
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