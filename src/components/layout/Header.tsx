// src/components/layout/Header.tsx

interface HeaderProps {
  title: string;
  subtitle: string;
  user: {
    name: string;
    role: string;
    initials: string;
  };
}

const Header = ({ title, subtitle, user }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      
      {/* Left: Page Title & Date */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
          <span className="text-xl">🔔</span>
          {/* Red dot for unread notifications */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user.role}</p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm cursor-pointer hover:bg-emerald-700 transition-colors">
            {user.initials}
          </div>
        </div>

        {/* Logout Button (Icon only for mobile, text for desktop) */}
        <button className="ml-2 p-2 text-slate-400 hover:text-red-600 transition-colors">
          <span className="text-xl">↪️</span>
        </button>
      </div>
    </div>
  );
};

export default Header;