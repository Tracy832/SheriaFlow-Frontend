// src/components/common/StatCard.tsx
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react'; // <--- Added 'type' here

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string; 
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{value}</h3>
          
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="ml-1">{trend} from last month</span>
            </div>
          )}
        </div>
        
        {/* Icon Box */}
        <div className="p-3 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;