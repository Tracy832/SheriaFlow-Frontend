import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string; 
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors duration-200">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight transition-colors duration-200">{value}</h3>
          
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium transition-colors duration-200 ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-1">{trend} from last month</span>
            </div>
          )}
        </div>
        
        {/* Icon Box */}
        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;