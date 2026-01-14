// src/components/common/StatCard.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string; // Using string for emojis for now
  iconColorClass?: string; 
  subBadge?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconColorClass = "bg-gray-100 text-gray-600",
  subBadge 
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 min-w-[240px]">
      {/* Header: Title + Icon */}
      <div className="flex justify-between items-start">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${iconColorClass}`}>
          {icon}
        </div>
      </div>
      
      {/* Body: Value + Badge */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
        {subBadge && (
          <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
            {subBadge}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;